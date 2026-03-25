from __future__ import annotations

import io
from collections import Counter

import numpy as np
from PIL import Image

from .palette import nearest_palette_index


def _dominant(values: list[int]) -> int:
    return Counter(values).most_common(1)[0][0]


def _group_positions(mask: list[bool]) -> list[tuple[int, int]]:
    groups: list[tuple[int, int]] = []
    start: int | None = None
    for index, flag in enumerate(mask):
        if flag and start is None:
            start = index
        elif not flag and start is not None:
            groups.append((start, index - 1))
            start = None
    if start is not None:
        groups.append((start, len(mask) - 1))
    return groups


def _find_grid_lines(image: Image.Image) -> dict[str, list[int]]:
    gray = np.asarray(image.convert("L"), dtype=np.uint8)
    height, width = gray.shape
    vertical_dark = (gray < 225).sum(axis=0)
    horizontal_dark = (gray < 225).sum(axis=1)
    vertical_mask = [count > height * 0.7 for count in vertical_dark.tolist()]
    horizontal_mask = [count > width * 0.7 for count in horizontal_dark.tolist()]
    vertical_lines = [round((a + b) / 2) for a, b in _group_positions(vertical_mask)]
    horizontal_lines = [round((a + b) / 2) for a, b in _group_positions(horizontal_mask)]
    return {"vertical_lines": vertical_lines, "horizontal_lines": horizontal_lines}


def _pick_cell_centers(lines: list[int]) -> tuple[int, list[int]]:
    diffs = [b - a for a, b in zip(lines, lines[1:]) if (b - a) >= 6]
    if not diffs:
        raise ValueError("not enough grid lines")
    step = _dominant(diffs)
    filtered: list[int] = []
    prev: int | None = None
    for position in lines:
        if prev is None:
            filtered.append(position)
            prev = position
            continue
        gap = position - prev
        if abs(gap - step) <= max(2, int(step * 0.25)):
            filtered.append(position)
            prev = position
            continue
        if abs(gap - step * 2) <= max(3, int(step * 0.35)):
            filtered.append(prev + step)
            filtered.append(position)
            prev = position
            continue
        filtered.append(position)
        prev = position
    centers = [round((a + b) / 2) for a, b in zip(filtered, filtered[1:])]
    return step, centers


def _infer_chart_layout(x_centers: list[int], y_centers: list[int]) -> dict[str, int]:
    total_cols = len(x_centers)
    total_rows = len(y_centers)
    if total_cols < 5 or total_rows < 5:
        raise ValueError("grid too small")
    design_cols = total_cols - 3 if total_cols <= 9 else total_cols - 2
    design_rows = total_rows - 1 if total_rows <= 7 else total_rows - 2
    return {
        "design_cols": design_cols,
        "design_rows": design_rows,
        "x_offset": 1 if total_cols >= 10 else 0,
        "y_offset": 1 if total_rows >= 10 else 0,
    }


def _sample_grid_rgb(image: Image.Image, xs: list[int], ys: list[int]) -> list[list[list[int]]]:
    rgb = np.asarray(image.convert("RGB"), dtype=np.uint8)
    grid: list[list[list[int]]] = []
    for y in ys:
        row: list[list[int]] = []
        for x in xs:
            pixel = rgb[y, x]
            row.append([int(pixel[0]), int(pixel[1]), int(pixel[2])])
        grid.append(row)
    return grid


def _rgb_grid_to_idx_grid(grid_rgb: list[list[list[int]]]) -> list[list[int]]:
    return [
        [nearest_palette_index((rgb[0], rgb[1], rgb[2])) for rgb in row]
        for row in grid_rgb
    ]


def parse_target_chart(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    lines = _find_grid_lines(image)
    x_step, x_centers = _pick_cell_centers(lines["vertical_lines"])
    y_step, y_centers = _pick_cell_centers(lines["horizontal_lines"])
    layout = _infer_chart_layout(x_centers, y_centers)
    design_x_centers = x_centers[layout["x_offset"]:layout["x_offset"] + layout["design_cols"]]
    design_y_centers = y_centers[layout["y_offset"]:layout["y_offset"] + layout["design_rows"]]
    grid_rgb = _sample_grid_rgb(image, design_x_centers, design_y_centers)
    grid_idx = _rgb_grid_to_idx_grid(grid_rgb)
    return {
        "width": image.width,
        "height": image.height,
        "rows": len(design_y_centers),
        "cols": len(design_x_centers),
        "x_step": x_step,
        "y_step": y_step,
        "grid_rgb": grid_rgb,
        "grid_idx": grid_idx,
        "notes": [
            "Parsed chart from grid lines",
            "Heuristic layout trimming applied",
        ],
    }
