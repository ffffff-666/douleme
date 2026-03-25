from __future__ import annotations

import base64
import io
from collections import Counter

import numpy as np
from PIL import Image

from .palette import PaletteColor


def render_preview_png(grid: np.ndarray, palette: tuple[PaletteColor, ...], cell_size: int = 12) -> str:
    idx_to_color = {color.index: (color.r, color.g, color.b) for color in palette}
    rows, cols = grid.shape
    canvas = np.full((rows * cell_size, cols * cell_size, 3), 255, dtype=np.uint8)
    for r in range(rows):
        for c in range(cols):
            color = idx_to_color.get(int(grid[r, c]), (255, 255, 255))
            canvas[r * cell_size:(r + 1) * cell_size, c * cell_size:(c + 1) * cell_size] = color
    image = Image.fromarray(canvas, mode="RGB")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("ascii")


def build_color_stats(grid: np.ndarray, palette: tuple[PaletteColor, ...]) -> list[dict]:
    counter = Counter(int(v) for v in grid.flatten() if int(v) >= 0)
    idx_to_color = {color.index: color for color in palette}
    stats = []
    for idx, count in counter.most_common():
        color = idx_to_color[idx]
        stats.append({
            "id": color.id,
            "idx": color.index,
            "count": count,
            "r": color.r,
            "g": color.g,
            "b": color.b,
        })
    return stats

