from __future__ import annotations

import numpy as np


def extract_visual_skeleton(image_rgb: np.ndarray) -> dict[str, np.ndarray]:
    gray = (
        image_rgb[:, :, 0].astype(np.float32) * 0.299
        + image_rgb[:, :, 1].astype(np.float32) * 0.587
        + image_rgb[:, :, 2].astype(np.float32) * 0.114
    ).astype(np.uint8)
    gx = np.abs(np.diff(gray.astype(np.int16), axis=1, prepend=gray[:, :1]))
    gy = np.abs(np.diff(gray.astype(np.int16), axis=0, prepend=gray[:1, :]))
    grad = np.clip(gx + gy, 0, 255).astype(np.uint8)
    edges = np.where(grad > 36, 255, 0).astype(np.uint8)
    feature_mask = np.where(grad > 24, 255, 0).astype(np.uint8)
    foreground = np.where(gray < 245, 255, 0).astype(np.uint8)
    white_plane_mask = np.where(gray > 232, 255, 0).astype(np.uint8)
    forbid_gray_mask = np.where((feature_mask > 0) | (gray < 90), 255, 0).astype(np.uint8)
    return {
        "outline_mask": edges,
        "foreground_mask": foreground,
        "feature_mask": feature_mask,
        "white_plane_mask": white_plane_mask,
        "forbid_gray_mask": forbid_gray_mask,
    }
