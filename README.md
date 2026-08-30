# inLOOP

Un sito che risponde a una domanda sola: **quanto dura la tua corsa in canzoni?**

Metti la distanza, il ritmo e una canzone, e ti dice quante volte la sentirai. Cinque chilometri a ritmo normale sono sedici volte *Sportswear* della Dark Polo Gang. Poi ti prepara l'etichetta da appoggiare su una tua foto e portare in storia.

La tesi è tutta qui: la distanza non si accorcia, ma contarla in canzoni la sposta su una misura che non pesa.

## Cos'è, cosa non è

È un **concept dichiarato**: un esercizio di design e sviluppo su come sarebbe un incontro fra Spotify e Strava. Non è affiliato a nessuna delle due, e i loro colori sono citati apertamente come materiale del concept. Se un giorno diventasse un prodotto vero, quei colori vanno sostituiti: le linee guida di Strava ammettono il loro arancione solo per l'attribuzione, e lo stesso vale per il verde di Spotify.

## Com'è fatto

Un file HTML solo, senza build, senza dipendenze, senza backend. Il font arriva da Google Fonts, tutto il resto è nel file.

- `index.html` — il sito
- `design/etichette.html` — i quattro concept di etichetta, disegnati a dimensione reale sopra la stessa foto, per sceglierne uno

L'etichetta e l'anteprima sono disegnate su `<canvas>` da un solo renderer: quello che vedi nell'anteprima è esattamente il PNG che esce, a 1080×1920.

La foto dell'utente **non lascia il browser**. Non c'è upload, non c'è un server, non c'è tracciamento.

## Decisioni prese, e perché

**Niente integrazione Spotify.** Non è una scelta di comodo: da marzo 2025 per uscire dalla modalità sviluppo dell'API servono una società registrata e 250.000 utenti attivi al mese, e la modalità sviluppo stessa è scesa a cinque utenti. Un concept pubblico funzionerebbe per cinque persone. Vale anche per l'idea di incollare il link di una playlist.

**Una canzone sola, non una playlist.** Una playlist che non puoi esportare su Spotify è inutile. Una canzone in repeat invece è un tap in qualsiasi app: il sito dà il numero e l'utente lo esegue da solo, senza che noi ci colleghiamo a niente.

**Prima della corsa, non dopo.** Chiedere lo screenshot di Strava significava chiedere dati già contenuti nell'immagine, e produceva etichette che si contraddicevano da sole (il ritmo scelto a mano contro il ritmo scritto nello screenshot).

**Testo scuro sui fondi di marca.** Bianco su verde Spotify fa 2,59:1 e su arancio Strava 3,31:1, entrambi sotto il minimo di leggibilità. I fondi restano quelli del marchio, il testo sopra è scuro (7,24:1), che è poi quello che fa Spotify sui suoi stessi bottoni.

## Da fare

- Immagine per l'anteprima social (`og:image`): il meta è tolto finché non esiste il file
- Scelta dell'etichetta fra i quattro concept in `design/`

## Come va online

Il sito sta su Vercel, progetto `inloop` del team zetakiwi, con `inloop.zetakiwi.com`
puntato lì da Cloudflare (CNAME, proxy spento: col proxy acceso si finisce in un ciclo
di reindirizzamenti).

Il progetto **non è ancora collegato a GitHub**, quindi le modifiche non vanno online da
sole. L'app di Vercel su GitHub è installata sull'account, ma vede solo `jet-netto` e
`ZETAKIWI`: `loop-zk` è nata dopo e non è nell'elenco. Si aggiunge da
`github.com/settings/installations` → Vercel → Configure, e da lì il progetto si collega
in `vercel.com/zetakiwi/inloop/settings/git`.

## Sviluppo

Non serve niente: apri `index.html` nel browser.

Per il deploy, un progetto statico su Vercel senza comando di build.
