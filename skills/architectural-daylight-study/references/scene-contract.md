# Scene contract

Use one configuration object as the stable boundary between content and rendering code. This allows a new building, location, or date to reuse the same daylight-study implementation.

## Required fields

```json
{
  "model": "./models/building.glb",
  "mode": "geographic",
  "northOffsetDeg": 12,
  "location": {
    "label": "Phoenix, Arizona",
    "latitude": 33.4484,
    "longitude": -112.074,
    "timezone": "America/Phoenix"
  },
  "date": "2026-06-21",
  "timeRange": ["06:00", "19:30"],
  "presets": [
    { "id": "dawn", "label": "Dawn", "time": "06:15" },
    { "id": "morning", "label": "Morning", "time": "09:00" },
    { "id": "noon", "label": "Solar noon", "time": "12:30" },
    { "id": "golden", "label": "Golden hour", "time": "18:30" }
  ],
  "shadow": {
    "mapSize": 2048,
    "normalBias": 0.02,
    "cameraPadding": 1.25
  }
}
```

`mode` is either `geographic` or `artistic`. Geographic mode requires location, timezone, date, and north orientation. Artistic mode may omit location, but should still define the date and time labels shown to viewers or explicitly label them as mood presets.

## Coordinate conventions

- Treat one scene unit as one meter.
- Use Y as up.
- Place the ground near Y = 0.
- Record which model axis points toward architectural north before applying `northOffsetDeg`.
- Compute model and ground bounds after loading; derive camera framing and the directional-light shadow camera from those bounds.

## State model

Maintain one normalized time value and derive every visual value from it:

```text
selected local time
  -> solar azimuth/elevation
  -> directional-light position and target
  -> sun intensity and color
  -> sky/fill intensity and color
  -> exposure
  -> labels, presets, and comparison state
```

Do not let UI controls write directly to individual light or material properties. They update selected time; the scene update function calculates the rest.

## Suggested module boundaries

```text
study-config.ts       parse and validate content
solar-position.ts     time/location -> azimuth/elevation
daylight-rig.ts       sun, fill, sky, exposure
building-scene.ts     model, ground, bounds, materials
study-controller.ts   selected time and presets
study-ui.ts           slider, labels, comparison controls
quality-tier.ts       desktop/mobile/fallback decisions
```

## Geographic accuracy boundary

A correct solar position makes the sun direction plausible for a place and date, but does not make the web scene a validated daylight simulation. Avoid claims about lux, glare, daylight autonomy, heat gain, code compliance, or occupant comfort unless values come from a validated analysis pipeline such as Radiance with documented inputs.

