# Architecture beside water

Use this mode when the scene depends on a bridge, water reflection, low-angle sunlight or a full-day lighting transition.

## Model and framing

Start with real structural photos. Resolve the pylon shape, spans, deck width and cable arrangement before adding atmospheric decoration. Keep a Blender source scene and deterministic build script alongside the exported GLB when Blender is requested. Export only model/context geometry; rebuild dynamic water and solar lighting in the browser. Merge static geometry by material where that preserves editability and keeps browser draw calls low.

Choose a camera that separates primary structural elements and leaves room for their reflections. Verify the same view at desktop and portrait sizes. Distant context should establish scale without competing with the main structure. Disclose simplified orientation and skyline separately from physically calculated solar position.

## Solar convention

Construct dates with an explicit geographic UTC offset or an IANA-aware date library, not the viewer's browser timezone. When using SunCalc, its azimuth starts at south and increases toward west. For a scene with +X north, +Y up, +Z east, convert azimuth `a` and altitude `h` to:

```js
sunDirection.set(-Math.cos(a)*Math.cos(h), Math.sin(h), -Math.sin(a)*Math.cos(h));
```

Test morning and afternoon on opposite sides and check that changing season changes altitude. Derive named presets from sunrise, solar noon and sunset rather than fixed clock labels.

## Water and atmosphere

Use an actual planar reflection or another scene-aware reflection method so water reflects the bridge and its lights. Add normal variation at more than one spatial scale; reflection distortion, Fresnel response, base water color and sun glints should contribute separately. Verify that the water can receive structural shadows. Avoid a universal bright reflection offset that keeps water glowing after sunset.

Coordinate sky, fog, water and hemisphere fill through shared daylight/twilight parameters. Match fog to the visible horizon to avoid a hard stripe at the water's far edge. For an art-directed sky, retain the true solar disk direction and describe the weather palette as artistic. Do not assume a built-in sky material is visually correct without screenshots at low and high solar elevation.

If lighting uses a PMREM environment, update it after the time settles; a sunset environment left active at noon produces contradictory material color. Debounce regeneration during slider movement, lower its resolution if necessary, and dispose old render targets. Adjust environment intensity during playback even if regeneration is throttled.

At night, preserve readable bridge geometry through restrained fill and dedicated architectural lighting. Emission and sky color alone do not prove accurate light transport. Keep claims limited to the visualization actually implemented.

## Interaction and verification

- Keep time as one state value; derive light, labels and presets from it.
- Pause autonomous sea/time animation for reduced motion; explicit slider actions can render a static updated frame.
- When hiding interface controls, also remove them from keyboard navigation (for example with `inert`), and provide an accessible way back.
- Capture dawn, noon, golden hour and blue hour with an identical camera; inspect real shadow direction and reflected silhouettes, not merely UI labels.
- Validate both mobile initial load and resizing; quality tiers often select at initial load.
- Export a frame from the actual canvas, and use a complete captured poster for unavailable WebGL or JavaScript.
- On Windows, exclude generated screenshots/downloads from development-server file watching; verify the production build as the final gate.

## Reference implementation

The Century Light case study combines a Blender bridge model, SunCalc, Three.js Water, geographic sun direction, authored atmosphere, environment regeneration and accessible time controls. Its source is stored in the user's `zen-stillwater` repository under `projects/century-light`. This is an example, not a required design template for unrelated architecture.
