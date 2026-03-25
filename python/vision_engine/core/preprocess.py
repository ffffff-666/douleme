from __future__ import annotations

import io

import numpy as np
from PIL import Image, ImageFilter


def load_rgb_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.asarray(image, dtype=np.uint8)


def denoise_preserve_edges(image_rgb: np.ndarray) -> np.ndarray:
    image = Image.fromarray(image_rgb, mode="RGB")
    image = image.filter(ImageFilter.MedianFilter(size=3))
    image = image.filter(ImageFilter.GaussianBlur(radius=0.35))
    return np.asarray(image, dtype=np.uint8)


def resize_for_reference(image_rgb: np.ndarray, target_rows: int, target_cols: int) -> np.ndarray:
    image = Image.fromarray(image_rgb, mode="RGB")
    resized = image.resize((target_cols * 8, target_rows * 8), resample=Image.Resampling.BILINEAR)
    return np.asarray(resized, dtype=np.uint8)
