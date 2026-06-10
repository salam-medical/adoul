# alma:s Architekten – Website

Bilingual (DE/EN) static website for alma:s Architekten, Frankfurt am Main.
Built with [Hugo](https://gohugo.io/), deployed on Netlify.

## Local development

```sh
hugo server          # dev server at http://localhost:1313
hugo --gc --minify   # production build into public/
```

## Structure

- `content/de/`, `content/en/` – page content per language (linked via `translationKey`)
- `i18n/` – UI strings (buttons, labels, footer)
- `layouts/` – templates; page types are dispatched via the `template` front-matter param to `layouts/_partials/pages/*`
- `static/img`, `static/video`, `static/fonts` – brand assets, photography, Instagram reels
- `netlify.toml` – Netlify build configuration (Hugo 0.160, `--baseURL $URL`)

German is the default language at `/`, English lives under `/en/`.
No cookies, no trackers – no consent banner required.
