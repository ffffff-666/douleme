from __future__ import annotations

import io

from PIL import Image


def parse_target_chart(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    width, height = image.size
    return {
        "width": width,
        "height": height,
        "rows": 0,
        "cols": 0,
        "grid_rgb": [],
        "notes": ["V1 placeholder parser: target chart parser will be migrated from JS-side prototype next."],
    }

