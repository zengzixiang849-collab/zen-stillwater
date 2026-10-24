# 世纪 · 光 / Century Light

Zen's interactive study of Haikou Century Bridge above the Haidian River estuary.

## Run

Requires Node 20.19+ or 22.12+ and pnpm.

```sh
pnpm install
pnpm dev
pnpm build
```

The build is static and uses relative URLs, suitable for a GitHub Pages subdirectory. The published copy lives at `../../dist/century-bridge/`. No API keys, paid services, runtime CDN requests or external fonts are needed.

## Model

`blender/century-bridge.blend` is the editable Blender scene, including sea material, sun, camera and distant context. `scripts/build_bridge.py` rebuilds it and exports `public/models/century-bridge.glb`:

```sh
blender --background --python-exit-code 1 --python scripts/build_bridge.py
```

Created with Blender 5.2.1. The model follows reference dimensions (340 m main span, 29.8 m deck width, approximately 106.9 m pylons above the base) and includes 176 individual stays. This is a visual reconstruction, not survey or construction geometry. Shore buildings are simplified atmosphere.

## Light and sea

- SunCalc computes solar azimuth/elevation for 20.051806 N, 110.315556 E. Every selected local time is constructed with an explicit `+08:00` offset, independent of the viewer's system timezone.
- Scene +X is approximate north, +Z east. Bridge geographic orientation is approximate.
- One directional sun casts dynamic shadows. Hemisphere fill, environment response and art-directed sky vary with elevation.
- Three.js Water provides a planar reflection of the actual bridge and shoreline. Generated normal data, multi-scale ripples, Fresnel mixing, reflected sky and sunlight glints animate the sea.
- Night lighting and weather appearance are art-directed. The page is not an engineering daylight simulation or a live weather feed.
- Time slider, astronomical presets, date, day playback, two cameras, sea pause, clean view and screenshot export are available. Reduced motion pauses automatic water movement. WebGL or JavaScript failure has a captured poster.

## Verification

`scripts/inspect.cjs` records four views and creates the poster. `scripts/verify.cjs` exercises time, date, keyboard, mobile, export, dialogs and fallbacks. Both use Playwright; set `PLAYWRIGHT_MODULE`, `BROWSER_PATH` and optionally `SITE_URL` for another machine. By default they use the locally bundled Codex Playwright and installed Windows Chrome. Screenshots and reports are ignored under `output/`.

## Sources

Original geometry and project shaders were written for this study. The research photograph is not included in the deployed page.

- Structural photograph, Anna Frodesiak, CC0: https://commons.wikimedia.org/wiki/File:Haikou_Century_Bridge_from_southwest_shore_01.jpg
- Coordinates: https://commons.wikimedia.org/wiki/Category:Century_Bridge,_Haikou
- Main span dimensions, Hainan Daily public tender notice: https://news.hndaily.cn/html/2015-10/10/content_11_15.htm
- Three.js / Water: https://threejs.org/docs/pages/Water.html (MIT)
- SunCalc: https://github.com/mourner/suncalc (BSD-2-Clause)

Art direction uses the architectural-daylight-study and build-awwwards-quality-sites workflows; implementation uses Three.js lighting/material/renderer guidance. GSAP handles brief UI/camera transitions. This single-screen experience needs no smooth-scroll engine.
