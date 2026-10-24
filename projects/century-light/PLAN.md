# 世纪 · 光 / Century Light

## Experience
An authored architectural daylight study of Haikou Century Bridge above the Haidian River estuary. A fixed oblique three-quarter camera lets both diamond pylons, cable fans, bridge deck, reflected silhouettes and moving water read as a single composition. A quiet Chinese/English editorial interface belongs at the margins. Initial state: warm late afternoon. Drag local time, choose four moments, play the day, change season, pause the sea, save a still, or hide the interface.

## Implementation sequence
1. Research structural silhouette and dimensions from photographs and published bridge descriptions.
2. Use installed Blender 5.2 in background Python mode to build an editable scene: twin diamond towers, 176 stays, deck, rails, piers, lights, approach spans, restrained distant shores and a separate water surface. Save the .blend and export the bridge/context as GLB.
3. Render in Three.js. Solar position uses SunCalc at 20.051806 N, 110.315556 E with explicit UTC+08:00 date/time. Bridge north orientation is an approximate visual reconstruction, documented separately from solar computation.
4. Add custom procedural water normals, planar reflection of the actual bridge, specular sunlight, distance haze, sky scattering, restrained emissive bridge lights and adaptive quality.
5. Design a full-viewport canvas with accessible time slider, date presets, play/pause, camera reset and fallback image. No scrolling engine is needed for this single-screen viewer. GSAP handles only intro and camera transitions.
6. Validate dawn, noon, late afternoon and blue hour screenshots at the same camera. Validate mobile controls, keyboard, reduced motion, WebGL failure, resource loading and production build.
7. Store source, Blender script and model with the user's existing GitHub project. Publish the experience at /century-bridge/ after verification using the existing Pages pipeline.

## Quality decisions
- Model units: metres. Main span 340 m, main section approximately 636.6 m, deck width 29.8 m, towers approximately 106.9 m above base. 22 cables on each half-plane × 2 planes × 2 towers = 176.
- This is a reference-informed visual model, not a surveyed engineering digital twin. Simplified shore skyline is atmosphere, not a reconstruction of individual properties.
- Ocean appearance and weather are art-directed. Solar position is geographic; material illumination and water do not constitute daylight engineering analysis.
- All geometry and shaders are created for this project. Reference photos are research only. No paid tools or paid assets required initially.

## Research
- Wikimedia Commons photo by Anna Frodesiak (CC0), west-side structural reference: https://commons.wikimedia.org/wiki/File:Haikou_Century_Bridge_from_southwest_shore_01.jpg
- Wikimedia geographic metadata: https://commons.wikimedia.org/wiki/Category:Century_Bridge,_Haikou
- Hainan Daily maintenance notice (span dimensions): https://news.hndaily.cn/html/2015-10/10/content_11_15.htm
- Three.js Water documentation: https://threejs.org/docs/pages/Water.html
