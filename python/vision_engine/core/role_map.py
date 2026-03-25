from __future__ import annotations

import numpy as np


def build_role_map(
    image_rgb: np.ndarray,
    skeleton: dict[str, np.ndarray],
    target_rows: int,
    target_cols: int,
) -> np.ndarray:
    h, w, _ = image_rgb.shape
    role_map = np.zeros((target_rows, target_cols), dtype=np.int32)
    for row in range(target_rows):
        y0 = int(row * h / target_rows)
        y1 = max(y0 + 1, int((row + 1) * h / target_rows))
        for col in range(target_cols):
            x0 = int(col * w / target_cols)
            x1 = max(x0 + 1, int((col + 1) * w / target_cols))
            patch = image_rgb[y0:y1, x0:x1]
            outline_patch = skeleton["outline_mask"][y0:y1, x0:x1]
            white_patch = skeleton["white_plane_mask"][y0:y1, x0:x1]
            mean = patch.reshape(-1, 3).mean(axis=0)
            outline_ratio = float((outline_patch > 0).mean())
            white_ratio = float((white_patch > 0).mean())
            if outline_ratio > 0.22:
                role_map[row, col] = 1  # line
            elif white_ratio > 0.7:
                role_map[row, col] = 2  # white-plane
            elif mean[0] > 170 and mean[1] < 120 and mean[2] < 140:
                role_map[row, col] = 3  # accent red/pink
            elif mean[0] > 180 and mean[1] > 150 and mean[2] < 140:
                role_map[row, col] = 4  # accent yellow
            elif mean[2] > 150 and mean[0] < 170:
                role_map[row, col] = 5  # accent blue
            else:
                role_map[row, col] = 6  # main plane
    return role_map
