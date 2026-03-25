from __future__ import annotations

import numpy as np

from .palette import PaletteColor, nearest_palette_index


def project_regions_to_grid(
    image_rgb: np.ndarray,
    region_map: np.ndarray,
    palette: tuple[PaletteColor, ...],
    target_rows: int,
    target_cols: int,
) -> np.ndarray:
    h, w, _ = image_rgb.shape
    grid = np.full((target_rows, target_cols), -1, dtype=np.int32)
    for row in range(target_rows):
        y0 = int(row * h / target_rows)
        y1 = max(y0 + 1, int((row + 1) * h / target_rows))
        for col in range(target_cols):
            x0 = int(col * w / target_cols)
            x1 = max(x0 + 1, int((col + 1) * w / target_cols))
            patch = image_rgb[y0:y1, x0:x1]
            if patch.size == 0:
                continue
            mean_rgb = tuple(int(v) for v in patch.reshape(-1, 3).mean(axis=0))
            grid[row, col] = nearest_palette_index(mean_rgb, palette)
    return grid

