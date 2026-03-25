from __future__ import annotations

import io

from PIL import Image, ImageDraw

from vision_engine.core.target_chart_parser import parse_target_chart


def _build_synthetic_chart() -> bytes:
    cols = 6
    rows = 5
    cell = 20
    left_pad = cell
    top_pad = cell
    width = (cols + 2) * cell
    height = (rows + 2) * cell
    image = Image.new("RGB", (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(image)
    for x in range(0, width + 1, cell):
        draw.line((x, top_pad, x, top_pad + rows * cell), fill=(180, 180, 180), width=1)
    for y in range(top_pad, top_pad + rows * cell + 1, cell):
        draw.line((left_pad, y, left_pad + cols * cell, y), fill=(180, 180, 180), width=1)
    colors = [
        (255, 255, 255),
        (0, 0, 0),
        (240, 86, 159),
        (237, 248, 120),
    ]
    for r in range(rows):
        for c in range(cols):
            color = colors[(r + c) % len(colors)]
            x0 = left_pad + c * cell + 2
            y0 = top_pad + r * cell + 2
            x1 = left_pad + (c + 1) * cell - 2
            y1 = top_pad + (r + 1) * cell - 2
            draw.rectangle((x0, y0, x1, y1), fill=color)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def test_parse_target_chart_extracts_grid_dimensions() -> None:
    parsed = parse_target_chart(_build_synthetic_chart())
    assert parsed["rows"] == 5
    assert parsed["cols"] == 6
    assert len(parsed["grid_rgb"]) == 5
    assert len(parsed["grid_rgb"][0]) == 6
    assert len(parsed["grid_idx"]) == 5
