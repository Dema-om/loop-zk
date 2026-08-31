/* La ricerca, con la memoria condivisa fra tutti i visitatori.
   Due persone che cercano "queen" costano una chiamata sola ad Apple invece
   di due, e per un giorno intero non ne costano piu nessuna. E il motivo per
   cui il limite non si tocca piu. */
module.exports = async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 80);
  if (!q) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ errore: 'manca la parola da cercare' });
  }
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  try {
    const url = 'https://itunes.apple.com/search?media=music&entity=song&limit=12&country=IT&term='
      + encodeURIComponent(q);
    const r = await fetch(url);
    if (!r.ok) throw new Error('apple ' + r.status);
    const j = await r.json();
    const visti = new Set();
    const brani = (j.results || [])
      .filter(x => x.trackTimeMillis && x.trackName && x.artistName)
      .filter(x => {
        const k = (x.trackName + '|' + x.artistName).toLowerCase();
        if (visti.has(k)) return false;   /* lo stesso brano torna su piu album */
        visti.add(k); return true;
      })
      .slice(0, 4)
      .map(x => ({
        s: Math.round(x.trackTimeMillis / 1000),
        t: x.trackName,
        w: x.artistName,
        art: x.artworkUrl100 ? x.artworkUrl100.replace('100x100bb', '600x600bb') : null
      }));
    res.status(200).json({ brani });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ errore: String(e.message || e) });
  }
};
