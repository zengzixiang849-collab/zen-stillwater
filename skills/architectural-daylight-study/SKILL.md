---
name: architectural-daylight-study
description: Design and implement interactive architectural daylight studies for portfolio and presentation websites. Use when a user wants a building, facade, room, pavilion, or urban massing model to show visibly different shadow direction, length, silhouette, material response, and atmosphere as the time, date, location, or orientation changes. Covers Three.js scene planning, solar controls, shadow setup, UI, performance, fallbacks, and visual validation. Do not present the output as code-compliant daylight, glare, energy, or illuminance analysis; route those requirements to a validated Radiance, Ladybug, or Honeybee workflow.
---

# Architectural Daylight Study

Build a readable study of how sunlight changes architectural form. Treat the building and its shadows as the main content. Use the site's existing art direction and interaction system instead of introducing a second visual language.

## Start with the study contract

Collect or infer these inputs before implementation:

- Building source: GLB/glTF, procedural massing, or clearly named placeholder geometry
- Units and axes: meters, Y-up, with a documented front direction
- North orientation in degrees
- Location, timezone, date, and time range when geographic accuracy matters
- Intended output: cinematic portfolio piece, side-by-side comparison, or exploratory viewer
- Four or more meaningful moments such as dawn, morning, solar noon, and golden hour
- Target devices and acceptable loading budget

Use an artistic sun path when the user wants mood rather than geographic accuracy. Label that mode as artistic. Use a solar-position library or a verified azimuth/elevation data source when the user supplies real location and date inputs.

For the reusable scene configuration, follow [references/scene-contract.md](references/scene-contract.md). Validate JSON configurations with `python scripts/validate_scene_config.py <config.json>`.

## Compose the implementation

Use the available Three.js skills for API details. Apply them in this order:

1. Use `threejs-loaders` to load the model and inspect its bounds, scale, axes, and material assignments.
2. Use `threejs-scenes` and `threejs-camera` to frame the building, ground plane, sky, fog, and comparison views.
3. Use `threejs-lights` to create one shadow-casting directional sun plus restrained hemisphere or ambient fill.
4. Use `threejs-materials` to make facade, glass, metal, and ground respond legibly to grazing and direct light.
5. Use `threejs-renderers` to configure color space, tone mapping, pixel ratio, shadows, and device-specific quality.
6. Use `threejs-animation` only for clips or authored transitions. Drive time-of-day continuously with a stable clock or normalized timeline.

Keep one source of truth for study time. The slider, preset buttons, labels, sun position, sky color, exposure, and comparison snapshots must all derive from it.

## Build the light model

For bridges or architecture beside water, read [references/waterfront-lighting.md](references/waterfront-lighting.md). It covers model export, geographic coordinate conversion, reflected light, sky/water consistency and time-dependent environment maps.

Use a `DirectionalLight` as the sun. Convert the selected time to solar azimuth and elevation, then position the light far enough from the building while aiming its target at the study center. Recompute the shadow camera from the building and ground bounds instead of using a huge fixed frustum.

Enable `castShadow` only on geometry that materially affects the image. Enable `receiveShadow` on the ground and relevant facade or interior surfaces. Tune `normalBias` and shadow camera near/far planes before increasing map resolution.

Change these values together as time moves:

- Sun direction and shadow length
- Direct-light intensity and color temperature
- Sky or hemisphere contribution
- Background color or sky texture
- Renderer exposure, within a restrained range
- Human-readable time and preset state

Do not fake time changes only by recoloring the page. Each checkpoint must produce a visibly different shadow direction, length, or silhouette on the architecture.

## Design the interaction

Provide a keyboard-accessible time slider and four preset moments. Show date, local time, and location when the study is geographic. Allow direct manipulation only when it helps comparison; keep the camera fixed when the goal is to read changing light on the same form.

For a portfolio page, present one clear hero view first. Add optional features only when they improve the study:

- Before/after split view for two times
- Sun-path arc or compass overlay
- Shadow-only monochrome mode
- Saved stills for selected moments
- Short captions explaining what the light reveals

Respect reduced-motion preferences. Supply a static poster image or a simplified non-WebGL state when WebGL is unavailable.

## Tune performance

Start with a 2048 shadow map on desktop and 1024 on mobile, then adjust from measured output. Cap device pixel ratio. Avoid multiple dynamic shadow-casting lights. Use compressed textures and a compressed GLB for production. Consider cascaded shadow maps only for large exterior scenes where a single fitted shadow camera cannot retain useful detail.

Pause or reduce rendering when the study is offscreen or the tab is hidden. Re-render on demand when the camera and time are static.

## Validate the result

Check all of the following before delivery:

- At least four checkpoints create materially different architectural shadow shapes
- The building remains inside the shadow frustum throughout the time range
- No distracting shadow acne, detached shadows, clipping, or severe shimmering appears
- Facade materials retain readable form at noon and during low-angle light
- Slider, presets, and labels remain synchronized and keyboard accessible
- Desktop interaction remains smooth and mobile has a deliberate quality tier
- Reduced-motion and no-WebGL fallbacks remain understandable
- Geographic mode shows the exact location, date, timezone, and north orientation used
- Artistic mode is described as a visualization rather than measured daylight analysis

Capture the same camera view at all selected checkpoints. Compare the images side by side; revise the sun range, camera, or architecture framing if the differences are not immediately legible.
