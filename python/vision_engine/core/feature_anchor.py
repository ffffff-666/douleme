from __future__ import annotations

import numpy as np


def detect_feature_anchors(image_rgb: np.ndarray, target_rows: int, target_cols: int) -> dict[str, object]:
    h, w, _ = image_rgb.shape
    row_step = h / max(1, target_rows)
    col_step = w / max(1, target_cols)

    yellow_mask = (
        (image_rgb[:, :, 0] > 180)
        & (image_rgb[:, :, 1] > 150)
        & (image_rgb[:, :, 2] < 140)
    )
    dark_mask = (
        (image_rgb[:, :, 0] < 70)
        & (image_rgb[:, :, 1] < 70)
        & (image_rgb[:, :, 2] < 70)
    )

    anchors: list[dict[str, object]] = []

    def add_anchor(mask: np.ndarray, role: str, max_items: int, row_range: tuple[float, float], col_range: tuple[float, float]) -> None:
        ys, xs = np.where(mask)
        if len(xs) == 0:
            return
        row_min = int(h * row_range[0])
        row_max = int(h * row_range[1])
        col_min = int(w * col_range[0])
        col_max = int(w * col_range[1])
        filtered = [
            (x, y)
            for x, y in zip(xs.tolist(), ys.tolist())
            if row_min <= y <= row_max and col_min <= x <= col_max
        ]
        if not filtered:
            return
        grouped = []
        used = set()
        for idx, (x, y) in enumerate(filtered):
            if idx in used:
                continue
            cluster = [(x, y)]
            used.add(idx)
            for j in range(idx + 1, len(filtered)):
                if j in used:
                    continue
                nx, ny = filtered[j]
                if abs(nx - x) <= 10 and abs(ny - y) <= 10:
                    cluster.append((nx, ny))
                    used.add(j)
            grouped.append(cluster)
        grouped.sort(key=len, reverse=True)
        for cluster in grouped[:max_items]:
            cx = int(round(sum(x for x, _ in cluster) / len(cluster)))
            cy = int(round(sum(y for _, y in cluster) / len(cluster)))
            anchors.append(
                {
                    "role": role,
                    "x": cx,
                    "y": cy,
                    "grid_row": min(target_rows - 1, max(0, int(cy / row_step))),
                    "grid_col": min(target_cols - 1, max(0, int(cx / col_step))),
                    "size": len(cluster),
                }
            )

    add_anchor(yellow_mask, "yellow_anchor", max_items=2, row_range=(0.2, 0.65), col_range=(0.2, 0.8))
    add_anchor(dark_mask, "dark_anchor", max_items=6, row_range=(0.15, 0.7), col_range=(0.15, 0.85))
    return {"anchors": anchors}
