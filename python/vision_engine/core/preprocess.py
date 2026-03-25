from __future__ import annotations

import io

import cv2
import numpy as np
from PIL import Image


def load_rgb_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.asarray(image, dtype=np.uint8)


def denoise_preserve_edges(image_rgb: np.ndarray) -> np.ndarray:
    return cv2.bilateralFilter(image_rgb, d=5, sigmaColor=24, sigmaSpace=24)


def resize_for_reference(image_rgb: np.ndarray, target_rows: int, target_cols: int) -> np.ndarray:
    return cv2.resize(image_rgb, (target_cols * 8, target_rows * 8), interpolation=cv2.INTER_AREA)

