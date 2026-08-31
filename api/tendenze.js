/* La classifica italiana, presa una volta sola per tutti.
   Apple conta le richieste per indirizzo, e col traffico di un lancio le
   persone dietro allo stesso operatore mobile condividono un indirizzo solo:
   bruciavano il limite insieme e a ognuna usciva "l'archivio e occupato".
   Qui la chiamata parte da Vercel e la risposta resta in cache sul bordo,
   quindi Apple ne vede una ogni mezz'ora invece di una per visitatore. */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  try {
    const r = await fetch('https://itunes.apple.com/it/rss/topsongs/limit=8/json');
    if (!r.ok) throw new Error('rss ' + r.status);
    const j = await r.json();
    const ids = (j.feed && j.feed.entry || [])
      .map(x => x.id && x.id.attributes && x.id.attributes['im:id'])
      .filter(Boolean);
    if (!ids.length) throw new Error('nessun brano');

    /* Il feed non porta le durate: si chiedono tutte in una volta sola. */
    const r2 = await fetch('https://itunes.apple.com/lookup?country=IT&id=' + ids.join(','));
    if (!r2.ok) throw new Error('lookup ' + r2.status);
    const j2 = await r2.json();

    const brani = (j2.results || [])
      .filter(x => x.trackTimeMillis && x.trackName && x.artistName)
      .slice(0, 4)
      .map(x => ({
        s: Math.round(x.trackTimeMillis / 1000),
        t: x.trackName,
        w: x.artistName,
        art: x.artworkUrl100 ? x.artworkUrl100.replace('100x100bb', '600x600bb') : null
      }));
    if (!brani.length) throw new Error('nessuna durata');
    res.status(200).json({ brani });
  } catch (e) {
    /* Niente cache sugli errori: il prossimo che passa deve poter riprovare. */
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ errore: String(e.message || e) });
  }
};
