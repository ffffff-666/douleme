from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


@dataclass(frozen=True)
class PaletteColor:
    index: int
    id: str
    family: str
    r: int
    g: int
    b: int


ASSET_PATH = Path(__file__).resolve().parents[1] / "assets" / "mard221.json"


@lru_cache(maxsize=1)
def load_palette() -> tuple[PaletteColor, ...]:
    raw = json.loads(ASSET_PATH.read_text(encoding="utf-8-sig"))
    return tuple(
        PaletteColor(
            index=index,
            id=item["id"],
            family=item["family"],
            r=int(item["r"]),
            g=int(item["g"]),
            b=int(item["b"]),
        )
        for index, item in enumerate(raw)
    )


LOW_GRID_ICONIC_IDS = {
    "H1", "H2", "H17", "H7", "H8", "H16",
    "F10", "F11", "F21", "F25",
    "A21", "A22", "A24",
    "C6", "C24",
    "G7", "G8", "G11",
}


def iconic_palette_subset() -> tuple[PaletteColor, ...]:
    return tuple(color for color in load_palette() if color.id in LOW_GRID_ICONIC_IDS)


def palette_indices_by_ids(ids: set[str], palette: tuple[PaletteColor, ...] | None = None) -> set[int]:
    colors = palette or load_palette()
    return {color.index for color in colors if color.id in ids}


def nearest_palette_index(rgb: tuple[int, int, int], palette: tuple[PaletteColor, ...] | None = None) -> int:
    colors = palette or load_palette()
    r, g, b = rgb
    best_index = colors[0].index
    best_dist = float("inf")
    for color in colors:
        dist = (
            (r - color.r) * (r - color.r)
            + (g - color.g) * (g - color.g)
            + (b - color.b) * (b - color.b)
        )
        if dist < best_dist:
            best_dist = dist
            best_index = color.index
    return best_index
