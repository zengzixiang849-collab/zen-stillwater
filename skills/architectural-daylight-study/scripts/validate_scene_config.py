#!/usr/bin/env python3
"""Validate the reusable JSON contract for an architectural daylight study."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

TIME_RE = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")
ALLOWED_MAP_SIZES = {512, 1024, 2048, 4096}


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def minutes(value: str) -> int:
    hour, minute = value.split(":")
    return int(hour) * 60 + int(minute)


def validate(data: object) -> list[str]:
    errors: list[str] = []
    require(isinstance(data, dict), "root must be a JSON object", errors)
    if not isinstance(data, dict):
        return errors

    model = data.get("model")
    require(isinstance(model, str) and bool(model.strip()), "model must be a non-empty string", errors)

    mode = data.get("mode")
    require(mode in {"geographic", "artistic"}, "mode must be 'geographic' or 'artistic'", errors)

    north = data.get("northOffsetDeg")
    require(isinstance(north, (int, float)) and -180 <= north <= 180, "northOffsetDeg must be between -180 and 180", errors)

    date_value = data.get("date")
    try:
        dt.date.fromisoformat(date_value)
    except (TypeError, ValueError):
        errors.append("date must use YYYY-MM-DD")

    time_range = data.get("timeRange")
    valid_range = (
        isinstance(time_range, list)
        and len(time_range) == 2
        and all(isinstance(item, str) and TIME_RE.fullmatch(item) for item in time_range)
    )
    require(valid_range, "timeRange must contain two HH:MM strings", errors)
    if valid_range:
        require(minutes(time_range[0]) < minutes(time_range[1]), "timeRange start must be earlier than end", errors)

    if mode == "geographic":
        location = data.get("location")
        require(isinstance(location, dict), "geographic mode requires a location object", errors)
        if isinstance(location, dict):
            latitude = location.get("latitude")
            longitude = location.get("longitude")
            require(isinstance(latitude, (int, float)) and -90 <= latitude <= 90, "location.latitude must be between -90 and 90", errors)
            require(isinstance(longitude, (int, float)) and -180 <= longitude <= 180, "location.longitude must be between -180 and 180", errors)
            timezone = location.get("timezone")
            require(isinstance(timezone, str) and bool(timezone.strip()), "location.timezone is required", errors)

    presets = data.get("presets")
    require(isinstance(presets, list) and len(presets) >= 4, "presets must contain at least four moments", errors)
    if isinstance(presets, list):
        ids: set[str] = set()
        for index, preset in enumerate(presets):
            prefix = f"presets[{index}]"
            if not isinstance(preset, dict):
                errors.append(f"{prefix} must be an object")
                continue
            preset_id = preset.get("id")
            require(isinstance(preset_id, str) and bool(preset_id.strip()), f"{prefix}.id is required", errors)
            if isinstance(preset_id, str):
                require(preset_id not in ids, f"{prefix}.id must be unique", errors)
                ids.add(preset_id)
            label = preset.get("label")
            require(isinstance(label, str) and bool(label.strip()), f"{prefix}.label is required", errors)
            preset_time = preset.get("time")
            require(isinstance(preset_time, str) and bool(TIME_RE.fullmatch(preset_time)), f"{prefix}.time must use HH:MM", errors)
            if valid_range and isinstance(preset_time, str) and TIME_RE.fullmatch(preset_time):
                require(minutes(time_range[0]) <= minutes(preset_time) <= minutes(time_range[1]), f"{prefix}.time must fall inside timeRange", errors)

    shadow = data.get("shadow")
    require(isinstance(shadow, dict), "shadow must be an object", errors)
    if isinstance(shadow, dict):
        require(shadow.get("mapSize") in ALLOWED_MAP_SIZES, "shadow.mapSize must be 512, 1024, 2048, or 4096", errors)
        bias = shadow.get("normalBias")
        padding = shadow.get("cameraPadding")
        require(isinstance(bias, (int, float)) and 0 <= bias <= 0.2, "shadow.normalBias must be between 0 and 0.2", errors)
        require(isinstance(padding, (int, float)) and 1 <= padding <= 3, "shadow.cameraPadding must be between 1 and 3", errors)

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("config", type=Path)
    args = parser.parse_args()

    try:
        data = json.loads(args.config.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    errors = validate(data)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(f"OK: {args.config}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
