# Ibrahim Zaki — Network Engineer portfolio

Vue 3 + TypeScript + Tailwind 3 + Vite.

```sh
npm install
npm run dev          # development
npm run build        # type-check + production build
npm run test:unit    # unit / component tests
npm run lint
```

## Before publishing — replace the placeholders (all in `src/data/portfolio.ts`)

- `profile.photo` and the 3 project `image` URLs are **temporary builder.io links** → save the images in `src/assets/` and import them.
- `profile.cvUrl` → put the CV at `public/Ibrahim-Zaki-CV.pdf`.
- `profile.email`, `socials.*` → real links.
- Case-study text (overview, challenge, approach, outcomes, diagram, sample config) is **draft copy** written from the card summaries — edit it with the real project details.

## Contact form

Set `VITE_CONTACT_ENDPOINT` (see `.env.example`, must be https) to POST the form as JSON to Formspree/Getform/your API.
Without it the form opens the visitor's mail app (`mailto:`).

## Security

- CSP is injected into the production build (`vite.config.ts`); extra headers in `public/_headers` (Netlify / Cloudflare Pages — copy them to your host otherwise).
- Fonts are self-hosted (no Google Fonts requests).
- If you host images on another domain, add it to `img-src` in `vite.config.ts`.
