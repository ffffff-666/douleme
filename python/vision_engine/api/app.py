from __future__ import annotations

import json

try:
    from fastapi import FastAPI, File, Form, UploadFile
except ModuleNotFoundError:  # pragma: no cover - environment-dependent
    FastAPI = None  # type: ignore[assignment]
    File = Form = UploadFile = None  # type: ignore[assignment]

from .schemas import CompareResponse, GenerateConstraints, GenerateDiagnostics, GenerateResponse
from ..core.pipeline import generate_iconic_bead_art
from ..core.target_chart_parser import parse_target_chart


if FastAPI is not None:
    app = FastAPI(title="douleme vision engine", version="0.1.0")
else:  # pragma: no cover - environment-dependent
    app = None


if app is not None:
    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}


    @app.post("/vision/generate", response_model=GenerateResponse)
    async def generate(
        image: UploadFile = File(...),
        target_rows: int = Form(...),
        target_cols: int = Form(...),
        max_colors: int = Form(10),
        forbid_gray_transition: bool = Form(True),
        white_plane_priority: bool = Form(True),
    ) -> GenerateResponse:
        _ = GenerateConstraints(
            max_colors=max_colors,
            forbid_gray_transition=forbid_gray_transition,
            white_plane_priority=white_plane_priority,
        )
        result = generate_iconic_bead_art(await image.read(), target_rows=target_rows, target_cols=target_cols)
        return GenerateResponse(
            rows=result["rows"],
            cols=result["cols"],
            bead_count=result["bead_count"],
            color_count=result["color_count"],
            grid_matrix=result["grid_matrix"],
            color_stats=result["color_stats"],
            preview_png_base64=result["preview_png_base64"],
            diagnostics=GenerateDiagnostics(**result["diagnostics"]),
        )


    @app.post("/vision/compare", response_model=CompareResponse)
    async def compare(
        target_chart: UploadFile = File(...),
        generated_grid_json: str = Form(""),
    ) -> CompareResponse:
        parsed = parse_target_chart(await target_chart.read())
        generated_grid = json.loads(generated_grid_json) if generated_grid_json else []
        diff_cells: list[dict] = []
        if (
            generated_grid
            and len(generated_grid) == parsed["rows"]
            and len(generated_grid[0]) == parsed["cols"]
        ):
            for row in range(parsed["rows"]):
                for col in range(parsed["cols"]):
                    generated = int(generated_grid[row][col])
                    target = int(parsed["grid_idx"][row][col])
                    if generated != target:
                        diff_cells.append(
                            {
                                "row": row + 1,
                                "col": col + 1,
                                "generated": generated,
                                "target": target,
                            }
                        )
        notes = parsed.get("notes", [])
        return CompareResponse(
            rows=parsed["rows"],
            cols=parsed["cols"],
            diff_count=len(diff_cells),
            diff_cells=diff_cells[:200],
            notes=notes,
        )
