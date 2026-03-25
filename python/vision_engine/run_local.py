from __future__ import annotations

import argparse
import base64
import json
from pathlib import Path

from vision_engine.core.pipeline import generate_iconic_bead_art


def main() -> None:
    parser = argparse.ArgumentParser(description="Run local bead-art generation prototype")
    parser.add_argument("image")
    parser.add_argument("--rows", type=int, required=True)
    parser.add_argument("--cols", type=int, required=True)
    parser.add_argument("--output-dir", default="python_output")
    args = parser.parse_args()

    image_path = Path(args.image)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    result = generate_iconic_bead_art(
        image_path.read_bytes(),
        target_rows=args.rows,
        target_cols=args.cols,
    )

    preview_bytes = base64.b64decode(result["preview_png_base64"])
    (output_dir / "preview.png").write_bytes(preview_bytes)
    (output_dir / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"rows={result['rows']} cols={result['cols']} colors={result['color_count']} beads={result['bead_count']}")
    print(f"saved: {output_dir / 'preview.png'}")
    print(f"saved: {output_dir / 'result.json'}")


if __name__ == "__main__":
    main()
