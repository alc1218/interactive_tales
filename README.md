# Contes interactius

Interactive children's-tale web app. Eight classic tales hand-illustrated in storybook style, with personalizable character names, an educational twist that turns each story into a numbers / colors / shapes / objects lesson, an age-aware reader that scales complexity from 3 to 12, and a built-in text-to-speech reader that works in Catalan, English, Spanish, and French.

The whole site is plain static HTML/CSS/JS — no build step, no server. Open `index.html` in any modern browser and it just works (including from `file://`).

> Created by [Arcadi Llanza](https://alc1218.github.io/PersonalWebpage/).

## Features

- **Eight classic tales** — Els tres porquets, La Caputxeta Vermella, El Gegant del Pi, En Patufet, La Rateta que escombrava l'escaleta, La Ventafocs, La llebre i la tortuga, L'aneguet lleig.
- **Personalizable characters** — every story exposes its named characters (e.g. *Caputxeta*, *llop*, *iaia*); kids type in the names they want and the names appear in the prose.
- **Educational twist per reading** — pick *Numbers*, *Colors*, *Shapes*, or *Objects* before starting. The story is rewritten around the chosen theme, and the relevant words are highlighted as you read.
- **Age slider 3–12** — at younger ages each scene shows a single short sentence in larger type; at middle ages the full paragraph; at older ages the full paragraph plus a vocabulary appendix listing all the highlighted words for review.
- **Auto-reader (text-to-speech)** — every scene has a 🔊 button that reads it aloud in the current language, and a global "Read whole tale" button reads scenes sequentially with auto-scroll. Powered by the browser's `SpeechSynthesis` API, so voices come from the OS.
- **4 UI languages, 4 story languages** — Catalan, English, Spanish, French. Switch any time; tale titles, scene prose, character labels, and UI chrome all update live.
- **Light/dark theme** — auto-follows system preference; manual toggle persists in localStorage.
- **Hand-crafted storybook SVGs** — every scene and book cover is an authored vector illustration with gradients, soft shadows, and atmospheric details. Three style families exist for *Els tres porquets* (storybook / watercolor / flat) — see `comparison-tres-porquets.html` for a side-by-side view.

## Quick start

```bash
# Just open index.html in your browser. No server, no install.
open index.html              # macOS
xdg-open index.html          # Linux
start index.html             # Windows
```

If you want to serve it locally instead (handy for caching / dev tools):

```bash
python3 -m http.server 8000
# then http://localhost:8000
```

## Project structure

```
.
├── index.html            # Library landing page (book grid, header controls, footer)
├── reader.html           # Reader page (URL: reader.html?tale=<slug>[&twist=<twist>])
├── reader.js             # Reader logic: language picker, age slider, TTS, render
├── common.js             # Shared header controls (theme toggle, language dropdown, i18n)
├── styles.css            # All styles, with light/dark CSS variables
├── comparison-tres-porquets.html  # Side-by-side preview of 3 illustration styles
└── contes/               # One folder per tale; everything for that tale lives inside
    ├── aneguet-lleig/
    │   ├── data.js                    # Tale content (multilingual)
    │   ├── cover.svg                  # Original 300×300 cover
    │   ├── cover-storybook.svg        # Storybook cover used by index.html (600×800)
    │   ├── scene-ous.svg              # Original scene
    │   ├── scene-ous-storybook.svg    # Storybook version (used at runtime)
    │   └── …                          # 4–6 scenes per tale
    ├── caputxeta-vermella/
    └── …                # 6 more tales
```

Each tale folder is fully self-contained — copy a folder and the tale travels with all its art and text.

## Tale data schema

Each tale's `data.js` assigns a `window.CURRENT_TALE` object that the reader reads:

```js
window.CURRENT_TALE = {
  slug: "aneguet-lleig",
  title: {
    ca: "L'aneguet lleig",
    en: "The Ugly Duckling",
    es: "El patito feo",
    fr: "Le vilain petit canard"
  },
  characters: {
    aneguet: {
      label:   { ca: "Aneguet", en: "Duckling", es: "Patito", fr: "Caneton" },
      default: "Cisne"     // proper-name default; user can override at runtime
    },
    mare: { label: { ca: "Mare ànega", … }, default: "Anna" }
  },
  variants: {
    colors: {
      scenes: [
        {
          image: "scene-ous-storybook.svg",
          text: {
            ca: "A la vora de l'estany, la mare ànega {mare} covava els seus ous … <<4>> ous eren <<blancs>> com la neu, però l'últim era <<gris>> …",
            en: "By the pond, mother duck {mare} sat on her eggs … <<4>> eggs were <<white>> like snow, but the last was <<grey>> …",
            es: "…",
            fr: "…"
          }
        },
        // 3–5 scenes per variant
      ]
    },
    numbers: { scenes: [ … ] },
    objects: { scenes: [ … ] }
    // shapes is optional; only present in some tales
  }
};
```

Two markup tokens live inside the `text` strings:

| Token | Meaning |
|---|---|
| `{characterKey}` | Replaced at render time by the user's chosen name (or the `default` proper name if they didn't type one). The key must match a key in `characters`. |
| `<<word>>` | Renders as a highlighted educational pill. Translate the *content* per language (e.g. `<<blancs>>` → `<<white>>` → `<<blancos>>` → `<<blancs>>`). |

The reader strips both tokens before sending the text to the speech synthesizer, so audio playback reads natural prose.

## Adding a new tale

1. Create a folder `contes/<slug>/` (lowercase, hyphenated).
2. Drop in your scene SVGs and a `cover.svg` (or `cover-storybook.svg` for the new style — 3:4 portrait works best for the library grid).
3. Author `contes/<slug>/data.js` following the schema above. Include at least one variant; you don't have to provide all four (numbers / colors / shapes / objects). Disabled twists will appear greyed out in the reader for that tale.
4. Add a `<a class="book-card">` entry in `index.html` pointing at `reader.html?tale=<slug>` with the cover image. The reader page does the rest — it loads `data.js` dynamically, so no central registry to update.

## Adding or editing translations

UI strings live in the `I18N` object at the top of `common.js`. Add a new entry under each language, or add a whole new language by adding a new key (e.g. `it: { … }`) plus its flag SVG in the `FLAGS` object.

Story translations live inside each tale's `data.js` — see schema above.

## Browser notes

- **Speech voices** — Catalan (`ca-ES`) is available on macOS, iOS, and Chrome/Edge with the right OS voices installed. On systems without a Catalan voice, the reader falls back to the closest language-prefix match. EN / ES / FR voices are universally available. If `speechSynthesis` is missing entirely (rare), the audio toolbar is hidden gracefully.
- **CSS** — uses `box-decoration-break`, `-webkit-line-clamp`, CSS variables, `aspect-ratio`. All evergreen-browser-friendly.
- **`file://` mode** — tale data loads via dynamic `<script>` tag injection rather than `fetch`, so the site runs from a local file path with no server.

## Tech stack

Vanilla HTML, CSS, and JavaScript. No frameworks, no bundler, no dependencies. Hand-authored SVG illustrations.

## License

Personal project. Reach out via the link above for use beyond personal/educational contexts.
