from __future__ import annotations

import cv2
import numpy as np


def extract_visual_skeleton(image_rgb: np.ndarray) -> dict[str, np.ndarray]:
    gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 60, 160)
    edges = cv2.dilate(edges, np.ones((3, 3), np.uint8), iterations=1)
    _, foreground = cv2.threshold(gray, 245, 255, cv2.THRESH_BINARY_INV)
    foreground = cv2.morphologyEx(foreground, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    feature_mask = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    white_plane_mask = cv2.threshold(gray, 235, 255, cv2.THRESH_BINARY)[1]
    forbid_gray_mask = cv2.bitwise_or(feature_mask, cv2.Canny(gray, 20, 80))
    return {
        "outline_mask": edges,
        "foreground_mask": foreground,
        "feature_mask": feature_mask,
        "white_plane_mask": white_plane_mask,
        "forbid_gray_mask": forbid_gray_mask,
    }

