#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

from PIL import Image


def dominant(values: list[int]) -> int:
    counter = Counter(values)
    return counter.most_common(1)[0][0]


def group_positions(mask: list[bool]) -> list[tuple[int, int]]:
    groups: list[tuple[int, int]] = []
    start = None
    for i, flag in enumerate(mask):
      if flag and start is None:
        start = i
      elif not flag and start is not None:
        groups.append((start, i - 1))
        start = None
    if start is not None:
      groups.append((start, len(mask) - 1))
    return groups


def find_grid_lines(img: Image.Image) -> dict[str, list[int]]:
    gray = img.convert("L")
    width, height = gray.size
    px = gray.load()

    vertical_dark = []
    for x in range(width):
        dark = 0
        for y in range(height):
            if px[x, y] < 225:
                dark += 1
        vertical_dark.append(dark)

    horizontal_dark = []
    for y in range(height):
        dark = 0
        for x in range(width):
            if px[x, y] < 225:
                dark += 1
        horizontal_dark.append(dark)

    vertical_mask = [count > height * 0.7 for count in vertical_dark]
    horizontal_mask = [count > width * 0.7 for count in horizontal_dark]
    vertical_groups = group_positions(vertical_mask)
    horizontal_groups = group_positions(horizontal_mask)
    vertical_lines = [round((a + b) / 2) for a, b in vertical_groups]
    horizontal_lines = [round((a + b) / 2) for a, b in horizontal_groups]
    return {
        "vertical_lines": vertical_lines,
        "horizontal_lines": horizontal_lines,
    }


def pick_cell_center(lines: list[int]) -> tuple[int, list[int]]:
    diffs = [b - a for a, b in zip(lines, lines[1:]) if (b - a) >= 6]
    if not diffs:
        raise ValueError("not enough grid lines")
    step = dominant(diffs)
    filtered = []
    prev = None
    for pos in lines:
        if prev is None:
            filtered.append(pos)
            prev = pos
            continue
        gap = pos - prev
        if abs(gap - step) <= max(2, step * 0.25):
            filtered.append(pos)
            prev = pos
            continue
        if abs(gap - step * 2) <= max(3, step * 0.35):
            filtered.append(prev + step)
            filtered.append(pos)
            prev = pos
            continue
        filtered.append(pos)
        prev = pos
    centers = [round((a + b) / 2) for a, b in zip(filtered, filtered[1:])]
    return step, centers


def infer_chart_layout(x_centers: list[int], y_centers: list[int]) -> dict[str, int]:
    total_cols = len(x_centers)
    total_rows = len(y_centers)
    if total_cols < 5 or total_rows < 5:
        raise ValueError("grid too small")
    design_cols = total_cols - 2 if total_cols >= 10 else total_cols
    design_rows = total_rows - 2 if total_rows >= 10 else total_rows
    return {
        "design_cols": design_cols,
        "design_rows": design_rows,
        "x_offset": 1 if total_cols >= 10 else 0,
        "y_offset": 1 if total_rows >= 10 else 0,
    }


def sample_grid_colors(img: Image.Image, xs: list[int], ys: list[int]) -> list[list[list[int]]]:
    rgb = img.convert("RGB")
    px = rgb.load()
    grid: list[list[list[int]]] = []
    for y in ys:
        row: list[list[int]] = []
        for x in xs:
            r, g, b = px[x, y]
            row.append([r, g, b])
        grid.append(row)
    return grid


def main() -> None:
    parser = argparse.ArgumentParser(description="parse target bead chart into grid")
    parser.add_argument("image")
    parser.add_argument("--output", default="")
    args = parser.parse_args()

    image_path = Path(args.image).resolve()
    img = Image.open(image_path)
    lines = find_grid_lines(img)
    x_step, xs = pick_cell_center(lines["vertical_lines"])
    y_step, ys = pick_cell_center(lines["horizontal_lines"])
    layout = infer_chart_layout(xs, ys)
    design_xs = xs[layout["x_offset"]:layout["x_offset"] + layout["design_cols"]]
    design_ys = ys[layout["y_offset"]:layout["y_offset"] + layout["design_rows"]]
    grid = sample_grid_colors(img, design_xs, design_ys)
    result = {
        "image": str(image_path),
        "width": img.width,
        "height": img.height,
        "cols": len(design_xs),
        "rows": len(design_ys),
        "x_step": x_step,
        "y_step": y_step,
        "x_lines": lines["vertical_lines"],
        "y_lines": lines["horizontal_lines"],
        "x_centers": xs,
        "y_centers": ys,
        "design_x_centers": design_xs,
        "design_y_centers": design_ys,
        "layout": layout,
        "grid_rgb": grid,
    }
    if args.output:
        Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
