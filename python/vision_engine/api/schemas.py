from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class GenerateConstraints(BaseModel):
    max_colors: int = Field(default=10, ge=4, le=24)
    forbid_gray_transition: bool = True
    white_plane_priority: bool = True
    block_mode: Literal["iconic", "balanced"] = "iconic"


class GenerateDiagnostics(BaseModel):
    mode: str
    notes: list[str] = Field(default_factory=list)


class GenerateResponse(BaseModel):
    rows: int
    cols: int
    bead_count: int
    color_count: int
    grid_matrix: list[list[int]]
    color_stats: list[dict]
    preview_png_base64: str
    diagnostics: GenerateDiagnostics


class CompareResponse(BaseModel):
    rows: int
    cols: int
    diff_count: int
    diff_cells: list[dict]

