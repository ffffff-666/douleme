from __future__ import annotations

import numpy as np

from .palette import PaletteColor, nearest_palette_index, palette_indices_by_ids


def project_regions_to_grid(
    image_rgb: np.ndarray,
    region_map: np.ndarray,
    role_map: np.ndarray,
    palette: tuple[PaletteColor, ...],
    target_rows: int,
    target_cols: int,
) -> np.ndarray:
    h, w, _ = image_rgb.shape
    grid = np.full((target_rows, target_cols), -1, dtype=np.int32)
    white_ids = palette_indices_by_ids({"H1", "H2", "H17"}, palette)
    line_ids = palette_indices_by_ids({"H7", "H8", "H16", "G7", "G8"}, palette)
    pink_ids = palette_indices_by_ids({"F10", "F11", "F21", "F25"}, palette)
    yellow_ids = palette_indices_by_ids({"A21", "A22", "A24", "G11"}, palette)
    blue_ids = palette_indices_by_ids({"C6", "C24"}, palette)
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
            role = int(role_map[row, col])
            if role == 1 and line_ids:
                allowed = tuple(color for color in palette if color.index in line_ids)
            elif role == 2 and white_ids:
                allowed = tuple(color for color in palette if color.index in white_ids)
            elif role == 3 and pink_ids:
                allowed = tuple(color for color in palette if color.index in pink_ids)
            elif role == 4 and yellow_ids:
                allowed = tuple(color for color in palette if color.index in yellow_ids)
            elif role == 5 and blue_ids:
                allowed = tuple(color for color in palette if color.index in blue_ids)
            else:
                allowed = palette
            grid[row, col] = nearest_palette_index(mean_rgb, allowed)
    return grid
