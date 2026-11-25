# Product Images

Place product category photos in this directory. Files inside `src/assets/images/products/` are served at `/src/assets/images/products/<filename>` in development and copied to `dist/src/assets/images/products/` during `npm run build`.

## Recommended Filenames
Match the product `id` values defined in `src/data/siteData.ts` (`PRODUCTS`), using a `4:3` aspect ratio (matching the product cards in `src/components/Sections.tsx`):

- `locks.jpg` — Smart door locks (`id: 'locks'`)
- `cctv.jpg` — CCTV and cameras (`id: 'cctv'`)
- `switches.jpg` — Smart switches and lighting (`id: 'switches'`)
- `doorbells.jpg` — Video doorbells (`id: 'doorbells'`)
- `sensors.jpg` — Sensors and alarms (`id: 'sensors'`)
- `gate.jpg` — Gate and intercom (`id: 'gate'`)
- `curtains.jpg` — Smart curtains and blinds (`id: 'curtains'`)
- `solar.jpg` — Solar and inverter integration (`id: 'solar'`)
