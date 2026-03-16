# 首页功能文件（2026-03-16）

这个目录只收拢 `index.html` 运行直接依赖的功能文件。

## 已包含

- `index.html`
- `shared/god-dou-bead-registry.js`
- `shared/god-dou-cart-store.js`
- `图片生成/图像生成.html`
- `图片生成/ui.css`
- `图片生成/app.js`

## 选择依据

- `index.html` 直接引用：
  - `shared/god-dou-bead-registry.js`
  - `shared/god-dou-cart-store.js`
  - `图片生成/图像生成.html`
- `图片生成/图像生成.html` 直接引用：
  - `图片生成/ui.css`
  - `图片生成/app.js`
  - `../shared/god-dou-bead-registry.js`

## 未包含

- 各类草稿、校验脚本、设计稿文档
- `图片生成` 目录下的历史/实验文件（如 `archive/`、`mard221.mat`、`matlab_sim.py`、`pindou.m`）

这些文件目前不属于首页运行所需的最小直接依赖集合。
