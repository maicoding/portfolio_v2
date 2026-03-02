# Portfolio v2 - Experimental Narrative Edition

Neues Portfolio-Projekt mit Fokus auf:
- experimentelle Netzkunst-Atmosphaere
- klares Storytelling pro Projekt
- sehr gute Lesbarkeit auf Desktop und Mobile

## Stack

- Reines HTML/CSS/JavaScript (keine Build-Abhaengigkeit)
- Datengetriebene Projektkarten aus `projects.js`
- Interaktiver Story-Drawer mit Hook/Context/Process/Outcome/Credits
- Animierter Signal-Canvas als Hintergrundebene

## Lokal starten

```bash
cd portfolio-v2
python3 -m http.server 4173
```

Dann im Browser:
`http://localhost:4173`

## Netlify Deploy

Dieses Projekt ist als statische Site konfiguriert (`netlify.toml`):
- Build command: *(leer)*
- Publish directory: `.`

## Dateien

- `index.html`: Seitenstruktur und Kapitel
- `styles.css`: visuelles System + responsive Regeln
- `projects.js`: Projektdaten und Story-Ebenen
- `app.js`: Rendering, Drawer, Canvas, Kapitel-Observer
