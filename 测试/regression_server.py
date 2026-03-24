#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import re
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


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


class RegressionHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self) -> None:
        if self.path != "/__save_regression__":
            self.send_error(HTTPStatus.NOT_FOUND, "unknown endpoint")
            return
        length = int(self.headers.get("Content-Length", "0"))
        payload = self.rfile.read(length)
        try:
            body = json.loads(payload.decode("utf-8"))
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
