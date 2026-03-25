from vision_engine.core.palette import iconic_palette_subset, load_palette


def test_palette_loads() -> None:
    palette = load_palette()
    assert len(palette) >= 200
    iconic = iconic_palette_subset()
    assert len(iconic) >= 10

