from __future__ import annotations

import numpy as np
from scipy import ndimage

from .palette import PaletteColor


def _idx_to_color_map(palette: tuple[PaletteColor, ...]) -> dict[int, PaletteColor]:
    return {color.index: color for color in palette}


def enforce_white_planes(grid: np.ndarray, skeleton: dict[str, np.ndarray], palette: tuple[PaletteColor, ...]) -> np.ndarray:
    white_ids = {color.index for color in palette if color.id in {"H1", "H2", "H17"}}
    idx_to_color = _idx_to_color_map(palette)
    out = grid.copy()
    white_mask = skeleton["white_plane_mask"]
    rows, cols = grid.shape
    for r in range(rows):
        for c in range(cols):
            if white_mask[min(white_mask.shape[0] - 1, r * white_mask.shape[0] // rows),
                          min(white_mask.shape[1] - 1, c * white_mask.shape[1] // cols)] < 128:
                continue
            color = idx_to_color.get(int(out[r, c]))
            if color and color.id not in {"H1", "H2", "H17"}:
                out[r, c] = next(iter(white_ids))
    return out


def remove_small_components(grid: np.ndarray, min_size: int = 3) -> np.ndarray:
    out = grid.copy()
    structure = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], dtype=np.uint8)
    for color in np.unique(out):
      if color < 0:
        continue
      labeled, count = ndimage.label(out == color, structure=structure)
      for label in range(1, count + 1):
        positions = np.argwhere(labeled == label)
        if len(positions) >= min_size:
          continue
        for row, col in positions:
          neighbors = []
          for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):
            nr = row + dr
            nc = col + dc
            if 0 <= nr < out.shape[0] and 0 <= nc < out.shape[1] and out[nr, nc] != color:
              neighbors.append(int(out[nr, nc]))
          if neighbors:
            out[row, col] = max(set(neighbors), key=neighbors.count)
    return out


def suppress_gray_edges(grid: np.ndarray, palette: tuple[PaletteColor, ...]) -> np.ndarray:
    gray_ids = {color.index for color in palette if color.id in {"H4", "H5", "H9", "H10", "H11", "H23", "M10"}}
    dark_ids = {color.index for color in palette if color.id in {"H6", "H7", "H8", "H16"}}
    white_ids = {color.index for color in palette if color.id in {"H1", "H2", "H17"}}
    out = grid.copy()
    rows, cols = out.shape
    for r in range(1, rows - 1):
      for c in range(1, cols - 1):
        idx = int(out[r, c])
        if idx not in gray_ids:
          continue
        neighbors = [int(out[r + dr, c + dc]) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1))]
        if any(n in dark_ids for n in neighbors) and any(n in white_ids for n in neighbors):
          out[r, c] = next(iter(white_ids))
    return out

