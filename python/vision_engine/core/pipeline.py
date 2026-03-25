from __future__ import annotations

from .blockify import project_regions_to_grid
from .cleanup import apply_feature_anchors, enforce_white_planes, remove_small_components, suppress_gray_edges
from .feature_anchor import detect_feature_anchors
from .iconic_rules import default_iconic_rules
from .palette import iconic_palette_subset
from .preprocess import denoise_preserve_edges, load_rgb_image, resize_for_reference
from .regions import build_region_map
from .role_map import build_role_map
from .render import build_color_stats, render_preview_png
from .skeleton import extract_visual_skeleton


def generate_iconic_bead_art(
    image_bytes: bytes,
    target_rows: int,
    target_cols: int,
) -> dict:
    rules = default_iconic_rules()
    rgb = load_rgb_image(image_bytes)
    rgb = denoise_preserve_edges(rgb)
    resized = resize_for_reference(rgb, target_rows, target_cols)
    skeleton = extract_visual_skeleton(resized)
    anchors = detect_feature_anchors(resized, target_rows, target_cols)
    regions = build_region_map(resized, target_rows, target_cols)
    role_map = build_role_map(resized, skeleton, target_rows, target_cols)
    palette = iconic_palette_subset()
    grid = project_regions_to_grid(resized, regions, role_map, palette, target_rows, target_cols)
    grid = apply_feature_anchors(grid, anchors, palette)
    grid = enforce_white_planes(grid, skeleton, palette)
    if rules.forbid_gray_transition:
        grid = suppress_gray_edges(grid, palette)
    grid = remove_small_components(grid, min_size=rules.min_component_size)
    color_stats = build_color_stats(grid, palette)
    preview_png_base64 = render_preview_png(grid, palette)
    return {
        "rows": target_rows,
        "cols": target_cols,
        "grid_matrix": grid.tolist(),
        "color_stats": color_stats,
        "color_count": len(color_stats),
        "bead_count": int(sum(item["count"] for item in color_stats)),
        "preview_png_base64": preview_png_base64,
        "diagnostics": {
            "mode": "iconic",
            "notes": [
                "V1 low-grid iconic prototype with feature anchors and role-first coloring",
                f"anchors={len(anchors.get('anchors', []))}",
                "Prioritizes block planes, anti-gray edges, and white-plane cleanup",
            ],
        },
    }
