#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import io
import json
import re
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = Path(__file__).resolve().parent / "output"
DATA_URL_RE = re.compile(r"^data:(?P<mime>[^;]+);base64,(?P<data>.+)$")


def decode_data_url(data_url: str) -> tuple[str, bytes]:
    match = DATA_URL_RE.match(data_url)
    if not match:
        raise ValueError("invalid data url")
    mime = match.group("mime")
    binary = base64.b64decode(match.group("data"))
    ext = ".png"
    if mime == "image/jpeg":
        ext = ".jpg"
    elif mime == "image/webp":
        ext = ".webp"
    return ext, binary


def dominant(values: list[int]) -> int:
    counter: dict[int, int] = {}
    for value in values:
        counter[value] = counter.get(value, 0) + 1
    return sorted(counter.items(), key=lambda item: item[1], reverse=True)[0][0]


def group_positions(mask: list[bool]) -> list[tuple[int, int]]:
    groups: list[tuple[int, int]] = []
    start = None
    for i, flag in enumerate(mask):
        if flag and start is None:
            start = i
        elif not flag and start is not None:
            groups.append((start, i - 1))
            start = None
    if start is not None:
        groups.append((start, len(mask) - 1))
    return groups


def find_grid_lines(img: Image.Image) -> dict[str, list[int]]:
    gray = img.convert("L")
    width, height = gray.size
    px = gray.load()
    vertical_dark = []
    for x in range(width):
        dark = 0
        for y in range(height):
            if px[x, y] < 225:
                dark += 1
        vertical_dark.append(dark)
    horizontal_dark = []
    for y in range(height):
        dark = 0
        for x in range(width):
            if px[x, y] < 225:
                dark += 1
        horizontal_dark.append(dark)
    vertical_mask = [count > height * 0.7 for count in vertical_dark]
    horizontal_mask = [count > width * 0.7 for count in horizontal_dark]
    vertical_groups = group_positions(vertical_mask)
    horizontal_groups = group_positions(horizontal_mask)
    vertical_lines = [round((a + b) / 2) for a, b in vertical_groups]
    horizontal_lines = [round((a + b) / 2) for a, b in horizontal_groups]
    return {"vertical_lines": vertical_lines, "horizontal_lines": horizontal_lines}


def pick_cell_centers(lines: list[int]) -> tuple[int, list[int]]:
    diffs = [b - a for a, b in zip(lines, lines[1:]) if (b - a) >= 6]
    if not diffs:
        raise ValueError("not enough grid lines")
    step = dominant(diffs)
    filtered = []
    prev = None
    for pos in lines:
        if prev is None:
            filtered.append(pos)
            prev = pos
            continue
        gap = pos - prev
        if abs(gap - step) <= max(2, int(step * 0.25)):
            filtered.append(pos)
            prev = pos
            continue
        if abs(gap - step * 2) <= max(3, int(step * 0.35)):
            filtered.append(prev + step)
            filtered.append(pos)
            prev = pos
            continue
        filtered.append(pos)
        prev = pos
    centers = [round((a + b) / 2) for a, b in zip(filtered, filtered[1:])]
    return step, centers


def infer_chart_layout(x_centers: list[int], y_centers: list[int]) -> dict[str, int]:
    total_cols = len(x_centers)
    total_rows = len(y_centers)
    if total_cols < 5 or total_rows < 5:
        raise ValueError("grid too small")
    return {
        "design_cols": total_cols - 2 if total_cols >= 10 else total_cols,
        "design_rows": total_rows - 1 if total_rows >= 10 else total_rows,
        "x_offset": 1 if total_cols >= 10 else 0,
        "y_offset": 1 if total_rows >= 10 else 0,
    }


def sample_grid_colors(img: Image.Image, xs: list[int], ys: list[int]) -> list[list[list[int]]]:
    rgb = img.convert("RGB")
    px = rgb.load()
    grid: list[list[list[int]]] = []
    for y in ys:
        row: list[list[int]] = []
        for x in xs:
            r, g, b = px[x, y]
            row.append([r, g, b])
        grid.append(row)
    return grid


def parse_target_chart_from_data_url(data_url: str) -> dict[str, object]:
    _, binary = decode_data_url(data_url)
    img = Image.open(io.BytesIO(binary))
    lines = find_grid_lines(img)
    x_step, xs = pick_cell_centers(lines["vertical_lines"])
    y_step, ys = pick_cell_centers(lines["horizontal_lines"])
    layout = infer_chart_layout(xs, ys)
    design_xs = xs[layout["x_offset"]:layout["x_offset"] + layout["design_cols"]]
    design_ys = ys[layout["y_offset"]:layout["y_offset"] + layout["design_rows"]]
    grid = sample_grid_colors(img, design_xs, design_ys)
    return {
        "width": img.width,
        "height": img.height,
        "cols": len(design_xs),
        "rows": len(design_ys),
        "x_step": x_step,
        "y_step": y_step,
        "grid_rgb": grid,
    }


class RegressionHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self) -> None:
        if self.path not in ("/__save_regression__", "/__parse_target_grid__"):
            self.send_error(HTTPStatus.NOT_FOUND, "unknown endpoint")
            return
        length = int(self.headers.get("Content-Length", "0"))
        payload = self.rfile.read(length)
        try:
            body = json.loads(payload.decode("utf-8"))
            if self.path == "/__parse_target_grid__":
                result = parse_target_chart_from_data_url(str(body.get("targetDataUrl") or ""))
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": True, "result": result}, ensure_ascii=False).encode("utf-8"))
                return
            run_id = str(body.get("runId") or "adhoc")
            case_id = str(body.get("caseId") or "case")
            safe_run = re.sub(r"[^0-9A-Za-z._-]+", "-", run_id).strip("-") or "adhoc"
            safe_case = re.sub(r"[^0-9A-Za-z._-]+", "-", case_id).strip("-") or "case"
            case_dir = OUTPUT_ROOT / safe_run / safe_case
            case_dir.mkdir(parents=True, exist_ok=True)

            saved_files: list[str] = []
            for key, file_name in (
                ("originalDataUrl", "original"),
                ("targetDataUrl", "target"),
                ("resultDataUrl", "current"),
                ("targetLargeDataUrl", "target-large"),
                ("currentLargeDataUrl", "current-large"),
                ("heatmapDataUrl", "heatmap"),
            ):
                data_url = body.get(key)
                if not data_url:
                    continue
                ext, binary = decode_data_url(str(data_url))
                target_path = case_dir / f"{file_name}{ext}"
                target_path.write_bytes(binary)
                saved_files.append(str(target_path.relative_to(ROOT)))

            metadata = {
                "caseId": case_id,
                "runId": run_id,
                "name": body.get("name"),
                "category": body.get("category"),
                "metrics": body.get("metrics"),
                "issues": body.get("issues"),
                "issueCells": body.get("issueCells"),
                "snapshot": body.get("snapshot"),
            }
            metadata_path = case_dir / "report.json"
            metadata_path.write_text(
                json.dumps(metadata, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            saved_files.append(str(metadata_path.relative_to(ROOT)))

            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                json.dumps({"ok": True, "saved": saved_files}, ensure_ascii=False).encode("utf-8")
            )
        except Exception as exc:  # noqa: BLE001
            self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(
                json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False).encode("utf-8")
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="douleme regression local server")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.bind, args.port), RegressionHandler)
    print(f"Serving {ROOT} on http://{args.bind}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
