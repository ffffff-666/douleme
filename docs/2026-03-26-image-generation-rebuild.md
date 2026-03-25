# douleme 图像生成重构需求文档

日期：2026-03-26

## 1. 文档目标
- 统一整理当前拼豆项目里“图像生成/工程生图”相关的整体需求。
- 明确目标拼豆图应该长什么样。
- 明确当前已经开始做的内容、正在推进的内容、以及还没开始但准备优化的内容。
- 为 `feat/douleme-python-vision-engine` 分支后续实现提供统一依据。

## 2. 项目范围
- 项目：`D:\AI-Develop\douleme`
- 当前重点链路：
  - 首页 / AI 候选流程
  - 工程生图链路
  - 拼豆结果页 / 编辑页
  - 图像生成算法
  - 目标图纸解析
  - 后续批量回归与效果验证

## 3. 当前核心问题
- 现有图像生成效果更像“缩小后的图”，不像“手绘式拼豆图”。
- 低格数场景下，常见问题包括：
  - 杂色太多
  - 过渡色太多
  - 黑白之间长灰
  - 白色大面不干净
  - 小碎块太多
  - 关键特征会被淡化或吞掉
- 当前前端 `图片生成/app.js` 已经承载了过多的图像计算职责，后续不适合作为长期主视觉引擎。

## 4. 目标拼豆图的特点

### 4.1 总目标
- 生成结果要更像“人工手绘拼豆图”，而不是“自动缩略图”。

### 4.2 视觉特征
- 一片就是一片
  - 一个区域尽量一个主色
  - 不要没必要的颜色淡化和渐变
- 黑白边界不长灰
  - 线稿边和白面边不能自动冒出灰色中间层
- 白面整片化
  - 白脸、白车身、白背景留白等区域尽量干净
- 关键特征明显
  - 鼻子、眼睛、嘴、蝴蝶结、logo 核心点等必须保住
- 低格数下仍然一眼能认出主体
  - 主体识别度优先于局部色差
- 好拼
  - 色彩不复杂
  - 色块清楚
  - 颗粒区域稳定

### 4.3 适用图型
- 当前主攻图型：
  - Q版
  - 可爱卡通
  - 动漫
  - logo
  - emoji / 表情包
- 当前不主攻：
  - 写实人像
  - 复杂摄影图
  - 高纹理风景类

## 5. 数据与参考来源
- 参考素材目录：
  - `D:\AI-Develop\douleme\素材`
- 当前样本价值：
  - 有原图
  - 有目标拼豆图纸
  - 可用于对齐、回归、目标图解析验证

## 6. 架构方向

### 6.1 总体方向
- 前端不再长期承载主视觉算法。
- 重构为：
  - 前端 = 创作工作台
  - Python = 视觉引擎

### 6.2 前端保留
- 上传图片
- 选择目标格数
- 选择风格参数
- AI 候选选择
- 结果展示
- 编辑器轻量交互
- 材料清单 / 购物车 / 下单流程

### 6.3 Python 接管
- 图像预处理
- 目标图纸解析
- 视觉骨架提取
- 区域块面化
- 颜色角色分配
- 禁灰 / 白面净化 / 碎块吞并
- MARD221 映射
- 预览图生成
- 后续 compare / batch regression 能力

## 7. 当前已开始做的内容

### 7.1 已开始的 Python 原型分支
- 分支：`feat/douleme-python-vision-engine`
- 已建立最小 Python 结构：
  - `python/vision_engine/api`
  - `python/vision_engine/core`
  - `python/vision_engine/assets`
  - `python/vision_engine/tests`

### 7.2 已创建的核心文件
- `pyproject.toml`
- `python/vision_engine/assets/mard221.json`
- `python/vision_engine/core/preprocess.py`
- `python/vision_engine/core/skeleton.py`
- `python/vision_engine/core/regions.py`
- `python/vision_engine/core/palette.py`
- `python/vision_engine/core/blockify.py`
- `python/vision_engine/core/cleanup.py`
- `python/vision_engine/core/target_chart_parser.py`
- `python/vision_engine/core/pipeline.py`
- `python/vision_engine/api/app.py`
- `python/vision_engine/run_local.py`

### 7.3 已进入原型的能力
- MARD221 资产已迁到 Python 侧
- 已有最小 low-grid iconic 生成链
- 已加入：
  - feature anchors
  - role-first coloring
  - white-plane cleanup
  - anti-gray edges
  - small component merge
- 已有本地 CLI：
  - `python/vision_engine/run_local.py`

## 8. 目前打算做的内容

### 8.1 Python V1 必做
1. 目标图纸解析
2. low-grid iconic 生成
3. 预览图输出
4. 颜色统计输出
5. 生成诊断信息

### 8.2 low-grid iconic 生成主链
```text
输入图
  ↓
preprocess
  ↓
visual skeleton
  ↓
region abstraction
  ↓
palette constraints
  ↓
blockify + cleanup
  ↓
render output
```

### 8.3 当前规则方向
- 特征优先于颜色平均
- 角色优先于最近色
- 默认拒绝大多数过渡色
- 白面优先整片化
- 黑白边界默认禁灰
- 小碎块优先吞并

## 9. 还没开始但准备优化的内容

### 9.1 target_chart_parser 进一步增强
- 支持更多目标图纸模板
- 更稳的 rows / cols 提取
- 更稳的 grid_rgb / grid_idx 对齐

### 9.2 visual skeleton 升级
- silhouette 更稳
- feature anchors 更稳
- forbid_gray_mask 更准
- white_plane_mask 更准

### 9.3 角色分区升级
- line / white-plane / main-color / accent / feature-anchor 分区更准确
- 减少错误角色归类

### 9.4 生成效果升级
- 更强白面净化
- 更强黑白边禁灰
- 更强碎块合并
- 更少过渡粉 / 过渡肉色 / 过渡灰

### 9.5 compare / regression
- 不是当前第一优先
- 但后续一定要接
- 主要用于：
  - 目标图对齐
  - diff cells
  - heatmap
  - summary

## 10. 当前不做的内容
- 不做端到端 ML
- 不做复杂人像保真
- 不做全图型统一引擎
- 不做大而全 compare 平台
- 不做前端页面层大改造

## 11. 当前阶段的验收重点
- Python 侧能独立跑起来
- Python 侧生成链不再依赖前端页面状态机
- low-grid iconic 场景下，结果开始朝“块面化拼豆图”方向收敛
- 后续继续围绕：
  - 白面
  - 灰边
  - 碎块
  - 特征保留
  做定向优化

## 12. 最终结论
- 这次重构不是简单换语言，而是重写图像生成思路。
- 目标不是“更像原图”，而是“更像手绘拼豆图”。
- 当前已经开始进入 Python 原型实现阶段。
- 后续将在 `feat/douleme-python-vision-engine` 上继续推进。
