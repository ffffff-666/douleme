from __future__ import annotations

import numpy as np


def build_region_map(image_rgb: np.ndarray, target_rows: int, target_cols: int) -> np.ndarray:
    height, width, _ = image_rgb.shape
    block_h = max(4, height // max(1, target_rows // 2))
    block_w = max(4, width // max(1, target_cols // 2))
    region_map = np.zeros((height, width), dtype=np.int32)
    region_id = 1
    for y in range(0, height, block_h):
        for x in range(0, width, block_w):
            region_map[y:y + block_h, x:x + block_w] = region_id
            region_id += 1
    return region_map
