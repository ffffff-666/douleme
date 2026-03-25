from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class IconicRules:
    max_colors: int = 10
    forbid_gray_transition: bool = True
    white_plane_priority: bool = True
    min_component_size: int = 3


def default_iconic_rules() -> IconicRules:
    return IconicRules()
