from __future__ import annotations

import numpy as np
from skimage.segmentation import slic


def build_region_map(image_rgb: np.ndarray, target_rows: int, target_cols: int) -> np.ndarray:
    segments = max(32, min(180, target_rows * target_cols // 2))
    return slic(image_rgb, n_segments=segments, compactness=8.0, start_label=1, channel_axis=2)

