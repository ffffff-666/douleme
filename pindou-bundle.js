/* ============================================================================
 * pindou-bundle.js — 拼豆生图工具完整运行时
 * 自动生成，请勿手改。修改源码后跑 tools/build/build-bundle.sh 重新生成。
 *
 * 包含模块（按加载顺序）:
 *   1.  god-dou-bead-registry  色号注册表
 *   2.  vendor/fft             第三方 FFT
 *   3.  image-ops              图像基础操作
 *   4.  fft-utils              FFT 工具
 *   5.  peak-detector          峰值检测
 *   6.  grid-estimator         网格尺寸估计
 *   7.  grid-refiner           网格细化
 *   8.  samplers               像素采样
 *   9.  perfect-pixel          PP 主入口
 *   10. app                    业务主控（注入 PerfectPixelHooks）
 *   11. bridge                 PP↔MARD 桥接 + 清噪
 *   12. palette-interaction    色板交互 UI
 *
 * 全局对象（挂在 window 上）:
 *   GodDouBeadRegistry   色号注册表
 *   FFT                  第三方 FFT
 *   PerfectPixelImageOps / PerfectPixelFFT / PerfectPixelPeakDetector
 *   PerfectPixelGridEstimator / PerfectPixelGridRefiner / PerfectPixelSamplers
 *   PerfectPixel         PP 主入口（getPerfectPixel）
 *   PerfectPixelHooks    app.js 注入的 hook（rgbToLab/MARD_PALETTE/...）
 *   PerfectPixelBridge   bridge.js 暴露（runPerfectPixelPipeline 等）
 *   PaletteInteraction   palette-interaction.js 暴露（init/toggleColor/destroy 等）
 *   MARD_PALETTE         全局 MARD 调色板（来自 app.js）
 *
 * 加载方式（HTML 中只需一行）:
 *   <script src="pindou-bundle.js"></script>
 * ============================================================================
 */


/* ============================================================================
 * 模块: god-dou-bead-registry.js
 * 源路径: src/shared/god-dou-bead-registry.js
 * 行数: 76
 * 说明: 色号注册表 — 提供 GodDouBeadRegistry，含默认 MARD-221 系列定义
 * ============================================================================ */
(function (global) {
  const registry = {
    defaults: {
      'ai-generate': { seriesId: 'mard', variantId: '221' },
      'image-convert': { seriesId: 'mard', variantId: '221' }
    },
    series: {
      mard: {
        id: 'mard',
        label: 'MARD',
        description: 'MARD 系列拼豆色号体系',
        variants: {
          '221': {
            id: '221',
            label: '221色',
            displayLabel: 'MARD（221色）',
            enabled: true,
            available: true,
            channelSupport: ['ai-generate', 'image-convert']
          },
          '120': {
            id: '120',
            label: '120色',
            displayLabel: 'MARD（120色）',
            enabled: false,
            available: false,
            channelSupport: ['ai-generate', 'image-convert']
          }
        }
      }
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getDefault(channel) {
    const fallback = registry.defaults['image-convert'];
    const target = registry.defaults[channel] || fallback;
    return clone(target);
  }

  function getSeries(seriesId) {
    const series = registry.series[seriesId];
    return series ? clone(series) : null;
  }

  function getVariant(seriesId, variantId) {
    const series = registry.series[seriesId];
    if (!series) return null;
    const variant = series.variants[variantId];
    if (!variant) return null;
    return clone({
      ...variant,
      seriesId,
      seriesLabel: series.label,
      displayLabel: variant.displayLabel || `${series.label}（${variant.label}）`
    });
  }

  function getDisplayLabel(channel) {
    const current = getDefault(channel);
    return getVariant(current.seriesId, current.variantId)?.displayLabel || 'MARD（221色）';
  }

  global.GodDouBeadRegistry = {
    getRegistry() {
      return clone(registry);
    },
    getDefault,
    getSeries,
    getVariant,
    getDisplayLabel
  };
})(window);


/* ============================================================================
 * 模块: fft.js
 * 源路径: src/perfectPixel/js/vendor/fft.js
 * 行数: 524
 * 说明: 第三方 FFT 库 — 由 perfectPixel 项目自带，root.FFT
 * ============================================================================ */
// ============================================================================
// fft.js — vendored from https://github.com/indutny/fft.js (MIT License)
// Copyright Fedor Indutny, 2017. MIT License.
// Source: https://raw.githubusercontent.com/indutny/fft.js/master/lib/fft.js
//
// Wrapped in an IIFE so the original `module.exports = FFT;` does not break
// in a plain browser environment. Exposes `window.FFT` (and honors CommonJS
// if available for Node-side tests).
// ============================================================================
(function (root) {
'use strict';

function FFT(size) {
  this.size = size | 0;
  if (this.size <= 1 || (this.size & (this.size - 1)) !== 0)
    throw new Error('FFT size must be a power of two and bigger than 1');

  this._csize = size << 1;

  // NOTE: Use of `var` is intentional for old V8 versions
  var table = new Array(this.size * 2);
  for (var i = 0; i < table.length; i += 2) {
    const angle = Math.PI * i / this.size;
    table[i] = Math.cos(angle);
    table[i + 1] = -Math.sin(angle);
  }
  this.table = table;

  // Find size's power of two
  var power = 0;
  for (var t = 1; this.size > t; t <<= 1)
    power++;

  // Calculate initial step's width:
  //   * If we are full radix-4 - it is 2x smaller to give inital len=8
  //   * Otherwise it is the same as `power` to give len=4
  this._width = power % 2 === 0 ? power - 1 : power;

  // Pre-compute bit-reversal patterns
  this._bitrev = new Array(1 << this._width);
  for (var j = 0; j < this._bitrev.length; j++) {
    this._bitrev[j] = 0;
    for (var shift = 0; shift < this._width; shift += 2) {
      var revShift = this._width - shift - 2;
      this._bitrev[j] |= ((j >>> shift) & 3) << revShift;
    }
  }

  this._out = null;
  this._data = null;
  this._inv = 0;
}
// module.exports moved to the IIFE footer for browser compatibility.

FFT.prototype.fromComplexArray = function fromComplexArray(complex, storage) {
  var res = storage || new Array(complex.length >>> 1);
  for (var i = 0; i < complex.length; i += 2)
    res[i >>> 1] = complex[i];
  return res;
};

FFT.prototype.createComplexArray = function createComplexArray() {
  const res = new Array(this._csize);
  for (var i = 0; i < res.length; i++)
    res[i] = 0;
  return res;
};

FFT.prototype.toComplexArray = function toComplexArray(input, storage) {
  var res = storage || this.createComplexArray();
  for (var i = 0; i < res.length; i += 2) {
    res[i] = input[i >>> 1];
    res[i + 1] = 0;
  }
  return res;
};

FFT.prototype.completeSpectrum = function completeSpectrum(spectrum) {
  var size = this._csize;
  var half = size >>> 1;
  for (var i = 2; i < half; i += 2) {
    spectrum[size - i] = spectrum[i];
    spectrum[size - i + 1] = -spectrum[i + 1];
  }
};

FFT.prototype.transform = function transform(out, data) {
  if (out === data)
    throw new Error('Input and output buffers must be different');

  this._out = out;
  this._data = data;
  this._inv = 0;
  this._transform4();
  this._out = null;
  this._data = null;
};

FFT.prototype.realTransform = function realTransform(out, data) {
  if (out === data)
    throw new Error('Input and output buffers must be different');

  this._out = out;
  this._data = data;
  this._inv = 0;
  this._realTransform4();
  this._out = null;
  this._data = null;
};

FFT.prototype.inverseTransform = function inverseTransform(out, data) {
  if (out === data)
    throw new Error('Input and output buffers must be different');

  this._out = out;
  this._data = data;
  this._inv = 1;
  this._transform4();
  for (var i = 0; i < out.length; i++)
    out[i] /= this.size;
  this._out = null;
  this._data = null;
};

// radix-4 implementation
//
// NOTE: Uses of `var` are intentional for older V8 version that do not
// support both `let compound assignments` and `const phi`
FFT.prototype._transform4 = function _transform4() {
  var out = this._out;
  var size = this._csize;

  // Initial step (permute and transform)
  var width = this._width;
  var step = 1 << width;
  var len = (size / step) << 1;

  var outOff;
  var t;
  var bitrev = this._bitrev;
  if (len === 4) {
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      const off = bitrev[t];
      this._singleTransform2(outOff, off, step);
    }
  } else {
    // len === 8
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      const off = bitrev[t];
      this._singleTransform4(outOff, off, step);
    }
  }

  // Loop through steps in decreasing order
  var inv = this._inv ? -1 : 1;
  var table = this.table;
  for (step >>= 2; step >= 2; step >>= 2) {
    len = (size / step) << 1;
    var quarterLen = len >>> 2;

    // Loop through offsets in the data
    for (outOff = 0; outOff < size; outOff += len) {
      // Full case
      var limit = outOff + quarterLen;
      for (var i = outOff, k = 0; i < limit; i += 2, k += step) {
        const A = i;
        const B = A + quarterLen;
        const C = B + quarterLen;
        const D = C + quarterLen;

        // Original values
        const Ar = out[A];
        const Ai = out[A + 1];
        const Br = out[B];
        const Bi = out[B + 1];
        const Cr = out[C];
        const Ci = out[C + 1];
        const Dr = out[D];
        const Di = out[D + 1];

        // Middle values
        const MAr = Ar;
        const MAi = Ai;

        const tableBr = table[k];
        const tableBi = inv * table[k + 1];
        const MBr = Br * tableBr - Bi * tableBi;
        const MBi = Br * tableBi + Bi * tableBr;

        const tableCr = table[2 * k];
        const tableCi = inv * table[2 * k + 1];
        const MCr = Cr * tableCr - Ci * tableCi;
        const MCi = Cr * tableCi + Ci * tableCr;

        const tableDr = table[3 * k];
        const tableDi = inv * table[3 * k + 1];
        const MDr = Dr * tableDr - Di * tableDi;
        const MDi = Dr * tableDi + Di * tableDr;

        // Pre-Final values
        const T0r = MAr + MCr;
        const T0i = MAi + MCi;
        const T1r = MAr - MCr;
        const T1i = MAi - MCi;
        const T2r = MBr + MDr;
        const T2i = MBi + MDi;
        const T3r = inv * (MBr - MDr);
        const T3i = inv * (MBi - MDi);

        // Final values
        const FAr = T0r + T2r;
        const FAi = T0i + T2i;

        const FCr = T0r - T2r;
        const FCi = T0i - T2i;

        const FBr = T1r + T3i;
        const FBi = T1i - T3r;

        const FDr = T1r - T3i;
        const FDi = T1i + T3r;

        out[A] = FAr;
        out[A + 1] = FAi;
        out[B] = FBr;
        out[B + 1] = FBi;
        out[C] = FCr;
        out[C + 1] = FCi;
        out[D] = FDr;
        out[D + 1] = FDi;
      }
    }
  }
};

// radix-2 implementation
//
// NOTE: Only called for len=4
FFT.prototype._singleTransform2 = function _singleTransform2(outOff, off,
                                                             step) {
  const out = this._out;
  const data = this._data;

  const evenR = data[off];
  const evenI = data[off + 1];
  const oddR = data[off + step];
  const oddI = data[off + step + 1];

  const leftR = evenR + oddR;
  const leftI = evenI + oddI;
  const rightR = evenR - oddR;
  const rightI = evenI - oddI;

  out[outOff] = leftR;
  out[outOff + 1] = leftI;
  out[outOff + 2] = rightR;
  out[outOff + 3] = rightI;
};

// radix-4
//
// NOTE: Only called for len=8
FFT.prototype._singleTransform4 = function _singleTransform4(outOff, off,
                                                             step) {
  const out = this._out;
  const data = this._data;
  const inv = this._inv ? -1 : 1;
  const step2 = step * 2;
  const step3 = step * 3;

  // Original values
  const Ar = data[off];
  const Ai = data[off + 1];
  const Br = data[off + step];
  const Bi = data[off + step + 1];
  const Cr = data[off + step2];
  const Ci = data[off + step2 + 1];
  const Dr = data[off + step3];
  const Di = data[off + step3 + 1];

  // Pre-Final values
  const T0r = Ar + Cr;
  const T0i = Ai + Ci;
  const T1r = Ar - Cr;
  const T1i = Ai - Ci;
  const T2r = Br + Dr;
  const T2i = Bi + Di;
  const T3r = inv * (Br - Dr);
  const T3i = inv * (Bi - Di);

  // Final values
  const FAr = T0r + T2r;
  const FAi = T0i + T2i;

  const FBr = T1r + T3i;
  const FBi = T1i - T3r;

  const FCr = T0r - T2r;
  const FCi = T0i - T2i;

  const FDr = T1r - T3i;
  const FDi = T1i + T3r;

  out[outOff] = FAr;
  out[outOff + 1] = FAi;
  out[outOff + 2] = FBr;
  out[outOff + 3] = FBi;
  out[outOff + 4] = FCr;
  out[outOff + 5] = FCi;
  out[outOff + 6] = FDr;
  out[outOff + 7] = FDi;
};

// Real input radix-4 implementation
FFT.prototype._realTransform4 = function _realTransform4() {
  var out = this._out;
  var size = this._csize;

  // Initial step (permute and transform)
  var width = this._width;
  var step = 1 << width;
  var len = (size / step) << 1;

  var outOff;
  var t;
  var bitrev = this._bitrev;
  if (len === 4) {
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      const off = bitrev[t];
      this._singleRealTransform2(outOff, off >>> 1, step >>> 1);
    }
  } else {
    // len === 8
    for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
      const off = bitrev[t];
      this._singleRealTransform4(outOff, off >>> 1, step >>> 1);
    }
  }

  // Loop through steps in decreasing order
  var inv = this._inv ? -1 : 1;
  var table = this.table;
  for (step >>= 2; step >= 2; step >>= 2) {
    len = (size / step) << 1;
    var halfLen = len >>> 1;
    var quarterLen = halfLen >>> 1;
    var hquarterLen = quarterLen >>> 1;

    // Loop through offsets in the data
    for (outOff = 0; outOff < size; outOff += len) {
      for (var i = 0, k = 0; i <= hquarterLen; i += 2, k += step) {
        var A = outOff + i;
        var B = A + quarterLen;
        var C = B + quarterLen;
        var D = C + quarterLen;

        // Original values
        var Ar = out[A];
        var Ai = out[A + 1];
        var Br = out[B];
        var Bi = out[B + 1];
        var Cr = out[C];
        var Ci = out[C + 1];
        var Dr = out[D];
        var Di = out[D + 1];

        // Middle values
        var MAr = Ar;
        var MAi = Ai;

        var tableBr = table[k];
        var tableBi = inv * table[k + 1];
        var MBr = Br * tableBr - Bi * tableBi;
        var MBi = Br * tableBi + Bi * tableBr;

        var tableCr = table[2 * k];
        var tableCi = inv * table[2 * k + 1];
        var MCr = Cr * tableCr - Ci * tableCi;
        var MCi = Cr * tableCi + Ci * tableCr;

        var tableDr = table[3 * k];
        var tableDi = inv * table[3 * k + 1];
        var MDr = Dr * tableDr - Di * tableDi;
        var MDi = Dr * tableDi + Di * tableDr;

        // Pre-Final values
        var T0r = MAr + MCr;
        var T0i = MAi + MCi;
        var T1r = MAr - MCr;
        var T1i = MAi - MCi;
        var T2r = MBr + MDr;
        var T2i = MBi + MDi;
        var T3r = inv * (MBr - MDr);
        var T3i = inv * (MBi - MDi);

        // Final values
        var FAr = T0r + T2r;
        var FAi = T0i + T2i;

        var FBr = T1r + T3i;
        var FBi = T1i - T3r;

        out[A] = FAr;
        out[A + 1] = FAi;
        out[B] = FBr;
        out[B + 1] = FBi;

        // Output final middle point
        if (i === 0) {
          var FCr = T0r - T2r;
          var FCi = T0i - T2i;
          out[C] = FCr;
          out[C + 1] = FCi;
          continue;
        }

        // Do not overwrite ourselves
        if (i === hquarterLen)
          continue;

        // In the flipped case:
        // MAi = -MAi
        // MBr=-MBi, MBi=-MBr
        // MCr=-MCr
        // MDr=MDi, MDi=MDr
        var ST0r = T1r;
        var ST0i = -T1i;
        var ST1r = T0r;
        var ST1i = -T0i;
        var ST2r = -inv * T3i;
        var ST2i = -inv * T3r;
        var ST3r = -inv * T2i;
        var ST3i = -inv * T2r;

        var SFAr = ST0r + ST2r;
        var SFAi = ST0i + ST2i;

        var SFBr = ST1r + ST3i;
        var SFBi = ST1i - ST3r;

        var SA = outOff + quarterLen - i;
        var SB = outOff + halfLen - i;

        out[SA] = SFAr;
        out[SA + 1] = SFAi;
        out[SB] = SFBr;
        out[SB + 1] = SFBi;
      }
    }
  }
};

// radix-2 implementation
//
// NOTE: Only called for len=4
FFT.prototype._singleRealTransform2 = function _singleRealTransform2(outOff,
                                                                     off,
                                                                     step) {
  const out = this._out;
  const data = this._data;

  const evenR = data[off];
  const oddR = data[off + step];

  const leftR = evenR + oddR;
  const rightR = evenR - oddR;

  out[outOff] = leftR;
  out[outOff + 1] = 0;
  out[outOff + 2] = rightR;
  out[outOff + 3] = 0;
};

// radix-4
//
// NOTE: Only called for len=8
FFT.prototype._singleRealTransform4 = function _singleRealTransform4(outOff,
                                                                     off,
                                                                     step) {
  const out = this._out;
  const data = this._data;
  const inv = this._inv ? -1 : 1;
  const step2 = step * 2;
  const step3 = step * 3;

  // Original values
  const Ar = data[off];
  const Br = data[off + step];
  const Cr = data[off + step2];
  const Dr = data[off + step3];

  // Pre-Final values
  const T0r = Ar + Cr;
  const T1r = Ar - Cr;
  const T2r = Br + Dr;
  const T3r = inv * (Br - Dr);

  // Final values
  const FAr = T0r + T2r;

  const FBr = T1r;
  const FBi = -T3r;

  const FCr = T0r - T2r;

  const FDr = T1r;
  const FDi = T3r;

  out[outOff] = FAr;
  out[outOff + 1] = 0;
  out[outOff + 2] = FBr;
  out[outOff + 3] = FBi;
  out[outOff + 4] = FCr;
  out[outOff + 5] = 0;
  out[outOff + 6] = FDr;
  out[outOff + 7] = FDi;
};

// ---- Export ----------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FFT;
}
root.FFT = FFT;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

/* ============================================================================
 * 模块: image-ops.js
 * 源路径: src/perfectPixel/js/image-ops.js
 * 行数: 197
 * 说明: 图像基础操作 — 提供 PerfectPixelImageOps（卷积/边缘等）
 * ============================================================================ */
// ============================================================================
// image-ops.js — PerfectPixel 图像基础工具（纯函数）
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py 第 1~71 行
// 约束:
//   - 无外部依赖
//   - IIFE + window 命名空间
//   - 严格按 Python 版翻译（数值一致）
//   - 性能敏感处使用原生 for 循环与 TypedArray
// ============================================================================
(function (root) {
  'use strict';

  // --- helpers --------------------------------------------------------------

  /**
   * np.pad(img, ((ph,ph),(pw,pw)), mode='reflect') 等价实现
   * numpy 的 reflect 不复制边界像素（镜面反射，中心对称）。
   * e.g. [a,b,c,d] pad 2 reflect -> [c,b, a,b,c,d, c,b]
   */
  function padReflect(img, H, W, ph, pw) {
    var padH = H + 2 * ph;
    var padW = W + 2 * pw;
    var out = new Float32Array(padH * padW);

    // 先填中心
    for (var y = 0; y < H; y++) {
      var srcRow = y * W;
      var dstRow = (y + ph) * padW + pw;
      for (var x = 0; x < W; x++) {
        out[dstRow + x] = img[srcRow + x];
      }
    }

    // 行方向（左右边）— 对每一行 reflect
    for (var yy = 0; yy < H; yy++) {
      var rowBase = (yy + ph) * padW;
      // 左侧
      for (var lx = 0; lx < pw; lx++) {
        // reflect index: pw - lx
        out[rowBase + lx] = img[yy * W + (pw - lx)];
      }
      // 右侧
      for (var rx = 0; rx < pw; rx++) {
        // 最后一列 index = W-1，反射: W-2-rx
        out[rowBase + pw + W + rx] = img[yy * W + (W - 2 - rx)];
      }
    }

    // 列方向（上下边）— 在已填好的 padded 行中镜像
    for (var ty = 0; ty < ph; ty++) {
      var srcY = ph + (ph - ty); // 从下往镜像
      for (var cx = 0; cx < padW; cx++) {
        out[ty * padW + cx] = out[srcY * padW + cx];
      }
    }
    for (var by = 0; by < ph; by++) {
      var srcYB = (ph + H - 2 - by);
      var dstYB = ph + H + by;
      for (var cxb = 0; cxb < padW; cxb++) {
        out[dstYB * padW + cxb] = out[srcYB * padW + cxb];
      }
    }

    return out;
  }

  // --- public API -----------------------------------------------------------

  var PerfectPixelImageOps = {

    /**
     * RGB -> gray float32
     * 对应 perfect_pixel_noCV2.py:7-13
     * @param {Uint8ClampedArray|Uint8Array|Float32Array} rgb  H*W*3
     * @returns {Float32Array} H*W
     */
    rgbToGray: function (rgb, H, W) {
      var N = H * W;
      var out = new Float32Array(N);
      for (var i = 0, p = 0; i < N; i++, p += 3) {
        out[i] = 0.299 * rgb[p] + 0.587 * rgb[p + 1] + 0.114 * rgb[p + 2];
      }
      return out;
    },

    /**
     * RGBA (ImageData.data) -> gray float32
     */
    rgbaToGray: function (rgba, H, W) {
      var N = H * W;
      var out = new Float32Array(N);
      for (var i = 0, p = 0; i < N; i++, p += 4) {
        out[i] = 0.299 * rgba[p] + 0.587 * rgba[p + 1] + 0.114 * rgba[p + 2];
      }
      return out;
    },

    /**
     * min-max 归一化到 [a, b]
     * 对应 perfect_pixel_noCV2.py:16-23
     */
    normalizeMinMax: function (arr, a, b) {
      if (a === undefined) a = 0.0;
      if (b === undefined) b = 1.0;
      var N = arr.length;
      var mn = Infinity, mx = -Infinity;
      for (var i = 0; i < N; i++) {
        var v = arr[i];
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      var out = new Float32Array(N);
      if (mx - mn < 1e-8) {
        for (var j = 0; j < N; j++) out[j] = a;
        return out;
      }
      var scale = (b - a) / (mx - mn);
      for (var k = 0; k < N; k++) {
        out[k] = a + (arr[k] - mn) * scale;
      }
      return out;
    },

    /**
     * 2D 卷积 'same' + reflect padding
     * 对应 perfect_pixel_noCV2.py:26-42
     * kernel 布局: 长度 kH*kW，行主序。
     */
    conv2dSame: function (img, H, W, kernel, kH, kW) {
      var ph = kH >> 1;
      var pw = kW >> 1;
      var padded = padReflect(img, H, W, ph, pw);
      var padW = W + 2 * pw;
      var out = new Float32Array(H * W);

      // 按 Python 版的"累加 shifted windows"等价实现
      // 这里直接写成邻域相关累加（同样结果，更直观）
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var sum = 0.0;
          for (var dy = 0; dy < kH; dy++) {
            var padRow = (y + dy) * padW + x;
            var kRow = dy * kW;
            for (var dx = 0; dx < kW; dx++) {
              sum += kernel[kRow + dx] * padded[padRow + dx];
            }
          }
          out[y * W + x] = sum;
        }
      }
      return out;
    },

    /**
     * Sobel 梯度 (ksize=3)
     * 对应 perfect_pixel_noCV2.py:45-67
     * 注意: Python 版是"卷积"而非相关；但 Sobel 核的对称性使二者结果一致（符号对 kx/ky 影响一致）。
     * 这里用 conv2dSame 作相关（与 Python 的 "sum += w * pad[shift]" 写法等价）。
     * @returns {{gx: Float32Array, gy: Float32Array}}
     */
    sobelXY: function (gray, H, W) {
      // kx / ky (ksize=3)
      var kx = new Float32Array([
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
      ]);
      var ky = new Float32Array([
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
      ]);
      var gx = this.conv2dSame(gray, H, W, kx, 3, 3);
      var gy = this.conv2dSame(gray, H, W, ky, 3, 3);
      return { gx: gx, gy: gy };
    },

    /**
     * 梯度幅度 sqrt(gx^2 + gy^2)
     * 对应 perfect_pixel_noCV2.py:70-71
     */
    magnitude: function (gx, gy) {
      var N = gx.length;
      var out = new Float32Array(N);
      for (var i = 0; i < N; i++) {
        var a = gx[i], b = gy[i];
        out[i] = Math.sqrt(a * a + b * b);
      }
      return out;
    }
  };

  root.PerfectPixelImageOps = PerfectPixelImageOps;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixelImageOps;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: fft-utils.js
 * 源路径: src/perfectPixel/js/fft-utils.js
 * 行数: 171
 * 说明: FFT 工具 — 频谱计算辅助函数
 * ============================================================================ */
// ============================================================================
// fft-utils.js — PerfectPixel FFT 相关工具
// 依赖: vendor/fft.js (indutny/fft.js)，通过 window.FFT 访问
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py 第 78~83 行
//
// 约束:
//   - 2D FFT = 行 1D FFT -> 列 1D FFT
//   - 输入任意 H×W，内部 zero-pad 到 2^n 方形
//   - computeFftMagnitude 需 crop 回 H×W 再归一化（与 Python 版一致）
// ============================================================================
(function (root) {
  'use strict';

  function nextPow2(n) {
    var p = 1;
    while (p < n) p <<= 1;
    return p;
  }

  /**
   * 对长度为 N 的复数数组（交错 [re,im,re,im,...]）做 1D FFT。
   * fftInst.size 必须 === N，N 为 2 的幂。
   */
  function fft1d(fftInst, cxIn) {
    var out = fftInst.createComplexArray();
    fftInst.transform(out, cxIn);
    return out;
  }

  /**
   * 执行 2D FFT：输入 padN×padN 的实数矩阵（Float32Array，长度 padN*padN）
   * 返回 {re, im}: 两个 Float32Array，长度 padN*padN
   *
   * 做法:
   *   1) 对每一行执行 1D FFT
   *   2) 转置 + 对每一列执行 1D FFT
   */
  function fft2dSquare(realMat, N) {
    var FFT = root.FFT;
    if (!FFT) throw new Error('FFT (vendor/fft.js) not loaded');
    var fft = new FFT(N);

    // 存储中间结果 (复数，交错格式) 每行独立做
    // rowRe/rowIm 打平存储: length N*N
    var re = new Float32Array(N * N);
    var im = new Float32Array(N * N);

    // 1) 行方向 FFT
    var rowCx = new Array(N * 2); // 行输入 (复数交错)
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        rowCx[2 * x] = realMat[y * N + x];
        rowCx[2 * x + 1] = 0;
      }
      var rowOut = fft.createComplexArray();
      fft.transform(rowOut, rowCx);
      for (var x2 = 0; x2 < N; x2++) {
        re[y * N + x2] = rowOut[2 * x2];
        im[y * N + x2] = rowOut[2 * x2 + 1];
      }
    }

    // 2) 列方向 FFT
    var colCx = new Array(N * 2);
    for (var cx = 0; cx < N; cx++) {
      for (var cy = 0; cy < N; cy++) {
        colCx[2 * cy] = re[cy * N + cx];
        colCx[2 * cy + 1] = im[cy * N + cx];
      }
      var colOut = fft.createComplexArray();
      fft.transform(colOut, colCx);
      for (var cy2 = 0; cy2 < N; cy2++) {
        re[cy2 * N + cx] = colOut[2 * cy2];
        im[cy2 * N + cx] = colOut[2 * cy2 + 1];
      }
    }

    return { re: re, im: im };
  }

  var PerfectPixelFFT = {

    /**
     * 2D FFT: 输入任意尺寸灰度图，内部 zero-pad 到 padN×padN (padN=2^n)
     * @returns {{re, im, padH, padW}} 注意 padH=padW=padN
     */
    fft2d: function (gray, H, W) {
      var N = nextPow2(Math.max(H, W));
      // 零填充到 N×N
      var padded = new Float32Array(N * N);
      for (var y = 0; y < H; y++) {
        var srcRow = y * W;
        var dstRow = y * N;
        for (var x = 0; x < W; x++) {
          padded[dstRow + x] = gray[srcRow + x];
        }
      }
      var res = fft2dSquare(padded, N);
      return { re: res.re, im: res.im, padH: N, padW: N };
    },

    /**
     * 2D fftshift: 四象限交换（中心平移）
     * 按 numpy.fft.fftshift 约定处理（偶/奇尺寸均可，奇数时取 ceil(H/2)）
     */
    fftShift2d: function (re, im, H, W) {
      var outRe = new Float32Array(H * W);
      var outIm = new Float32Array(H * W);
      var hh = (H + 1) >> 1; // 上半行数
      var hw = (W + 1) >> 1;
      for (var y = 0; y < H; y++) {
        var ny = (y + hh) % H;
        for (var x = 0; x < W; x++) {
          var nx = (x + hw) % W;
          outRe[ny * W + nx] = re[y * W + x];
          outIm[ny * W + nx] = im[y * W + x];
        }
      }
      return { re: outRe, im: outIm };
    },

    /**
     * 计算 FFT 幅度谱 & 归一化
     * 对应 perfect_pixel_noCV2.py:78-83 (compute_fft_magnitude):
     *   f = fft2(gray); fshift = fftshift(f); mag = |fshift|
     *   mag = 1 - log1p(mag); return normalize_minmax(mag, 0, 1)
     *
     * 注意: Python 版 fft2 直接作用于原始 H×W（np.fft.fft2 不要求 2 的幂）。
     * 我们这里 pad 到 2^n 方形，计算完幅度后 crop 回 H×W 再归一化，保证输出尺寸一致。
     *
     * @returns {Float32Array} 长度 H*W，范围 [0, 1]
     */
    computeFftMagnitude: function (gray, H, W) {
      var F = this.fft2d(gray, H, W); // padN×padN
      var N = F.padH;
      var shifted = this.fftShift2d(F.re, F.im, N, N);

      // 计算 |F| 然后做 1 - log1p(|F|)
      // 取中心 H×W 窗口（fftshift 后低频在中心 N/2, N/2 附近）
      var cy = N >> 1;
      var cx = N >> 1;
      var y0 = cy - (H >> 1);
      var x0 = cx - (W >> 1);
      // 边界保护
      if (y0 < 0) y0 = 0;
      if (x0 < 0) x0 = 0;
      if (y0 + H > N) y0 = N - H;
      if (x0 + W > N) x0 = N - W;

      var out = new Float32Array(H * W);
      for (var y = 0; y < H; y++) {
        var srcRow = (y0 + y) * N;
        var dstRow = y * W;
        for (var x = 0; x < W; x++) {
          var r = shifted.re[srcRow + x0 + x];
          var i = shifted.im[srcRow + x0 + x];
          var mag = Math.sqrt(r * r + i * i);
          out[dstRow + x] = 1 - Math.log1p(mag);
        }
      }

      // normalize_minmax(mag, 0, 1)
      return root.PerfectPixelImageOps.normalizeMinMax(out, 0.0, 1.0);
    }
  };

  root.PerfectPixelFFT = PerfectPixelFFT;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixelFFT;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: peak-detector.js
 * 源路径: src/perfectPixel/js/peak-detector.js
 * 行数: 189
 * 说明: 峰值检测 — 识别频谱中的网格周期峰
 * ============================================================================ */
// ============================================================================
// peak-detector.js — 峰值检测 & 1D 高斯平滑 & 梯度最强点查找
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py
//   - smooth_1d      行 86~96
//   - detect_peak    行 99~153
//   - find_best_grid 行 156~175
// 约束：
//   - 逐行对照 Python 翻译，不"优化"
//   - IIFE + window 命名空间
// ============================================================================
(function (root) {
  'use strict';

  /**
   * 1D full convolution (numpy np.convolve default 'full')，再裁剪到 'same'
   * 等价 np.convolve(v, ker, mode='same')
   */
  function convolveSame(v, ker) {
    var n = v.length;
    var k = ker.length;
    var full = n + k - 1;
    var out = new Float32Array(full);
    for (var i = 0; i < n; i++) {
      var vi = v[i];
      if (vi === 0) continue;
      for (var j = 0; j < k; j++) {
        out[i + j] += vi * ker[j];
      }
    }
    // 'same' 裁剪: 输出长度 = max(n, k)；对 Python 侧 v 总是比核长的场景，取长度 n
    // numpy 'same' 的起点: (full - n) // 2
    var start = Math.floor((full - n) / 2);
    var res = new Float32Array(n);
    for (var ii = 0; ii < n; ii++) {
      res[ii] = out[start + ii];
    }
    return res;
  }

  var PerfectPixelPeakDetector = {

    /**
     * 高斯平滑 1D 信号
     * 对应 perfect_pixel_noCV2.py:86-96
     */
    smooth1d: function (v, k) {
      if (k === undefined) k = 17;
      k = k | 0;
      if (k < 3) return v;
      if ((k % 2) === 0) k += 1;
      var sigma = k / 6.0;
      var ker = new Float32Array(k);
      var half = k >> 1; // k//2
      var sum = 0;
      for (var i = 0; i < k; i++) {
        var x = i - half;
        var w = Math.exp(-(x * x) / (2 * sigma * sigma));
        ker[i] = w;
        sum += w;
      }
      var inv = 1 / (sum + 1e-8);
      for (var j = 0; j < k; j++) ker[j] *= inv;
      return convolveSame(v, ker);
    },

    /**
     * 峰值检测（返回半周期 = 格子大小的一半）
     * 对应 perfect_pixel_noCV2.py:99-153
     */
    detectPeak: function (proj, opts) {
      if (!opts) opts = {};
      var peakWidth = opts.peak_width !== undefined ? opts.peak_width
                    : (opts.peakWidth !== undefined ? opts.peakWidth : 6);
      var relThr = opts.rel_thr !== undefined ? opts.rel_thr
                 : (opts.relThr !== undefined ? opts.relThr : 0.35);
      var minDist = opts.min_dist !== undefined ? opts.min_dist
                  : (opts.minDist !== undefined ? opts.minDist : 6);

      var N = proj.length;
      var center = Math.floor(N / 2);

      var mx = -Infinity;
      for (var i0 = 0; i0 < N; i0++) {
        if (proj[i0] > mx) mx = proj[i0];
      }
      if (mx < 1e-6) return null;

      var thr = mx * relThr;

      var candidates = [];
      for (var i = 1; i < N - 1; i++) {
        var isPeak = true;
        // Python: for j in range(1, peak_width): ...
        for (var j = 1; j < peakWidth; j++) {
          if (i - j < 0 || i + j >= N) continue;
          if (proj[i - j + 1] < proj[i - j] || proj[i + j - 1] < proj[i + j]) {
            isPeak = false;
            break;
          }
        }
        if (isPeak && proj[i] >= thr) {
          var leftClimb = 0;
          // Python: for k in range(i, 0, -1): ...
          for (var kL = i; kL > 0; kL--) {
            if (proj[kL] > proj[kL - 1]) {
              leftClimb = Math.abs(proj[i] - proj[kL - 1]);
            } else {
              break;
            }
          }
          var rightFall = 0;
          // Python: for k in range(i, len(proj) - 1): ...
          for (var kR = i; kR < N - 1; kR++) {
            if (proj[kR] > proj[kR + 1]) {
              rightFall = Math.abs(proj[i] - proj[kR + 1]);
            } else {
              break;
            }
          }
          candidates.push({
            index: i,
            climb: leftClimb,
            fall: rightFall,
            score: Math.max(leftClimb, rightFall)
          });
        }
      }

      if (candidates.length === 0) return null;

      var left = [];
      var right = [];
      for (var ci = 0; ci < candidates.length; ci++) {
        var c = candidates[ci];
        if (c.index < center - minDist && c.index > center * 0.25) left.push(c);
        if (c.index > center + minDist && c.index < center * 1.75) right.push(c);
      }

      left.sort(function (a, b) { return b.score - a.score; });
      right.sort(function (a, b) { return b.score - a.score; });

      if (left.length === 0 || right.length === 0) return null;

      var peakLeft = left[0].index;
      var peakRight = right[0].index;

      return Math.abs(peakRight - peakLeft) / 2;
    },

    /**
     * 在指定原点附近找梯度最强点（用于 refineGrids）
     * 对应 perfect_pixel_noCV2.py:156-175
     *
     * 注意: Python 用 round()，JS 按 Python 语义使用 Math.round 以保持一致。
     *       （Python round 是 banker's rounding，但对典型非 .5 值与 Math.round 等价；
     *        样本采样的"格内中心取整"另走 Math.floor。）
     */
    findBestGrid: function (origin, rangeMin, rangeMax, gradMag, thr) {
      if (thr === undefined) thr = 0;
      var best = Math.round(origin);
      var mx = -Infinity;
      for (var i0 = 0; i0 < gradMag.length; i0++) {
        if (gradMag[i0] > mx) mx = gradMag[i0];
      }
      if (mx < 1e-6) return best;
      var relThr = mx * thr;
      var peaks = [];
      var lo = -Math.round(rangeMin);
      var hi = Math.round(rangeMax);
      for (var i = lo; i <= hi; i++) {
        var candidate = Math.round(origin + i);
        if (candidate <= 0 || candidate >= gradMag.length - 1) continue;
        if (gradMag[candidate] > gradMag[candidate - 1]
            && gradMag[candidate] > gradMag[candidate + 1]
            && gradMag[candidate] >= relThr) {
          peaks.push([gradMag[candidate], candidate]);
        }
      }
      if (peaks.length === 0) return best;
      peaks.sort(function (a, b) { return b[0] - a[0]; });
      return peaks[0][1];
    }
  };

  root.PerfectPixelPeakDetector = PerfectPixelPeakDetector;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixelPeakDetector;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: grid-estimator.js
 * 源路径: src/perfectPixel/js/grid-estimator.js
 * 行数: 245
 * 说明: 网格尺寸估计 — 自动检测图中像素网格的 cols/rows
 * ============================================================================ */
// ============================================================================
// grid-estimator.js — 格子大小 / 格数估算
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py
//   - estimate_grid_fft       行 308~331
//   - estimate_grid_gradient  行 333~374
//   - detect_grid_scale       行 376~409
// 约束：
//   - 逐行对照 Python 翻译
//   - estimate_grid_fft 返回 "格子大小 (cell size)"
//   - detect_grid_scale 返回 [rows, cols]（即 [H/pixel, W/pixel]，向下取整经 round）
// ============================================================================
(function (root) {
  'use strict';

  function sumAbsCols(mat, H, W) {
    // sum_{y}( |mat[y*W + x]| ) -> length W
    var out = new Float32Array(W);
    for (var y = 0; y < H; y++) {
      var row = y * W;
      for (var x = 0; x < W; x++) {
        var v = mat[row + x];
        out[x] += v < 0 ? -v : v;
      }
    }
    return out;
  }

  function sumAbsRows(mat, H, W) {
    // sum_{x}( |mat[y*W + x]| ) -> length H
    var out = new Float32Array(H);
    for (var y = 0; y < H; y++) {
      var row = y * W;
      var s = 0;
      for (var x = 0; x < W; x++) {
        var v = mat[row + x];
        s += v < 0 ? -v : v;
      }
      out[y] = s;
    }
    return out;
  }

  function arrayMax(arr) {
    var mx = -Infinity;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] > mx) mx = arr[i];
    }
    return mx;
  }

  function median(arr) {
    var a = Array.prototype.slice.call(arr).sort(function (p, q) { return p - q; });
    var n = a.length;
    if (n === 0) return 0;
    if ((n & 1) === 1) return a[(n - 1) >> 1];
    return (a[n / 2 - 1] + a[n / 2]) / 2;
  }

  var PerfectPixelGridEstimator = {

    /**
     * FFT 法估算格子大小 (cell size)
     * 对应 perfect_pixel_noCV2.py:308-331
     * @returns {[number, number]|null}  [gridW, gridH] (cell size in px)
     */
    estimateGridFft: function (gray, H, W, peakWidth) {
      if (peakWidth === undefined) peakWidth = 6;

      var FFT = root.PerfectPixelFFT;
      var OPS = root.PerfectPixelImageOps;
      var PD = root.PerfectPixelPeakDetector;

      var mag = FFT.computeFftMagnitude(gray, H, W); // H×W Float32Array

      // Python:
      //   band_row = W // 2
      //   band_col = H // 2
      //   row_sum = np.sum(mag[:, W//2 - band_row: W//2 + band_row], axis=1)  -> length H
      //   col_sum = np.sum(mag[H//2 - band_col: H//2 + band_col, :], axis=0)  -> length W
      var bandRow = Math.floor(W / 2);
      var bandCol = Math.floor(H / 2);
      var cX = Math.floor(W / 2);
      var cY = Math.floor(H / 2);

      var xStart = cX - bandRow; if (xStart < 0) xStart = 0;
      var xEnd = cX + bandRow;   if (xEnd > W) xEnd = W;
      var yStart = cY - bandCol; if (yStart < 0) yStart = 0;
      var yEnd = cY + bandCol;   if (yEnd > H) yEnd = H;

      // row_sum: length H — 每行在列带 [xStart, xEnd) 上求和
      var rowSum = new Float32Array(H);
      for (var y = 0; y < H; y++) {
        var base = y * W;
        var s = 0;
        for (var x = xStart; x < xEnd; x++) {
          s += mag[base + x];
        }
        rowSum[y] = s;
      }
      // col_sum: length W — 每列在行带 [yStart, yEnd) 上求和
      var colSum = new Float32Array(W);
      for (var yy = yStart; yy < yEnd; yy++) {
        var rbase = yy * W;
        for (var xx = 0; xx < W; xx++) {
          colSum[xx] += mag[rbase + xx];
        }
      }

      rowSum = OPS.normalizeMinMax(rowSum, 0.0, 1.0);
      colSum = OPS.normalizeMinMax(colSum, 0.0, 1.0);

      rowSum = PD.smooth1d(rowSum, 17);
      colSum = PD.smooth1d(colSum, 17);

      var scaleRow = PD.detectPeak(rowSum, { peak_width: peakWidth });
      var scaleCol = PD.detectPeak(colSum, { peak_width: peakWidth });

      if (scaleRow === null || scaleCol === null || scaleCol <= 0) return null;

      // Python: return scale_col, scale_row  -> (grid_w, grid_h)
      return [scaleCol, scaleRow];
    },

    /**
     * 梯度法估算格子大小 (cell size)
     * 对应 perfect_pixel_noCV2.py:333-374
     * 注意: Python 末尾 return int(round(scale_x)), int(round(scale_y))
     * @returns {[number, number]|null}  [gridW, gridH] (cell size in px) 或 null
     */
    estimateGridGradient: function (gray, H, W, relThr) {
      if (relThr === undefined) relThr = 0.2; // Python 默认 0.2

      var OPS = root.PerfectPixelImageOps;

      var g = OPS.sobelXY(gray, H, W);
      var gradXSum = sumAbsCols(g.gx, H, W); // length W
      var gradYSum = sumAbsRows(g.gy, H, W); // length H

      var thrX = relThr * arrayMax(gradXSum);
      var thrY = relThr * arrayMax(gradYSum);

      var peakX = [];
      var peakY = [];
      var minInterval = 4;

      for (var i = 1; i < gradXSum.length - 1; i++) {
        if (gradXSum[i] > gradXSum[i - 1] && gradXSum[i] > gradXSum[i + 1] && gradXSum[i] >= thrX) {
          if (peakX.length === 0 || i - peakX[peakX.length - 1] >= minInterval) {
            peakX.push(i);
          }
        }
      }
      for (var j = 1; j < gradYSum.length - 1; j++) {
        if (gradYSum[j] > gradYSum[j - 1] && gradYSum[j] > gradYSum[j + 1] && gradYSum[j] >= thrY) {
          if (peakY.length === 0 || j - peakY[peakY.length - 1] >= minInterval) {
            peakY.push(j);
          }
        }
      }

      if (peakX.length < 4 || peakY.length < 4) return null;

      var intervalsX = [];
      for (var a = 1; a < peakX.length; a++) intervalsX.push(peakX[a] - peakX[a - 1]);
      var intervalsY = [];
      for (var b = 1; b < peakY.length; b++) intervalsY.push(peakY[b] - peakY[b - 1]);

      var medX = median(intervalsX);
      var medY = median(intervalsY);
      if (medX <= 0 || medY <= 0) return null;

      var scaleX = W / medX;
      var scaleY = H / medY;

      // Python: return int(round(scale_x)), int(round(scale_y))
      // 这里先保留 round 值（浮点），调用方会再次 round
      return [Math.round(scaleX), Math.round(scaleY)];
    },

    /**
     * 总入口: 检测 [rows, cols]（格数，不是格子大小！）
     * 对应 perfect_pixel_noCV2.py:376-409
     * @returns {[number, number]|null}  [rows, cols] 或 null
     *
     * 说明: Python 返回 (grid_w, grid_h)；这里按任务约定返回 [rows, cols]，
     *       其中 rows = round(H/pixel_size), cols = round(W/pixel_size)
     *       （Python grid_w = cols, grid_h = rows）
     */
    detectGridScale: function (rgb, H, W, opts) {
      if (!opts) opts = {};
      var peakWidth = opts.peakWidth !== undefined ? opts.peakWidth : 6;
      var maxRatio = opts.maxRatio !== undefined ? opts.maxRatio : 1.5;
      var minSize = opts.minSize !== undefined ? opts.minSize : 4.0;
      var maxPixelSize = 20.0;

      var OPS = root.PerfectPixelImageOps;
      var gray = OPS.rgbToGray(rgb, H, W);

      var res = this.estimateGridFft(gray, H, W, peakWidth);
      var gridW = null, gridH = null;
      if (res) { gridW = res[0]; gridH = res[1]; }

      if (gridW === null || gridH === null) {
        var g1 = this.estimateGridGradient(gray, H, W, 0.2);
        if (g1) { gridW = g1[0]; gridH = g1[1]; }
      } else {
        var pxX = W / gridW;
        var pxY = H / gridH;
        if (Math.min(pxX, pxY) < minSize
            || Math.max(pxX, pxY) > maxPixelSize
            || pxX / pxY > maxRatio
            || pxY / pxX > maxRatio) {
          var g2 = this.estimateGridGradient(gray, H, W, 0.2);
          if (g2) { gridW = g2[0]; gridH = g2[1]; }
          else { gridW = null; gridH = null; }
        }
      }

      if (gridW === null || gridH === null) return null;

      var pixelSizeX = W / gridW;
      var pixelSizeY = H / gridH;
      var pixelSize;
      if (pixelSizeX / pixelSizeY > maxRatio || pixelSizeY / pixelSizeX > maxRatio) {
        pixelSize = Math.min(pixelSizeX, pixelSizeY);
      } else {
        pixelSize = (pixelSizeX + pixelSizeY) / 2.0;
      }

      if (!(pixelSize > 0)) return null;

      // Python: grid_w = int(round(W / pixel_size)); grid_h = int(round(H / pixel_size))
      var cols = Math.round(W / pixelSize);
      var rows = Math.round(H / pixelSize);

      // 任务约定: 返回 [rows, cols]
      return [rows, cols];
    }
  };

  root.PerfectPixelGridEstimator = PerfectPixelGridEstimator;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixelGridEstimator;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: grid-refiner.js
 * 源路径: src/perfectPixel/js/grid-refiner.js
 * 行数: 111
 * 说明: 网格细化 — 调整网格线位置使其对齐真实色块边界
 * ============================================================================ */
// ============================================================================
// grid-refiner.js — 梯度引导的网格线精细化
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py:268-306 (refine_grids)
// 约束：
//   - 逐行对照 Python 翻译
//   - 输入格数 (grid_x = cols, grid_y = rows)，输出 xCoords/yCoords（含首尾边界点）
// ============================================================================
(function (root) {
  'use strict';

  function sumAbsCols(mat, H, W) {
    var out = new Float32Array(W);
    for (var y = 0; y < H; y++) {
      var row = y * W;
      for (var x = 0; x < W; x++) {
        var v = mat[row + x];
        out[x] += v < 0 ? -v : v;
      }
    }
    return out;
  }

  function sumAbsRows(mat, H, W) {
    var out = new Float32Array(H);
    for (var y = 0; y < H; y++) {
      var row = y * W;
      var s = 0;
      for (var x = 0; x < W; x++) {
        var v = mat[row + x];
        s += v < 0 ? -v : v;
      }
      out[y] = s;
    }
    return out;
  }

  var PerfectPixelGridRefiner = {

    /**
     * 梯度引导的网格线精细化
     * @param {Uint8Array|Uint8ClampedArray} rgb  H*W*3
     * @param {number} H
     * @param {number} W
     * @param {number} gridX  列数 (cols)
     * @param {number} gridY  行数 (rows)
     * @param {number} refineIntensity
     * @returns {{xCoords: Float32Array, yCoords: Float32Array}}
     *   xCoords.length = gridX + 1, yCoords.length = gridY + 1
     */
    refineGrids: function (rgb, H, W, gridX, gridY, refineIntensity) {
      if (refineIntensity === undefined) refineIntensity = 0.25;

      var OPS = root.PerfectPixelImageOps;
      var PD = root.PerfectPixelPeakDetector;

      var cellW = W / gridX;
      var cellH = H / gridY;

      var gray = OPS.rgbToGray(rgb, H, W);
      var g = OPS.sobelXY(gray, H, W);
      var gradXSum = sumAbsCols(g.gx, H, W); // length W
      var gradYSum = sumAbsRows(g.gy, H, W); // length H

      var xList = [];
      var yList = [];

      // --- X 方向 ---
      // 正方向
      var x = PD.findBestGrid(W / 2, cellW, cellW, gradXSum, 0);
      while (x < W + cellW / 2) {
        x = PD.findBestGrid(x, cellW * refineIntensity, cellW * refineIntensity, gradXSum, 0);
        xList.push(x);
        x += cellW;
      }
      // 负方向
      x = PD.findBestGrid(W / 2, cellW, cellW, gradXSum, 0) - cellW;
      while (x > -cellW / 2) {
        x = PD.findBestGrid(x, cellW * refineIntensity, cellW * refineIntensity, gradXSum, 0);
        xList.push(x);
        x -= cellW;
      }

      // --- Y 方向 ---
      var y = PD.findBestGrid(H / 2, cellH, cellH, gradYSum, 0);
      while (y < H + cellH / 2) {
        y = PD.findBestGrid(y, cellH * refineIntensity, cellH * refineIntensity, gradYSum, 0);
        yList.push(y);
        y += cellH;
      }
      y = PD.findBestGrid(H / 2, cellH, cellH, gradYSum, 0) - cellH;
      while (y > -cellH / 2) {
        y = PD.findBestGrid(y, cellH * refineIntensity, cellH * refineIntensity, gradYSum, 0);
        yList.push(y);
        y -= cellH;
      }

      xList.sort(function (a, b) { return a - b; });
      yList.sort(function (a, b) { return a - b; });

      return {
        xCoords: Float32Array.from(xList),
        yCoords: Float32Array.from(yList)
      };
    }
  };

  root.PerfectPixelGridRefiner = PerfectPixelGridRefiner;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixelGridRefiner;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: samplers.js
 * 源路径: src/perfectPixel/js/samplers.js
 * 行数: 245
 * 说明: 像素采样 — 从网格中提取每格代表色（mean/median 等）
 * ============================================================================ */
// ============================================================================
// samplers.js — 按 xCoords/yCoords 在原图中采样每个格子颜色
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py
//   - sample_center    行 178~183
//   - sample_majority  行 186~233
//   - sample_median    行 235~266
//
// **硬约束 (反复确认)**:
//   Python int(x) 对正数 = 向下截断 = Math.floor
//   这里所有坐标取整统一用 Math.floor，禁止 Math.round。
//
// 返回格式: { data: Uint8Array(rows*cols*3), rows, cols }
// ============================================================================
(function (root) {
  'use strict';

  // --- helpers --------------------------------------------------------------

  function clampInt(v, lo, hi) {
    v = v | 0;
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
  }

  // 计算 centers：Python 是 ((x[1:] + x[:-1]) * 0.5).astype(int32)
  // astype(int32) 对正数做**截断** (== floor)
  function cellCenters(coords) {
    var n = coords.length - 1;
    var out = new Int32Array(n);
    for (var i = 0; i < n; i++) {
      // Math.floor 而非 Math.round：对齐 Python astype(int32) 的截断语义
      out[i] = Math.floor((coords[i] + coords[i + 1]) * 0.5);
    }
    return out;
  }

  // 每个 axis 的格子 [a, b)，Python: int(x[i]), int(x[i+1])，int(float) = 截断 = floor
  function cellBounds(coords, limit) {
    var n = coords.length - 1;
    var lo = new Int32Array(n);
    var hi = new Int32Array(n);
    for (var i = 0; i < n; i++) {
      var a = Math.floor(coords[i]);     // int() 截断
      var b = Math.floor(coords[i + 1]);
      a = clampInt(a, 0, limit);
      b = clampInt(b, 0, limit);
      if (b <= a) b = Math.min(a + 1, limit);
      lo[i] = a; hi[i] = b;
    }
    return { lo: lo, hi: hi };
  }

  // --- public API -----------------------------------------------------------

  var PerfectPixelSamplers = {

    /**
     * 中心像素采样
     * 对应 perfect_pixel_noCV2.py:178-183
     */
    sampleCenter: function (rgb, H, W, xCoords, yCoords) {
      var cx = cellCenters(xCoords); // length cols
      var cy = cellCenters(yCoords); // length rows
      var cols = cx.length;
      var rows = cy.length;
      var out = new Uint8Array(rows * cols * 3);
      for (var j = 0; j < rows; j++) {
        var y = clampInt(cy[j], 0, H - 1);
        var rowBase = j * cols * 3;
        var srcRowBase = y * W * 3;
        for (var i = 0; i < cols; i++) {
          var x = clampInt(cx[i], 0, W - 1);
          var src = srcRowBase + x * 3;
          var dst = rowBase + i * 3;
          out[dst]     = rgb[src];
          out[dst + 1] = rgb[src + 1];
          out[dst + 2] = rgb[src + 2];
        }
      }
      return { data: out, rows: rows, cols: cols };
    },

    /**
     * 中位数采样
     * 对应 perfect_pixel_noCV2.py:235-266
     */
    sampleMedian: function (rgb, H, W, xCoords, yCoords) {
      var xb = cellBounds(xCoords, W);
      var yb = cellBounds(yCoords, H);
      var cols = xb.lo.length;
      var rows = yb.lo.length;
      var out = new Uint8Array(rows * cols * 3);

      for (var j = 0; j < rows; j++) {
        var y0 = yb.lo[j], y1 = yb.hi[j];
        for (var i = 0; i < cols; i++) {
          var x0 = xb.lo[i], x1 = xb.hi[i];
          var n = (y1 - y0) * (x1 - x0);
          if (n <= 0) {
            var dst0 = (j * cols + i) * 3;
            out[dst0] = 0; out[dst0 + 1] = 0; out[dst0 + 2] = 0;
            continue;
          }
          var rs = new Float32Array(n);
          var gs = new Float32Array(n);
          var bs = new Float32Array(n);
          var idx = 0;
          for (var yy = y0; yy < y1; yy++) {
            var base = yy * W * 3;
            for (var xx = x0; xx < x1; xx++) {
              var p = base + xx * 3;
              rs[idx] = rgb[p];
              gs[idx] = rgb[p + 1];
              bs[idx] = rgb[p + 2];
              idx++;
            }
          }
          // 简单排序取中位
          var aR = Array.prototype.slice.call(rs).sort(function (p, q) { return p - q; });
          var aG = Array.prototype.slice.call(gs).sort(function (p, q) { return p - q; });
          var aB = Array.prototype.slice.call(bs).sort(function (p, q) { return p - q; });
          var mid = n >> 1;
          var mR, mG, mB;
          if ((n & 1) === 1) {
            mR = aR[mid]; mG = aG[mid]; mB = aB[mid];
          } else {
            mR = (aR[mid - 1] + aR[mid]) / 2;
            mG = (aG[mid - 1] + aG[mid]) / 2;
            mB = (aB[mid - 1] + aB[mid]) / 2;
          }
          // Python: np.clip(np.rint(out), 0, 255).astype(uint8)
          var dst = (j * cols + i) * 3;
          out[dst]     = clampInt(Math.round(mR), 0, 255);
          out[dst + 1] = clampInt(Math.round(mG), 0, 255);
          out[dst + 2] = clampInt(Math.round(mB), 0, 255);
        }
      }
      return { data: out, rows: rows, cols: cols };
    },

    /**
     * 主色采样（2-cluster k-means，iters=6）
     * 对应 perfect_pixel_noCV2.py:186-233
     *
     * 注意: Python 版在 cell 像素数 > max_samples (128) 时会做随机下采样。
     * 为了保证 JS 输出可重复，这里使用确定性等距下采样代替随机采样。
     * // TODO: 验证 — 不随机下采样是否会造成数值差异（不会影响主色簇的选择，实测可接受）。
     */
    sampleMajority: function (rgb, H, W, xCoords, yCoords, opts) {
      if (!opts) opts = {};
      var maxSamples = opts.maxSamples !== undefined ? opts.maxSamples : 128;
      var iters = opts.iters !== undefined ? opts.iters : 6;

      var xb = cellBounds(xCoords, W);
      var yb = cellBounds(yCoords, H);
      var cols = xb.lo.length;
      var rows = yb.lo.length;
      var out = new Uint8Array(rows * cols * 3);

      for (var j = 0; j < rows; j++) {
        var y0 = yb.lo[j], y1 = yb.hi[j];
        for (var i = 0; i < cols; i++) {
          var x0 = xb.lo[i], x1 = xb.hi[i];
          var n = (y1 - y0) * (x1 - x0);
          if (n <= 0) continue;

          // 收集像素
          var step = 1;
          if (n > maxSamples) step = Math.max(1, Math.floor(n / maxSamples));
          var buf = [];
          for (var yy = y0; yy < y1; yy++) {
            var base = yy * W * 3;
            for (var xx = x0; xx < x1; xx++) {
              buf.push([rgb[base + xx * 3], rgb[base + xx * 3 + 1], rgb[base + xx * 3 + 2]]);
            }
          }
          if (buf.length > maxSamples) {
            var ds = [];
            for (var ii = 0; ii < buf.length; ii += step) ds.push(buf[ii]);
            buf = ds;
          }
          var m = buf.length;

          // c0 = buf[0]
          // c1 = buf[argmax(||buf - c0||^2)]
          var c0 = [buf[0][0], buf[0][1], buf[0][2]];
          var bestK = 0, bestD = -1;
          for (var k = 0; k < m; k++) {
            var dr = buf[k][0] - c0[0];
            var dg = buf[k][1] - c0[1];
            var db = buf[k][2] - c0[2];
            var d = dr * dr + dg * dg + db * db;
            if (d > bestD) { bestD = d; bestK = k; }
          }
          var c1 = [buf[bestK][0], buf[bestK][1], buf[bestK][2]];

          var labels = new Uint8Array(m); // 0 -> c0, 1 -> c1
          var any0 = false, any1 = false;
          for (var it = 0; it < iters; it++) {
            var sum0r = 0, sum0g = 0, sum0b = 0, cnt0 = 0;
            var sum1r = 0, sum1g = 0, sum1b = 0, cnt1 = 0;
            any0 = false; any1 = false;
            for (var p = 0; p < m; p++) {
              var d0r = buf[p][0] - c0[0];
              var d0g = buf[p][1] - c0[1];
              var d0b = buf[p][2] - c0[2];
              var d0 = d0r * d0r + d0g * d0g + d0b * d0b;
              var d1r = buf[p][0] - c1[0];
              var d1g = buf[p][1] - c1[1];
              var d1b = buf[p][2] - c1[2];
              var d1 = d1r * d1r + d1g * d1g + d1b * d1b;
              if (d1 < d0) {
                labels[p] = 1; any1 = true;
                sum1r += buf[p][0]; sum1g += buf[p][1]; sum1b += buf[p][2]; cnt1++;
              } else {
                labels[p] = 0; any0 = true;
                sum0r += buf[p][0]; sum0g += buf[p][1]; sum0b += buf[p][2]; cnt0++;
              }
            }
            if (any0) { c0 = [sum0r / cnt0, sum0g / cnt0, sum0b / cnt0]; }
            if (any1) { c1 = [sum1r / cnt1, sum1g / cnt1, sum1b / cnt1]; }
          }

          // 选簇大的
          var n1 = 0;
          for (var q = 0; q < m; q++) if (labels[q] === 1) n1++;
          var n0 = m - n1;
          var pick = (n1 >= n0) ? c1 : c0;

          var dst = (j * cols + i) * 3;
          out[dst]     = clampInt(Math.round(pick[0]), 0, 255);
          out[dst + 1] = clampInt(Math.round(pick[1]), 0, 255);
          out[dst + 2] = clampInt(Math.round(pick[2]), 0, 255);
        }
      }
      return { data: out, rows: rows, cols: cols };
    }
  };

  root.PerfectPixelSamplers = PerfectPixelSamplers;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixelSamplers;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: perfect-pixel.js
 * 源路径: src/perfectPixel/js/perfect-pixel.js
 * 行数: 173
 * 说明: PerfectPixel 主入口 — getPerfectPixel()，把任意图转为整齐像素矩阵
 * ============================================================================ */
// ============================================================================
// perfect-pixel.js — PerfectPixel 主入口
// 对应 Python 参考: src/perfect_pixel/perfect_pixel_noCV2.py:422-490 (get_perfect_pixel)
//
// 流程:
//   1. ImageData (RGBA) -> Uint8Array (RGB, H*W*3)
//   2. detectGridScale -> [rows, cols]
//   3. refineGrids(rgb, H, W, cols, rows, refineIntensity) -> {xCoords, yCoords}
//   4. samplers[method](rgb, H, W, xCoords, yCoords) -> {data, rows, cols}
//   5. fixSquare 修正
//   6. 返回 {ok, refinedW, refinedH, pixelMatrix}
// ============================================================================
(function (root) {
  'use strict';

  function rgbaToRgb(rgba, H, W) {
    var N = H * W;
    var out = new Uint8Array(N * 3);
    for (var i = 0, p = 0, q = 0; i < N; i++, p += 4, q += 3) {
      out[q]     = rgba[p];
      out[q + 1] = rgba[p + 1];
      out[q + 2] = rgba[p + 2];
    }
    return out;
  }

  // fix_square: 当 |rows - cols| == 1 时按 Python 逻辑调整 data
  //   rows > cols (即 refined_size_y > refined_size_x 方向) 等对应关系注意：
  //   Python 里 refined_size_x = len(x) - 1 = cols, refined_size_y = rows
  //   if refined_size_x > refined_size_y: ...
  //     if odd: scaled_image = scaled_image[:, :-1]  -> 删最后一列
  //     else:  scaled_image = concat([scaled_image[:1,:], scaled_image]) -> 顶部复制一行
  //   else:
  //     if refined_size_y odd: delete last row
  //     else: duplicate first column
  function fixSquare(mat, rows, cols) {
    if (Math.abs(rows - cols) !== 1) return { data: mat, rows: rows, cols: cols };

    var out;
    if (cols > rows) {
      if ((cols & 1) === 1) {
        // remove last column
        var newCols = cols - 1;
        out = new Uint8Array(rows * newCols * 3);
        for (var j = 0; j < rows; j++) {
          for (var i = 0; i < newCols; i++) {
            var src = (j * cols + i) * 3;
            var dst = (j * newCols + i) * 3;
            out[dst] = mat[src];
            out[dst + 1] = mat[src + 1];
            out[dst + 2] = mat[src + 2];
          }
        }
        return { data: out, rows: rows, cols: newCols };
      } else {
        // duplicate first row on top
        var newRows = rows + 1;
        out = new Uint8Array(newRows * cols * 3);
        // row 0 copy from mat row 0
        for (var ii = 0; ii < cols * 3; ii++) out[ii] = mat[ii];
        // rest copy
        for (var jj = 0; jj < rows; jj++) {
          var rb = (jj + 1) * cols * 3;
          var sb = jj * cols * 3;
          for (var kk = 0; kk < cols * 3; kk++) out[rb + kk] = mat[sb + kk];
        }
        return { data: out, rows: newRows, cols: cols };
      }
    } else {
      // rows > cols
      if ((rows & 1) === 1) {
        // remove last row
        var newRows2 = rows - 1;
        out = new Uint8Array(newRows2 * cols * 3);
        for (var n = 0; n < newRows2 * cols * 3; n++) out[n] = mat[n];
        return { data: out, rows: newRows2, cols: cols };
      } else {
        // duplicate first column on left
        var newCols2 = cols + 1;
        out = new Uint8Array(rows * newCols2 * 3);
        for (var jy = 0; jy < rows; jy++) {
          var srcRowBase = jy * cols * 3;
          var dstRowBase = jy * newCols2 * 3;
          // first column of dst = first column of src
          out[dstRowBase]     = mat[srcRowBase];
          out[dstRowBase + 1] = mat[srcRowBase + 1];
          out[dstRowBase + 2] = mat[srcRowBase + 2];
          // rest
          for (var ix = 0; ix < cols; ix++) {
            var s = srcRowBase + ix * 3;
            var d = dstRowBase + (ix + 1) * 3;
            out[d]     = mat[s];
            out[d + 1] = mat[s + 1];
            out[d + 2] = mat[s + 2];
          }
        }
        return { data: out, rows: rows, cols: newCols2 };
      }
    }
  }

  var PerfectPixel = {

    /**
     * 主入口
     * @param {ImageData} imageData
     * @param {object} options
     * @returns {{ok:true, refinedW, refinedH, pixelMatrix} | {ok:false, reason}}
     */
    getPerfectPixel: function (imageData, options) {
      if (!options) options = {};
      var sampleMethod = options.sampleMethod || 'center';
      var gridSize = options.gridSize || null;        // [cols, rows]  (与 Python 一致: grid_w, grid_h)
      var minSize = options.minSize !== undefined ? options.minSize : 4.0;
      var peakWidth = options.peakWidth !== undefined ? options.peakWidth : 6;
      var refineIntensity = options.refineIntensity !== undefined ? options.refineIntensity : 0.25;
      var fixSq = options.fixSquare !== undefined ? options.fixSquare : true;

      var H = imageData.height;
      var W = imageData.width;
      var rgb = rgbaToRgb(imageData.data, H, W);

      var GE = root.PerfectPixelGridEstimator;
      var GR = root.PerfectPixelGridRefiner;
      var SP = root.PerfectPixelSamplers;

      var rows, cols;
      if (gridSize) {
        // Python: scale_col, scale_row = grid_size -> (cols, rows)
        cols = gridSize[0] | 0;
        rows = gridSize[1] | 0;
      } else {
        var rc = GE.detectGridScale(rgb, H, W, { peakWidth: peakWidth, minSize: minSize });
        if (!rc) {
          return { ok: false, reason: 'grid detection failed' };
        }
        rows = rc[0]; cols = rc[1];
      }

      if (!(rows > 0 && cols > 0)) {
        return { ok: false, reason: 'invalid grid size: rows=' + rows + ' cols=' + cols };
      }

      var ref = GR.refineGrids(rgb, H, W, cols, rows, refineIntensity);

      var fn;
      if (sampleMethod === 'majority') fn = SP.sampleMajority;
      else if (sampleMethod === 'median') fn = SP.sampleMedian;
      else fn = SP.sampleCenter;

      var sampled = fn.call(SP, rgb, H, W, ref.xCoords, ref.yCoords);

      if (fixSq) {
        var fixed = fixSquare(sampled.data, sampled.rows, sampled.cols);
        sampled.data = fixed.data;
        sampled.rows = fixed.rows;
        sampled.cols = fixed.cols;
      }

      return {
        ok: true,
        refinedW: sampled.cols,
        refinedH: sampled.rows,
        pixelMatrix: sampled.data
      };
    }
  };

  root.PerfectPixel = PerfectPixel;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfectPixel;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: app.js
 * 源路径: src/图片生成/app.js
 * 行数: 6831
 * 说明: 业务主控 — UI 状态、生图流程、MARD 调色板、最近色匹配；末尾注入 window.PerfectPixelHooks
 * ============================================================================ */
﻿const MARD_PALETTE = [
{id:'A1',r:250,g:245,b:205,family:'A'},{id:'A2',r:252,g:254,b:214,family:'A'},{id:'A3',r:252,g:255,b:148,family:'A'},{id:'A4',r:247,g:236,b:92,family:'A'},{id:'A5',r:240,g:216,b:58,family:'A'},{id:'A6',r:253,g:169,b:81,family:'A'},{id:'A7',r:250,g:140,b:79,family:'A'},{id:'A8',r:251,g:218,b:77,family:'A'},{id:'A9',r:247,g:157,b:95,family:'A'},{id:'A10',r:244,g:126,b:56,family:'A'},{id:'A11',r:254,g:219,b:153,family:'A'},{id:'A12',r:253,g:162,b:117,family:'A'},{id:'A13',r:254,g:198,b:103,family:'A'},{id:'A14',r:247,g:88,b:66,family:'A'},{id:'A15',r:251,g:246,b:94,family:'A'},{id:'A16',r:254,g:255,b:151,family:'A'},{id:'A17',r:253,g:225,b:115,family:'A'},{id:'A18',r:254,g:190,b:128,family:'A'},{id:'A19',r:253,g:126,b:119,family:'A'},{id:'A20',r:249,g:214,b:110,family:'A'},{id:'A21',r:250,g:227,b:147,family:'A'},{id:'A22',r:237,g:248,b:120,family:'A'},{id:'A23',r:228,g:200,b:186,family:'A'},{id:'A24',r:243,g:246,b:169,family:'A'},{id:'A25',r:236,g:218,b:172,family:'A'},{id:'A26',r:255,g:201,b:51,family:'A'},
{id:'B1',r:223,g:241,b:61,family:'B'},{id:'B2',r:100,g:243,b:67,family:'B'},{id:'B3',r:161,g:245,b:134,family:'B'},{id:'B4',r:95,g:223,b:52,family:'B'},{id:'B5',r:57,g:225,b:88,family:'B'},{id:'B6',r:100,g:224,b:164,family:'B'},{id:'B7',r:62,g:174,b:124,family:'B'},{id:'B8',r:29,g:155,b:84,family:'B'},{id:'B9',r:42,g:80,b:55,family:'B'},{id:'B10',r:154,g:209,b:186,family:'B'},{id:'B11',r:98,g:112,b:50,family:'B'},{id:'B12',r:26,g:110,b:61,family:'B'},{id:'B13',r:200,g:232,b:125,family:'B'},{id:'B14',r:171,g:232,b:79,family:'B'},{id:'B15',r:50,g:85,b:53,family:'B'},{id:'B16',r:192,g:237,b:156,family:'B'},{id:'B17',r:157,g:178,b:61,family:'B'},{id:'B18',r:230,g:237,b:81,family:'B'},{id:'B19',r:38,g:183,b:142,family:'B'},{id:'B20',r:203,g:236,b:205,family:'B'},{id:'B21',r:24,g:97,b:106,family:'B'},{id:'B22',r:10,g:66,b:65,family:'B'},{id:'B23',r:52,g:59,b:26,family:'B'},{id:'B24',r:232,g:250,b:166,family:'B'},{id:'B25',r:78,g:132,b:109,family:'B'},{id:'B26',r:144,g:124,b:53,family:'B'},{id:'B27',r:208,g:224,b:175,family:'B'},{id:'B28',r:158,g:229,b:187,family:'B'},{id:'B29',r:198,g:223,b:95,family:'B'},{id:'B30',r:227,g:251,b:177,family:'B'},{id:'B31',r:180,g:230,b:145,family:'B'},{id:'B32',r:146,g:173,b:96,family:'B'},
{id:'C1',r:240,g:254,b:228,family:'C'},{id:'C2',r:171,g:248,b:254,family:'C'},{id:'C3',r:162,g:224,b:247,family:'C'},{id:'C4',r:68,g:205,b:251,family:'C'},{id:'C5',r:6,g:170,b:223,family:'C'},{id:'C6',r:84,g:167,b:233,family:'C'},{id:'C7',r:57,g:119,b:202,family:'C'},{id:'C8',r:15,g:82,b:189,family:'C'},{id:'C9',r:51,g:73,b:195,family:'C'},{id:'C10',r:60,g:188,b:227,family:'C'},{id:'C11',r:41,g:223,b:211,family:'C'},{id:'C12',r:30,g:51,b:78,family:'C'},{id:'C13',r:205,g:231,b:254,family:'C'},{id:'C14',r:213,g:252,b:247,family:'C'},{id:'C15',r:33,g:197,b:196,family:'C'},{id:'C16',r:24,g:88,b:162,family:'C'},{id:'C17',r:2,g:209,b:243,family:'C'},{id:'C18',r:33,g:50,b:70,family:'C'},{id:'C19',r:24,g:135,b:155,family:'C'},{id:'C20',r:24,g:113,b:169,family:'C'},{id:'C21',r:187,g:222,b:252,family:'C'},{id:'C22',r:107,g:177,b:187,family:'C'},{id:'C23',r:200,g:226,b:253,family:'C'},{id:'C24',r:126,g:197,b:249,family:'C'},{id:'C25',r:169,g:232,b:224,family:'C'},{id:'C26',r:66,g:173,b:207,family:'C'},{id:'C27',r:208,g:222,b:249,family:'C'},{id:'C28',r:189,g:206,b:232,family:'C'},{id:'C29',r:54,g:74,b:137,family:'C'},
{id:'D1',r:172,g:183,b:239,family:'D'},{id:'D2',r:134,g:141,b:211,family:'D'},{id:'D3',r:53,g:84,b:175,family:'D'},{id:'D4',r:22,g:45,b:123,family:'D'},{id:'D5',r:179,g:78,b:198,family:'D'},{id:'D6',r:179,g:123,b:220,family:'D'},{id:'D7',r:135,g:88,b:169,family:'D'},{id:'D8',r:227,g:210,b:254,family:'D'},{id:'D9',r:213,g:185,b:246,family:'D'},{id:'D10',r:48,g:26,b:72,family:'D'},{id:'D11',r:190,g:185,b:226,family:'D'},{id:'D12',r:220,g:153,b:206,family:'D'},{id:'D13',r:181,g:3,b:141,family:'D'},{id:'D14',r:134,g:41,b:147,family:'D'},{id:'D15',r:47,g:31,b:140,family:'D'},{id:'D16',r:226,g:228,b:240,family:'D'},{id:'D17',r:201,g:210,b:251,family:'D'},{id:'D18',r:154,g:100,b:184,family:'D'},{id:'D19',r:216,g:194,b:217,family:'D'},{id:'D20',r:154,g:53,b:173,family:'D'},{id:'D21',r:148,g:5,b:149,family:'D'},{id:'D22',r:56,g:56,b:154,family:'D'},{id:'D23',r:234,g:219,b:248,family:'D'},{id:'D24',r:118,g:138,b:225,family:'D'},{id:'D25',r:73,g:80,b:194,family:'D'},{id:'D26',r:214,g:198,b:235,family:'D'},
{id:'E1',r:246,g:212,b:203,family:'E'},{id:'E2',r:252,g:193,b:221,family:'E'},{id:'E3',r:246,g:189,b:232,family:'E'},{id:'E4',r:232,g:100,b:158,family:'E'},{id:'E5',r:240,g:86,b:159,family:'E'},{id:'E6',r:235,g:65,b:114,family:'E'},{id:'E7',r:198,g:54,b:116,family:'E'},{id:'E8',r:252,g:220,b:233,family:'E'},{id:'E9',r:227,g:118,b:199,family:'E'},{id:'E10',r:211,g:58,b:149,family:'E'},{id:'E11',r:247,g:218,b:212,family:'E'},{id:'E12',r:246,g:147,b:191,family:'E'},{id:'E13',r:181,g:2,b:106,family:'E'},{id:'E14',r:250,g:212,b:191,family:'E'},{id:'E15',r:245,g:201,b:202,family:'E'},{id:'E16',r:251,g:244,b:236,family:'E'},{id:'E17',r:248,g:227,b:236,family:'E'},{id:'E18',r:249,g:200,b:219,family:'E'},{id:'E19',r:246,g:187,b:209,family:'E'},{id:'E20',r:215,g:198,b:206,family:'E'},{id:'E21',r:192,g:157,b:164,family:'E'},{id:'E22',r:179,g:140,b:159,family:'E'},{id:'E23',r:148,g:124,b:138,family:'E'},{id:'E24',r:222,g:190,b:229,family:'E'},
{id:'F1',r:254,g:147,b:127,family:'F'},{id:'F2',r:246,g:61,b:75,family:'F'},{id:'F3',r:238,g:78,b:62,family:'F'},{id:'F4',r:253,g:41,b:64,family:'F'},{id:'F5',r:225,g:3,b:40,family:'F'},{id:'F6',r:145,g:54,b:53,family:'F'},{id:'F7',r:145,g:25,b:50,family:'F'},{id:'F8',r:187,g:1,b:38,family:'F'},{id:'F9',r:224,g:103,b:122,family:'F'},{id:'F10',r:135,g:70,b:40,family:'F'},{id:'F11',r:88,g:34,b:32,family:'F'},{id:'F12',r:243,g:83,b:107,family:'F'},{id:'F13',r:244,g:92,b:69,family:'F'},{id:'F14',r:252,g:173,b:178,family:'F'},{id:'F15',r:213,g:5,b:39,family:'F'},{id:'F16',r:248,g:192,b:169,family:'F'},{id:'F17',r:232,g:155,b:125,family:'F'},{id:'F18',r:208,g:127,b:74,family:'F'},{id:'F19',r:190,g:69,b:74,family:'F'},{id:'F20',r:198,g:148,b:149,family:'F'},{id:'F21',r:242,g:184,b:198,family:'F'},{id:'F22',r:247,g:195,b:208,family:'F'},{id:'F23',r:237,g:127,b:110,family:'F'},{id:'F24',r:224,g:157,b:175,family:'F'},{id:'F25',r:232,g:72,b:84,family:'F'},
{id:'G1',r:255,g:228,b:211,family:'G'},{id:'G2',r:252,g:198,b:172,family:'G'},{id:'G3',r:241,g:196,b:165,family:'G'},{id:'G4',r:220,g:179,b:135,family:'G'},{id:'G5',r:230,g:178,b:77,family:'G'},{id:'G6',r:227,g:159,b:22,family:'G'},{id:'G7',r:152,g:92,b:58,family:'G'},{id:'G8',r:113,g:61,b:47,family:'G'},{id:'G9',r:228,g:182,b:133,family:'G'},{id:'G10',r:219,g:141,b:67,family:'G'},{id:'G11',r:218,g:200,b:150,family:'G'},{id:'G12',r:254,g:201,b:147,family:'G'},{id:'G13',r:180,g:113,b:71,family:'G'},{id:'G14',r:139,g:104,b:76,family:'G'},{id:'G15',r:246,g:248,b:227,family:'G'},{id:'G16',r:242,g:214,b:192,family:'G'},{id:'G17',r:119,g:84,b:78,family:'G'},{id:'G18',r:255,g:227,b:213,family:'G'},{id:'G19',r:221,g:125,b:65,family:'G'},{id:'G20',r:167,g:68,b:45,family:'G'},{id:'G21',r:179,g:133,b:97,family:'G'},
{id:'H1',r:255,g:255,b:255,family:'H'},{id:'H2',r:251,g:251,b:251,family:'H'},{id:'H3',r:180,g:180,b:180,family:'H'},{id:'H4',r:135,g:135,b:135,family:'H'},{id:'H5',r:70,g:70,b:72,family:'H'},{id:'H6',r:44,g:44,b:44,family:'H'},{id:'H7',r:1,g:1,b:1,family:'H'},{id:'H8',r:231,g:214,b:220,family:'H'},{id:'H9',r:239,g:237,b:238,family:'H'},{id:'H10',r:235,g:235,b:235,family:'H'},{id:'H11',r:205,g:205,b:205,family:'H'},{id:'H12',r:253,g:246,b:238,family:'H'},{id:'H13',r:244,g:239,b:209,family:'H'},{id:'H14',r:206,g:215,b:212,family:'H'},{id:'H15',r:154,g:166,b:166,family:'H'},{id:'H16',r:27,g:18,b:19,family:'H'},{id:'H17',r:240,g:238,b:239,family:'H'},{id:'H18',r:252,g:255,b:246,family:'H'},{id:'H19',r:243,g:239,b:230,family:'H'},{id:'H20',r:150,g:160,b:159,family:'H'},{id:'H21',r:248,g:251,b:230,family:'H'},{id:'H22',r:202,g:202,b:210,family:'H'},{id:'H23',r:155,g:156,b:148,family:'H'},
{id:'M1',r:187,g:198,b:182,family:'M'},{id:'M2',r:144,g:153,b:148,family:'M'},{id:'M3',r:105,g:126,b:129,family:'M'},{id:'M4',r:224,g:212,b:188,family:'M'},{id:'M5',r:209,g:204,b:175,family:'M'},{id:'M6',r:176,g:170,b:134,family:'M'},{id:'M7',r:176,g:167,b:150,family:'M'},{id:'M8',r:174,g:128,b:130,family:'M'},{id:'M9',r:166,g:136,b:98,family:'M'},{id:'M10',r:197,g:180,b:188,family:'M'},{id:'M11',r:157,g:118,b:145,family:'M'},{id:'M12',r:100,g:75,b:81,family:'M'},{id:'M13',r:198,g:145,b:101,family:'M'},{id:'M14',r:194,g:117,b:99,family:'M'},{id:'M15',r:116,g:125,b:122,family:'M'}
];
function srgbToLinear(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function rgbToXyz(r, g, b) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  return [lr*0.4124564+lg*0.3575761+lb*0.1804375, lr*0.2126729+lg*0.7151522+lb*0.0721750, lr*0.0193339+lg*0.1191920+lb*0.9503041];
}
function xyzToLab(x, y, z) {
  const Xn=0.95047, Yn=1.0, Zn=1.08883;
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787*t + 16/116;
  const fx=f(x/Xn), fy=f(y/Yn), fz=f(z/Zn);
  return [116*fy-16, 500*(fx-fy), 200*(fy-fz)];
}
function rgbToLab(r, g, b) { const [x,y,z] = rgbToXyz(r,g,b); return xyzToLab(x,y,z); }
const FAMILY_MAP = {};
const PALETTE_ID_TO_INDEX = new Map();
MARD_PALETTE.forEach((c, i) => {
  const [L, a, b] = rgbToLab(c.r, c.g, c.b);
  c.L = L; c.a = a; c.b_lab = b; c.chroma = Math.hypot(a, b); c.hue = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360; c.index = i;
  if (!FAMILY_MAP[c.family]) FAMILY_MAP[c.family] = [];
  FAMILY_MAP[c.family].push(i);
  PALETTE_ID_TO_INDEX.set(c.id, i);
});
const FAMILIES = ['A','B','C','D','E','F','G','H','M'];
const ALL_INDICES = MARD_PALETTE.map((_, i) => i);
const DARK_NEUTRAL_INDICES = ALL_INDICES.filter(i => {
  const c = MARD_PALETTE[i];
  return c.L < 48 && c.chroma < 9;
});
const DARK_NEUTRAL_STRICT_INDICES = ALL_INDICES.filter(i => {
  const c = MARD_PALETTE[i];
  return c.L < 22 && c.chroma < 5;
});
const DARK_WARM_INDICES = ALL_INDICES.filter(i => {
  const c = MARD_PALETTE[i];
  const warm = c.hue <= 85 || c.hue >= 320;
  return c.L < 58 && c.chroma >= 6 && warm;
});
const DARK_CHROMATIC_INDICES = ALL_INDICES.filter(i => {
  const c = MARD_PALETTE[i];
  return c.L < 58 && c.chroma >= 6;
});

// Phase 1.4: 高频使用色号子集 (~45种)
// 基于拼豆美学: 白/黑/灰系、常见肤色、基础红黄蓝绿棕、腮红粉
// 优先从该子集匹配，减少"奇怪颜色"概率，完整221色作为fallback
const FREQUENT_MARD_IDS = [
  // H系 灰度 (白/灰/黑 - 描边+背景核心色)
  'H1', 'H2', 'H6', 'H7', 'H10', 'H11', 'H3', 'H4', 'H5', 'H16', 'H9',
  // A系 暖黄橙 (主体常见填充色)
  'A1', 'A4', 'A5', 'A6', 'A7', 'A11', 'A17', 'A21',
  // G系 肤色/棕色 (人物必备)
  'G1', 'G2', 'G3', 'G4', 'G7', 'G8', 'G9', 'G13', 'G16', 'G18',
  // F系 红色 (腮红/衣服)
  'F1', 'F2', 'F4', 'F5', 'F14', 'F12',
  // E系 粉色 (腮红/少女)
  'E1', 'E2', 'E4', 'E8', 'E11', 'E16',
  // C系 蓝色 (天空/衣服)
  'C3', 'C4', 'C7', 'C13', 'C21',
  // B系 绿色
  'B3', 'B4', 'B8', 'B13',
  // D系 紫色
  'D1', 'D6', 'D8',
  // M系 低彩度中性色 (衣物/阴影)
  'M1', 'M4', 'M7', 'M9', 'M12'
];
const FREQUENT_MARD_SUBSET = FREQUENT_MARD_IDS
  .map(id => PALETTE_ID_TO_INDEX.get(id))
  .filter(idx => idx !== undefined);

// ========== 手绘拼豆风格指纹 (从99张小红书手绘样本提取) ==========
const HANDCRAFT_STYLE_PROFILE = {
  sampleSize: 99,
  colorCount: { median: 17, mean: 17.2, min: 10, max: 28, std: 3.2 },
  bgRatio: { median: 0.511, mean: 0.505, min: 0.006, max: 0.699 },
  outlineRatio: { median: 0.075, mean: 0.078, min: 0, max: 0.275 },
  chromaStats: { mean: 10.6, std: 4.6, p90: 39.1 },
  entropy: { median: 3.33, mean: 3.3, max: 5.19 },
  preferredMardIndices: [183,184,199,189,187,192,188,102,193,185,198,186,126,220,10,165,109,22,170,202,175,166,212,150,144,145,178,196,155,7,182,174,168,204,81,164,214,5,213,62],
  familyFrequency: { A:0.0447, B:0.0154, C:0.0205, D:0.0412, E:0.0391, F:0.0529, G:0.0637, H:0.6806, M:0.042 }
};
// 手绘样本高频MARD色号集合 (用于调色板偏好)
const HANDCRAFT_PREFERRED_SET = new Set(HANDCRAFT_STYLE_PROFILE.preferredMardIndices);

// ========== 原图全局色调预分析（增强版：丰富颜色情报辅助生图） ==========
function preAnalyzeGlobalColorDistribution(imageData) {
  const data = imageData.data, w = imageData.width, h = imageData.height;
  const totalPixels = w * h;
  // 等间距采样约100万点（或全图，取较小者）
  const targetSamples = Math.min(totalPixels, 1000000);
  const step = Math.max(1, Math.round(Math.sqrt(totalPixels / targetSamples)));
  let sampleCount = 0, chromaSum = 0, bgPixels = 0, darkPixels = 0;
  const chromaBuckets = { low: 0, mid: 0, high: 0 }; // chroma <8, 8-20, >20
  const colorBuckets = new Set();
  // ★ 新增：色相扇区统计、暖冷色、肤色、前景色复杂度、高彩度特征色、中性色
  const hueSectorCounts = { warmRed: 0, warmYellow: 0, green: 0, coolCyan: 0, coolBlue: 0, purple: 0 };
  let warmCount = 0, coolCount = 0, skinPixels = 0, fgPixelCount = 0, neutralPixels = 0;
  const fgColorBuckets = new Set();
  const highChromaHue = { sinSum: 0, cosSum: 0, count: 0 };
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      if (data[i+3] < 128) continue;
      sampleCount++;
      const [L, a, bVal] = rgbToLab(r, g, b);
      const chroma = Math.hypot(a, bVal);
      chromaSum += chroma;
      if (chroma < 8) chromaBuckets.low++;
      else if (chroma < 20) chromaBuckets.mid++;
      else chromaBuckets.high++;
      const isBg = L > 92 && chroma < 8;
      if (isBg) bgPixels++;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const isDark = lum < 50;
      if (isDark) darkPixels++;
      colorBuckets.add(((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4));
      // ★ 前景像素深入分析（排除背景和描边）
      if (!isBg && !isDark) {
        fgPixelCount++;
        const hue = (Math.atan2(bVal, a) * 180 / Math.PI + 360) % 360;
        // 中性色计数（chroma < 6 的前景像素）
        if (chroma < 6) neutralPixels++;
        // 色相扇区分类
        if (hue < 60) hueSectorCounts.warmRed++;
        else if (hue < 120) hueSectorCounts.warmYellow++;
        else if (hue < 180) hueSectorCounts.green++;
        else if (hue < 240) hueSectorCounts.coolCyan++;
        else if (hue < 300) hueSectorCounts.coolBlue++;
        else hueSectorCounts.purple++;
        // 暖/冷色
        if (hue < 120 || hue >= 300) warmCount++;
        else coolCount++;
        // 肤色检测（hue 8-78, L 58-92, chroma 8-36）
        if (hue >= 8 && hue <= 78 && L >= 58 && L <= 92 && chroma >= 8 && chroma <= 36) skinPixels++;
        // 前景色复杂度桶
        fgColorBuckets.add(((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4));
        // 高彩度特征色色相加权累积
        if (chroma > 25) {
          const rad = hue * Math.PI / 180;
          highChromaHue.sinSum += Math.sin(rad) * chroma;
          highChromaHue.cosSum += Math.cos(rad) * chroma;
          highChromaHue.count++;
        }
      }
    }
  }
  if (sampleCount === 0) return null;
  const fgTotal = Math.max(1, fgPixelCount);
  // ★ 计算色相分布
  const hueDistribution = {};
  for (const k in hueSectorCounts) hueDistribution[k] = hueSectorCounts[k] / fgTotal;
  // ★ 主色相扇区
  let dominantHueSector = 'warmRed', maxSectorRatio = 0;
  for (const k in hueDistribution) {
    if (hueDistribution[k] > maxSectorRatio) { maxSectorRatio = hueDistribution[k]; dominantHueSector = k; }
  }
  // ★ 高彩度主色相
  let highChromaDominantHue = null;
  if (highChromaHue.count > 0) {
    highChromaDominantHue = (Math.atan2(highChromaHue.sinSum, highChromaHue.cosSum) * 180 / Math.PI + 360) % 360;
  }
  return {
    // 原有字段（完整保留）
    estimatedColorCount: colorBuckets.size,
    bgRatio: bgPixels / sampleCount,
    darkRatio: darkPixels / sampleCount,
    avgChroma: chromaSum / sampleCount,
    chromaDistribution: {
      low: chromaBuckets.low / sampleCount,
      mid: chromaBuckets.mid / sampleCount,
      high: chromaBuckets.high / sampleCount
    },
    // ★ 新增字段：丰富颜色情报
    hueDistribution,                    // 6扇区色相占比
    warmRatio: warmCount / fgTotal,     // 暖色系前景占比
    coolRatio: coolCount / fgTotal,     // 冷色系前景占比
    skinRatio: skinPixels / fgTotal,    // 肤色像素占比
    fgColorComplexity: fgColorBuckets.size, // 前景色4-bit量化桶数
    dominantHueSector,                  // 最大占比色相扇区
    highChromaDominantHue,              // 高彩度像素加权平均色相
    neutralRatio: neutralPixels / fgTotal, // 中性色(chroma<6)前景占比
  };
}

// ========== 手绘风格评分 ==========
function scoreHandcraftSimilarity(gridData, rows, cols) {
  if (!gridData || !rows || !cols) return { total: 0, breakdown: {} };
  const profile = HANDCRAFT_STYLE_PROFILE;
  const totalCells = rows * cols;
  // 统计生成图指标
  const usedColors = new Set();
  let bgCells = 0, darkCells = 0, chromaSum = 0, fgCells = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = gridData[r][c];
      if (idx < 0) { bgCells++; continue; }
      usedColors.add(idx);
      const p = MARD_PALETTE[idx];
      if (p.L > 92 && p.chroma < 8) bgCells++;
      if (p.L < 30) darkCells++;
      chromaSum += p.chroma;
      fgCells++;
    }
  }
  const colorCount = usedColors.size;
  const bgRatio = bgCells / totalCells;
  const outlineRatio = darkCells / totalCells;
  const avgChroma = fgCells > 0 ? chromaSum / fgCells : 0;
  // 简易色块面积（用颜色数反推）
  const avgBlockSize = fgCells / Math.max(1, colorCount);
  // 简易熵
  const colorFreqs = new Map();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const idx = gridData[r][c];
    if (idx >= 0) colorFreqs.set(idx, (colorFreqs.get(idx) || 0) + 1);
  }
  let entropy = 0;
  for (const count of colorFreqs.values()) {
    const p = count / totalCells;
    if (p > 0) entropy -= p * Math.log2(p);
  }
  // 评分（各维度 0-满分，总分 0-100）
  const scoreRange = (val, ideal, tolerance, maxPts) => {
    const diff = Math.abs(val - ideal);
    return Math.max(0, maxPts * (1 - diff / tolerance));
  };
  const scoreInRange = (val, lo, hi, maxPts) => {
    if (val >= lo && val <= hi) return maxPts;
    const diff = val < lo ? lo - val : val - hi;
    const range = hi - lo;
    return Math.max(0, maxPts * (1 - diff / range));
  };
  const b = {};
  b.colorCount = scoreInRange(colorCount, profile.colorCount.min, profile.colorCount.max, 15);
  b.bgRatio = scoreInRange(bgRatio, profile.bgRatio.min, profile.bgRatio.max, 15);
  b.outlineRatio = scoreInRange(outlineRatio, 0.03, profile.outlineRatio.max, 20);
  b.chromaMatch = scoreRange(avgChroma, profile.chromaStats.mean, profile.chromaStats.mean + profile.chromaStats.std * 2, 25);
  b.entropy = scoreInRange(entropy, 1.5, profile.entropy.max, 10);
  // 手绘色号偏好分（使用的颜色中有多少在手绘高频集合中）
  let preferredCount = 0;
  for (const idx of usedColors) { if (HANDCRAFT_PREFERRED_SET.has(idx)) preferredCount++; }
  b.palettePreference = Math.min(15, (preferredCount / Math.max(1, colorCount)) * 20);
  const total = Math.round(Object.values(b).reduce((s, v) => s + v, 0));
  return { total: Math.min(100, total), breakdown: b };
}

const NEAREST_COLOR_CACHE = new Map();
const NEAREST_COLOR_CACHE_LIMIT = 60000;
function deltaE2000FromLab(L1, a1, b1, L2, a2, b2) {
  const avgLp = (L1 + L2) * 0.5;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const avgC = (C1 + C2) * 0.5;
  const pow25_7 = 6103515625;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + pow25_7)));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const avgCp = (C1p + C2p) * 0.5;
  const h1pDeg = (Math.atan2(b1, a1p) * 180 / Math.PI + 360) % 360;
  const h2pDeg = (Math.atan2(b2, a2p) * 180 / Math.PI + 360) % 360;
  let dHpDeg = h2pDeg - h1pDeg;
  if (dHpDeg > 180) dHpDeg -= 360;
  if (dHpDeg < -180) dHpDeg += 360;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dHpDeg * Math.PI / 180) * 0.5);
  let avgHpDeg = h1pDeg + h2pDeg;
  if (Math.abs(h1pDeg - h2pDeg) > 180) avgHpDeg += 360;
  avgHpDeg = (avgHpDeg * 0.5) % 360;
  const T = 1
    - 0.17 * Math.cos((avgHpDeg - 30) * Math.PI / 180)
    + 0.24 * Math.cos((2 * avgHpDeg) * Math.PI / 180)
    + 0.32 * Math.cos((3 * avgHpDeg + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * avgHpDeg - 63) * Math.PI / 180);
  const dTheta = 30 * Math.exp(-Math.pow((avgHpDeg - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + pow25_7));
  const Sl = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;
  const Rt = -Math.sin(2 * dTheta * Math.PI / 180) * Rc;
  const dL = dLp / Sl;
  const dC = dCp / Sc;
  const dH = dHp / Sh;
  return Math.sqrt(dL * dL + dC * dC + dH * dH + Rt * dC * dH);
}
function nearestColorByLab(L, a, bVal, palette) {
  const srcChroma = Math.hypot(a, bVal);
  const srcHue = (Math.atan2(bVal, a) * 180 / Math.PI + 360) % 360;
  const srcIsWarm = srcHue >= 0 && srcHue <= 85;
  const srcIsDark = L < 44;
  const srcNearNeutral = srcChroma < 12;
  const srcLowSat = srcChroma < 9;
  const srcWarmDark = srcIsDark && srcIsWarm && srcChroma >= 5.5;
  const top = [];
  const KEEP = Math.min(14, palette.length);
  for (const idx of palette) {
    const c = MARD_PALETTE[idx];
    const dL = L - c.L, da = a - c.a, db = bVal - c.b_lab;
    const d76 = dL * dL + da * da + db * db;
    const chromaPenalty = Math.abs(srcChroma - c.chroma);
    const score = d76 + chromaPenalty * chromaPenalty * 0.8;
    if (top.length < KEEP) {
      top.push({ idx, score });
      continue;
    }
    let worst = 0;
    for (let i = 1; i < top.length; i++) {
      if (top[i].score > top[worst].score) worst = i;
    }
    if (score < top[worst].score) top[worst] = { idx, score };
  }
  let bestIdx = top.length > 0 ? top[0].idx : (palette[0] || 0);
  let bestScore = Infinity;
  for (const cand of top) {
    const c = MARD_PALETTE[cand.idx];
    const de00 = deltaE2000FromLab(L, a, bVal, c.L, c.a, c.b_lab);
    const chromaPenalty = Math.abs(srcChroma - c.chroma) * 0.06;
    const hueDelta = Math.min(Math.abs(srcHue - c.hue), 360 - Math.abs(srcHue - c.hue));
    const huePenalty = (srcChroma > 10 && c.chroma > 10 && hueDelta > 42) ? (hueDelta - 42) * 0.03 : 0;
    const neutralDarkPenalty =
      (srcChroma > 14 && c.chroma < 8 && c.L < 58)
        ? (4.0 + (srcChroma - 14) * 0.12 + Math.max(0, 42 - c.L) * 0.06)
        : 0;
    const warmToNeutralPenalty =
      (srcIsWarm && srcChroma > 8 && c.chroma < 9 && c.L < 54)
        ? 2.3
        : 0;
    const candWarm = (c.hue <= 72 || c.hue >= 318);
    const darkWarmSpecklePenalty =
      (srcIsDark && srcNearNeutral && candWarm && c.chroma > 12)
        ? (2.6 + (c.chroma - 12) * 0.1 + Math.max(0, 44 - c.L) * 0.03)
        : 0;
    const darkLiftPenalty =
      (srcIsDark && c.L > L + 8)
        ? (c.L - (L + 8)) * 0.2
        : 0;
    const darkTintPenalty =
      (srcIsDark && srcNearNeutral && c.chroma > 24 && c.L < 62)
        ? (c.chroma - 24) * 0.08
        : 0;
    const warmDarkToNeutralPenalty =
      (srcWarmDark && c.chroma < 8 && c.L < 54)
        ? (3.2 + Math.max(0, 10 - srcChroma) * 0.22 + Math.max(0, 54 - c.L) * 0.04)
        : 0;
    const warmDarkAffinityBonus =
      (srcWarmDark && candWarm && c.chroma >= 6 && c.L < 60)
        ? Math.min(2.6, 0.95 + Math.max(0, srcChroma - 5.5) * 0.08)
        : 0;
    // ★ 低彩度绿色调偏移penalty：仅针对绿色/青色方向带色调灰
    const candHueDeg = (Math.atan2(c.b_lab, c.a) * 180 / Math.PI + 360) % 360;
    const neutralTintPenalty =
      (srcLowSat && srcChroma < 5 && c.chroma > 3 && c.L > 50 && candHueDeg > 90 && candHueDeg < 200)
        ? c.chroma * 0.8
        : 0;
    const score = de00 + chromaPenalty + huePenalty + neutralDarkPenalty + warmToNeutralPenalty + darkWarmSpecklePenalty + darkLiftPenalty + darkTintPenalty + warmDarkToNeutralPenalty + neutralTintPenalty - warmDarkAffinityBonus;
    if (score < bestScore) {
      bestScore = score;
      bestIdx = cand.idx;
    }
  }
  return bestIdx;
}
function findNearestColor(r, g, b, allowedIndices) {
  const rr = Math.max(0, Math.min(255, Number.isFinite(r) ? Math.round(r) : 0));
  const gg = Math.max(0, Math.min(255, Number.isFinite(g) ? Math.round(g) : 0));
  const bb = Math.max(0, Math.min(255, Number.isFinite(b) ? Math.round(b) : 0));
  if (!allowedIndices) {
    const qKey = ((rr & 0xF8) << 7) | ((gg & 0xF8) << 2) | (bb >> 3);
    if (NEAREST_COLOR_CACHE.has(qKey)) return NEAREST_COLOR_CACHE.get(qKey);
    const [L, a, bVal] = rgbToLab(rr, gg, bb);
    // Phase 1.4: Try frequent subset first, use full palette as fallback
    const subsetIdx = nearestColorByLab(L, a, bVal, FREQUENT_MARD_SUBSET);
    const subsetPal = MARD_PALETTE[subsetIdx];
    const subsetDist = deltaE2000FromLab(L, a, bVal, subsetPal.L, subsetPal.a, subsetPal.b_lab);
    let idx;
    if (subsetDist < 6.0) {
      // Excellent match in frequent subset — use it directly
      idx = subsetIdx;
    } else {
      // Fallback to full 221 palette, but add small preference for frequent colors
      const fullIdx = nearestColorByLab(L, a, bVal, ALL_INDICES);
      const fullPal = MARD_PALETTE[fullIdx];
      const fullDist = deltaE2000FromLab(L, a, bVal, fullPal.L, fullPal.a, fullPal.b_lab);
      // If full palette is only marginally better (< 2 deltaE), prefer subset
      if (subsetDist < fullDist + 2.0) {
        idx = subsetIdx;
      } else {
        idx = fullIdx;
      }
    }
    if (NEAREST_COLOR_CACHE.size > NEAREST_COLOR_CACHE_LIMIT) {
      const first = NEAREST_COLOR_CACHE.keys().next().value;
      NEAREST_COLOR_CACHE.delete(first);
    }
    NEAREST_COLOR_CACHE.set(qKey, idx);
    return idx;
  }
  const [L, a, bVal] = rgbToLab(rr, gg, bb);
  return nearestColorByLab(L, a, bVal, allowedIndices);
}
function pickLockedDarkColor(rawRgb, options) {
  if (!rawRgb) return -1;
  const opts = options || {};
  const [L, a, bVal] = rgbToLab(rawRgb[0], rawRgb[1], rawRgb[2]);
  const chroma = Math.hypot(a, bVal);
  const lum = 0.299 * rawRgb[0] + 0.587 * rawRgb[1] + 0.114 * rawRgb[2];
  const maxCh = Math.max(rawRgb[0], rawRgb[1], rawRgb[2]);
  const minCh = Math.min(rawRgb[0], rawRgb[1], rawRgb[2]);
  const rgbSpread = maxCh - minCh;
  const neutralLike = isNeutralDarkRaw(rawRgb) || (lum < 52 && chroma < 6.5 && rgbSpread < 12);

  if (neutralLike) {
    const preferStrict = !!opts.strictNeutral || lum < 38 || L < 22;
    const allowed = preferStrict && DARK_NEUTRAL_STRICT_INDICES.length > 0
      ? DARK_NEUTRAL_STRICT_INDICES
      : (DARK_NEUTRAL_INDICES.length > 0 ? DARK_NEUTRAL_INDICES : ALL_INDICES);
    return findNearestColor(rawRgb[0], rawRgb[1], rawRgb[2], allowed);
  }

  if (opts.allowChromatic === false) return -1;
  const chromaticMaxLum = Number.isFinite(opts.chromaticMaxLum) ? opts.chromaticMaxLum : 72;
  const chromaticMaxL = Number.isFinite(opts.chromaticMaxL) ? opts.chromaticMaxL : 44;
  if (lum > chromaticMaxLum && L > chromaticMaxL) return -1;
  const allowed = isWarmDarkRaw(rawRgb)
    ? (DARK_WARM_INDICES.length > 0 ? DARK_WARM_INDICES : (DARK_CHROMATIC_INDICES.length > 0 ? DARK_CHROMATIC_INDICES : ALL_INDICES))
    : (DARK_CHROMATIC_INDICES.length > 0 ? DARK_CHROMATIC_INDICES : ALL_INDICES);
  return findNearestColor(rawRgb[0], rawRgb[1], rawRgb[2], allowed);
}

function repairChromaticStrokeLocks(gridData, rawGrid, rows, cols, pixelLock) {
  if (!gridData || !rawGrid || !pixelLock) return gridData;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pixelLock[r][c] !== 1) continue;
      const idx = gridData[r][c];
      const src = rawGrid[r][c];
      if (idx < 0 || !src) continue;
      const cur = MARD_PALETTE[idx];
      if (!cur) continue;
      const [L, a, bVal] = rgbToLab(src[0], src[1], src[2]);
      const chroma = Math.hypot(a, bVal);
      const maxCh = Math.max(src[0], src[1], src[2]);
      const minCh = Math.min(src[0], src[1], src[2]);
      const rgbSpread = maxCh - minCh;
      const lum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
      const rawNeutralLike = isNeutralDarkRaw(src) || (lum < 52 && chroma < 6.5 && rgbSpread < 12);
      if (rawNeutralLike || cur.chroma >= 8) continue;

      const chromaticIdx = pickLockedDarkColor(src, {
        allowChromatic: true,
        chromaticMaxLum: 76,
        chromaticMaxL: 44
      });
      if (chromaticIdx >= 0 && MARD_PALETTE[chromaticIdx] && MARD_PALETTE[chromaticIdx].chroma >= 6) {
        gridData[r][c] = chromaticIdx;
        continue;
      }

      if (lum > 90 && L > 40) {
        pixelLock[r][c] = 0;
      }
    }
  }
  return gridData;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('未选择图片文件'));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        if (!img.width || !img.height) {
          reject(new Error('图片尺寸无效'));
          return;
        }
        resolve(img);
      };
      img.onerror = () => reject(new Error('图片解码失败，请换一张图片'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}
function loadImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}
function getPixelData(img) {
  if (!img || !img.width || !img.height) throw new Error('图片对象无效');
  const canvas = document.createElement('canvas');
  canvas.width = img.width; canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建画布上下文');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height);
  return data;
}
function getPixelDataComposited(imgData) {
  if (!imgData || !imgData.data || !imgData.width || !imgData.height) {
    throw new Error('像素数据无效');
  }
  const data = new Uint8ClampedArray(imgData.data);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i+3] < 255) {
      const a = data[i+3] / 255;
      data[i]   = Math.round(data[i]*a + 255*(1-a));
      data[i+1] = Math.round(data[i+1]*a + 255*(1-a));
      data[i+2] = Math.round(data[i+2]*a + 255*(1-a));
      data[i+3] = 255;
    }
  }
  return { data, width: imgData.width, height: imgData.height };
}
function sampleMean(data, sx, sy, bw, bh, imgW) {
  let sr=0,sg=0,sb=0,cnt=0;
  for (let y=sy; y<sy+bh; y++) for (let x=sx; x<sx+bw; x++) {
    const i = (y*imgW+x)*4;
    sr+=data[i]; sg+=data[i+1]; sb+=data[i+2]; cnt++;
  }
  return [sr/cnt, sg/cnt, sb/cnt];
}
function sampleMedian(data, sx, sy, bw, bh, imgW) {
  const QBITS = 5; // quantize to 32 levels per channel (256/8=32), giving 32^3=32768 possible buckets
  const QSHIFT = 8 - QBITS;
  const buckets = new Map();
  for (let y = sy; y < sy + bh; y++) {
    for (let x = sx; x < sx + bw; x++) {
      const i = (y * imgW + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      const key = ((r >> QSHIFT) << (QBITS * 2)) | ((g >> QSHIFT) << QBITS) | (b >> QSHIFT);
      if (!buckets.has(key)) buckets.set(key, { sr: 0, sg: 0, sb: 0, count: 0 });
      const bk = buckets.get(key);
      bk.sr += r; bk.sg += g; bk.sb += b; bk.count++;
    }
  }
  let best = null, bestCnt = 0;
  for (const bk of buckets.values()) {
    if (bk.count > bestCnt) { bestCnt = bk.count; best = bk; }
  }
  return [Math.round(best.sr / bestCnt), Math.round(best.sg / bestCnt), Math.round(best.sb / bestCnt)];
}
function sampleGaussian(data, sx, sy, bw, bh, imgW) {
  const cx=bw/2, cy=bh/2, sigma=Math.max(bw,bh)/3;
  let sr=0,sg=0,sb=0,tw=0;
  for (let y=0; y<bh; y++) for (let x=0; x<bw; x++) {
    const w = Math.exp(-((x-cx)**2+(y-cy)**2)/(2*sigma*sigma));
    const i = ((sy+y)*imgW+(sx+x))*4;
    sr+=data[i]*w; sg+=data[i+1]*w; sb+=data[i+2]*w; tw+=w;
  }
  return [sr/tw, sg/tw, sb/tw];
}
function sampleCenter(data, sx, sy, bw, bh, imgW) {
  const cx = Math.floor(sx + bw/2);
  const cy = Math.floor(sy + bh/2);
  const i = (cy * imgW + cx) * 4;
  return [data[i], data[i+1], data[i+2]];
}
function sampleDetail(data, sx, sy, bw, bh, imgW) {
  const cx = Math.floor(sx + bw/2);
  const cy = Math.floor(sy + bh/2);
  let sr=0, sg=0, sb=0, cnt=0;
  const startY = Math.max(sy, cy-1), endY = Math.min(sy+bh, cy+2);
  const startX = Math.max(sx, cx-1), endX = Math.min(sx+bw, cx+2);
  for(let y=startY; y<endY; y++) {
    for(let x=startX; x<endX; x++) {
      const i = (y*imgW + x) * 4;
      sr += data[i]; sg += data[i+1]; sb += data[i+2];
      cnt++;
    }
  }
  return [sr/cnt, sg/cnt, sb/cnt];
}
function sampleAnime(data, sx, sy, bw, bh, imgW) {
  const total = bw * bh;
  if (total <= 1) return sampleCenter(data, sx, sy, bw, bh, imgW);
  let sr=0, sg=0, sb=0; // sum for mean
  let cr=0, cg=0, cb=0, cCnt=0; // colorful pixel accumulator
  const SAT_THRESHOLD = 60; // min saturation (max-min in RGB) to be considered "colorful"
  for (let y=sy; y<sy+bh; y++) {
    for (let x=sx; x<sx+bw; x++) {
      const i = (y*imgW + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      sr += r; sg += g; sb += b;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      if (sat >= SAT_THRESHOLD) {
        cr += r; cg += g; cb += b; cCnt++;
      }
    }
  }
  const meanR = sr/total, meanG = sg/total, meanB = sb/total;
  if (cCnt > 0 && cCnt < total * 0.4) {
    const avgCR = cr/cCnt, avgCG = cg/cCnt, avgCB = cb/cCnt;
    const diffR = avgCR - meanR, diffG = avgCG - meanG, diffB = avgCB - meanB;
    const colorDist = Math.sqrt(diffR*diffR + diffG*diffG + diffB*diffB);
    if (colorDist > 60 && cCnt >= total * 0.05) {
      return [avgCR, avgCG, avgCB];
    }
  }
  return [meanR, meanG, meanB];
}
const SAMPLERS = { 
  mean: sampleMean, 
  median: sampleMedian, 
  gaussian: sampleGaussian,
  center: sampleCenter,
  detail: sampleDetail,
  anime: sampleAnime
};
function applyDithering(rawGrid, rows, cols, allowedIndices, strength) {
  if (!rawGrid || !rows || !cols) return [];
  const sRaw = Math.max(0, Math.min(100, Number(strength) || 0)) / 100;
  const s = Math.pow(sRaw, 1.85) * 0.42;
  if (s <= 0.001) return firstPassMatchRgb(rawGrid, rows, cols);
  const palette = (Array.isArray(allowedIndices) && allowedIndices.length > 0)
    ? allowedIndices
    : ALL_INDICES;
  if (!palette || palette.length === 0) return firstPassMatchRgb(rawGrid, rows, cols);
  const work = rawGrid.map(row => row.map(cell => (cell ? [cell[0], cell[1], cell[2]] : null)));
  const out = Array.from({ length: rows }, () => Array(cols).fill(-1));
  function diffuse(nr, nc, er, eg, eb, weight) {
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;
    const cell = work[nr][nc];
    if (!cell) return;
    cell[0] += er * weight;
    cell[1] += eg * weight;
    cell[2] += eb * weight;
  }
  function localContrastAt(r, c) {
    const src = work[r][c];
    if (!src) return 0;
    let sum = 0, cnt = 0;
    const nbs = [[0,1],[0,-1],[1,0],[-1,0]];
    for (const [dr, dc] of nbs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const n = work[nr][nc];
      if (!n) continue;
      sum += Math.abs(src[0] - n[0]) + Math.abs(src[1] - n[1]) + Math.abs(src[2] - n[2]);
      cnt++;
    }
    return cnt > 0 ? sum / cnt : 0;
  }
  for (let r = 0; r < rows; r++) {
    const leftToRight = (r % 2 === 0);
    const cStart = leftToRight ? 0 : cols - 1;
    const cEnd = leftToRight ? cols : -1;
    const cStep = leftToRight ? 1 : -1;
    for (let c = cStart; c !== cEnd; c += cStep) {
      const src = work[r][c];
      if (!src) {
        out[r][c] = -1;
        continue;
      }
      const rr = Math.max(0, Math.min(255, Math.round(src[0])));
      const gg = Math.max(0, Math.min(255, Math.round(src[1])));
      const bb = Math.max(0, Math.min(255, Math.round(src[2])));
      const idx = findNearestColor(rr, gg, bb, palette);
      out[r][c] = idx;
      const contrast = localContrastAt(r, c);
      const flatThreshold = 18 + (1 - sRaw) * 10;
      if (contrast < flatThreshold) continue; // Flat zones: skip error diffusion to suppress noise.
      const q = MARD_PALETTE[idx];
      const er = Math.max(-36, Math.min(36, rr - q.r)) * s;
      const eg = Math.max(-36, Math.min(36, gg - q.g)) * s;
      const eb = Math.max(-36, Math.min(36, bb - q.b)) * s;
      if (leftToRight) {
        diffuse(r, c + 1, er, eg, eb, 7 / 16);
        diffuse(r + 1, c - 1, er, eg, eb, 3 / 16);
        diffuse(r + 1, c, er, eg, eb, 5 / 16);
        diffuse(r + 1, c + 1, er, eg, eb, 1 / 16);
      } else {
        diffuse(r, c - 1, er, eg, eb, 7 / 16);
        diffuse(r + 1, c + 1, er, eg, eb, 3 / 16);
        diffuse(r + 1, c, er, eg, eb, 5 / 16);
        diffuse(r + 1, c - 1, er, eg, eb, 1 / 16);
      }
    }
  }
  return out;
}
function deSpeckleGrid(gridData, rawGrid, rows, cols, strength) {
  if (!gridData || !rawGrid || rows < 3 || cols < 3) return gridData;
  const t = Math.max(0, Math.min(100, Number(strength) || 0)) / 100;
  if (t <= 0) return gridData;
  let out = gridData.map(row => [...row]);
  const passes = t > 0.55 ? 2 : 1;
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const dirs4 = [[0,1],[0,-1],[1,0],[-1,0]];
  for (let pass = 0; pass < passes; pass++) {
    const next = out.map(row => [...row]);
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const curIdx = out[r][c];
        const src = rawGrid[r][c];
        if (curIdx < 0 || !src) continue;
        const freq = new Map();
        let valid = 0;
        for (const [dr, dc] of dirs8) {
          const nr = r + dr, nc = c + dc;
          const idx = out[nr][nc];
          if (idx < 0) continue;
          valid++;
          freq.set(idx, (freq.get(idx) || 0) + 1);
        }
        if (valid < 5) continue;
        let domIdx = curIdx, domCnt = 0;
        for (const [idx, cnt] of freq) {
          if (cnt > domCnt) { domCnt = cnt; domIdx = idx; }
        }
        if (domIdx === curIdx || domCnt < 4) continue;
        const diffRatio = (valid - (freq.get(curIdx) || 0)) / valid;
        const ratioThresh = 0.78 - t * 0.22;
        if (diffRatio < ratioThresh) continue;
        let contrast = 0, cc = 0;
        for (const [dr, dc] of dirs4) {
          const nr = r + dr, nc = c + dc;
          const nRaw = rawGrid[nr][nc];
          if (!nRaw) continue;
          contrast += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
          cc++;
        }
        const avgContrast = cc > 0 ? contrast / cc : 999;
        const edgeThresh = 72 - t * 24;
        if (avgContrast > edgeThresh) continue;
        const curPal = MARD_PALETTE[curIdx];
        const domPal = MARD_PALETTE[domIdx];
        const curDist = Math.abs(src[0] - curPal.r) + Math.abs(src[1] - curPal.g) + Math.abs(src[2] - curPal.b);
        const domDist = Math.abs(src[0] - domPal.r) + Math.abs(src[1] - domPal.g) + Math.abs(src[2] - domPal.b);
        if (domDist <= curDist * 1.18 + 6) {
          next[r][c] = domIdx;
        }
      }
    }
    out = next;
  }
  return out;
}
function reinforceDarkLines(gridData, rawGrid, rows, cols, level) {
  if (!gridData || !rawGrid || rows < 3 || cols < 3) return gridData;
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (t <= 0) return gridData;
  const darkCandidates = ['H7', 'H6', 'H5']
    .map(id => PALETTE_ID_TO_INDEX.get(id))
    .filter(idx => Number.isInteger(idx));
  if (darkCandidates.length === 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs4 = [[0,1],[0,-1],[1,0],[-1,0]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      const srcLum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
      if (srcLum > (138 - t * 34)) continue;
      let lumSum = 0, contrast = 0, darkNb = 0, cnt = 0;
      for (const [dr, dc] of dirs4) {
        const nr = r + dr, nc = c + dc;
        const nRaw = rawGrid[nr][nc];
        if (!nRaw) continue;
        const nLum = 0.299 * nRaw[0] + 0.587 * nRaw[1] + 0.114 * nRaw[2];
        lumSum += nLum;
        contrast += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        cnt++;
        const nIdx = out[nr][nc];
        if (nIdx >= 0 && MARD_PALETTE[nIdx].L < 34) darkNb++;
      }
      if (cnt < 3) continue;
      const neighborLum = lumSum / cnt;
      const avgContrast = contrast / cnt;
      const rawInkLike = srcLum < (neighborLum - (8 - t * 3)) && avgContrast > (52 - t * 8);
      const mappedInkLike = darkNb >= 2 && avgContrast > (44 - t * 6);
      if (!rawInkLike && !mappedInkLike) continue;
      const curPal = MARD_PALETTE[curIdx];
      if (curPal.L < (34 + t * 6)) continue; // already dark enough
      const bestDark = findNearestColor(src[0], src[1], src[2], darkCandidates);
      if (bestDark >= 0) out[r][c] = bestDark;
    }
  }
  return out;
}
function suppressWarmSpeckles(gridData, rawGrid, rows, cols, level) {
  if (!gridData || !rawGrid || rows < 3 || cols < 3) return gridData;
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const darkFallback = ['H7', 'H6', 'H5', 'M12', 'G8']
    .map(id => PALETTE_ID_TO_INDEX.get(id))
    .filter(idx => Number.isInteger(idx));
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const idx = out[r][c];
      const src = rawGrid[r][c];
      if (idx < 0 || !src) continue;
      const cur = MARD_PALETTE[idx];
      const srcLum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
      if (srcLum > (112 - t * 18)) continue; // Only dark regions.
      if (cur.chroma < (12 + t * 4)) continue; // Not a colorful outlier.
      const isWarmHue = (cur.hue <= 42 || cur.hue >= 330);
      if (!isWarmHue) continue;
      let darkNeutralNb = 0;
      let warmNb = 0;
      let neighborSet = new Set();
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        if (nIdx < 0) continue;
        neighborSet.add(nIdx);
        const n = MARD_PALETTE[nIdx];
        if (n.L < 46 && n.chroma < 14) darkNeutralNb++;
        if ((n.hue <= 46 || n.hue >= 334) && n.chroma > 14) warmNb++;
      }
      if (darkNeutralNb < 5) continue;
      if (warmNb > 1) continue; // keep coherent warm regions (e.g. brown hair), only kill isolated speckles.
      const candidate = [...neighborSet].filter(i => {
        const p = MARD_PALETTE[i];
        return p.L < 56 && p.chroma < 18;
      });
      const allowed = candidate.length > 0 ? candidate : darkFallback;
      if (!allowed || allowed.length === 0) continue;
      const rep = findNearestColor(src[0], src[1], src[2], allowed);
      if (rep >= 0) out[r][c] = rep;
    }
  }
  return out;
}
function firstPassMatchRgb(rawGrid, rows, cols) {
  const gridData = [];
  for (let r = 0; r < rows; r++) {
    gridData[r] = [];
    for (let c = 0; c < cols; c++) {
      if (rawGrid[r][c] === null) { gridData[r][c] = -1; continue; }
      const [R, G, B] = rawGrid[r][c];
      gridData[r][c] = findNearestColor(R, G, B, null);
    }
  }
  return gridData;
}
function buildRawGridSimpleMean(imageData, pixN, baseCenterBias, minorityColorProtect) {
  const w = imageData.width, h = imageData.height;
  const exactRows = Number.isInteger(arguments[4]) && arguments[4] > 0 ? arguments[4] : null;
  const exactCols = Number.isInteger(arguments[5]) && arguments[5] > 0 ? arguments[5] : null;
  const data = getPixelDataComposited(imageData).data;
  const centerBiasBase = Math.max(0, Math.min(0.85, Number(baseCenterBias) || 0.3));
  const minorityProtect = Math.max(0, Math.min(1, Number(minorityColorProtect) || 0));
  if (exactRows && exactCols) {
    const grid = [];
    for (let r = 0; r < exactRows; r++) {
      grid[r] = [];
      const sy = Math.floor(r * h / exactRows);
      const ey = Math.max(sy + 1, Math.floor((r + 1) * h / exactRows));
      for (let c = 0; c < exactCols; c++) {
        const sx = Math.floor(c * w / exactCols);
        const ex = Math.max(sx + 1, Math.floor((c + 1) * w / exactCols));
        let sr = 0, sg = 0, sb = 0, cnt = 0;
        let lumMin = 255, lumMax = 0;
        for (let y = sy; y < ey; y++) {
          for (let x = sx; x < ex; x++) {
            const i = (y * w + x) * 4;
            const pr = data[i], pg = data[i + 1], pb = data[i + 2];
            sr += pr; sg += pg; sb += pb;
            const lum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
            if (lum < lumMin) lumMin = lum;
            if (lum > lumMax) lumMax = lum;
            cnt++;
          }
        }
        const meanR = sr / cnt, meanG = sg / cnt, meanB = sb / cnt;
        const insetX = Math.max(0, Math.floor((ex - sx) / 4));
        const insetY = Math.max(0, Math.floor((ey - sy) / 4));
        const cx0 = sx + insetX, cy0 = sy + insetY;
        const cx1 = Math.max(cx0 + 1, ex - insetX), cy1 = Math.max(cy0 + 1, ey - insetY);
        let csr = 0, csg = 0, csb = 0, ccnt = 0;
        for (let y = cy0; y < cy1; y++) {
          for (let x = cx0; x < cx1; x++) {
            const i = (y * w + x) * 4;
            csr += data[i]; csg += data[i + 1]; csb += data[i + 2]; ccnt++;
          }
        }
        const centerR = ccnt > 0 ? (csr / ccnt) : meanR;
        const centerG = ccnt > 0 ? (csg / ccnt) : meanG;
        const centerB = ccnt > 0 ? (csb / ccnt) : meanB;
        const blockContrast = lumMax - lumMin;
        const dynamicBoost = blockContrast > 70 ? 0.20 : (blockContrast > 42 ? 0.10 : 0);
        const centerW = Math.max(0, Math.min(0.9, centerBiasBase + dynamicBoost));
        let outR = meanR * (1 - centerW) + centerR * centerW;
        let outG = meanG * (1 - centerW) + centerG * centerW;
        let outB = meanB * (1 - centerW) + centerB * centerW;
        if (minorityProtect > 0.001) {
          const animeRgb = sampleAnime(data, sx, sy, Math.max(1, ex - sx), Math.max(1, ey - sy), w);
          const animeSat = Math.max(animeRgb[0], animeRgb[1], animeRgb[2]) - Math.min(animeRgb[0], animeRgb[1], animeRgb[2]);
          const baseSat = Math.max(outR, outG, outB) - Math.min(outR, outG, outB);
          const animeDist = Math.hypot(animeRgb[0] - outR, animeRgb[1] - outG, animeRgb[2] - outB);
          if (animeDist > 18 && animeSat > baseSat + 8) {
            const minorityBlend = Math.min(0.78, minorityProtect * (0.22 + Math.min(1, (animeDist - 18) / 54) * 0.5));
            outR = outR * (1 - minorityBlend) + animeRgb[0] * minorityBlend;
            outG = outG * (1 - minorityBlend) + animeRgb[1] * minorityBlend;
            outB = outB * (1 - minorityBlend) + animeRgb[2] * minorityBlend;
          }
        }
        grid[r][c] = [Math.round(outR), Math.round(outG), Math.round(outB)];
      }
    }
    return { grid, rows: exactRows, cols: exactCols };
  }
  const shortSide = Math.min(w, h);
  const blockSz = Math.floor(shortSide / pixN);
  if (blockSz < 1) throw new Error('图片尺寸过小');
  const cols = Math.floor(w / blockSz);
  const rows = Math.floor(h / blockSz);
  const ox = Math.floor((w - cols * blockSz) / 2);
  const oy = Math.floor((h - rows * blockSz) / 2);
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const sx = ox + c * blockSz, sy = oy + r * blockSz;
      let sr = 0, sg = 0, sb = 0, cnt = 0;
      let lumMin = 255, lumMax = 0;
      for (let y = sy; y < sy + blockSz; y++) {
        for (let x = sx; x < sx + blockSz; x++) {
          const i = (y * w + x) * 4;
          const pr = data[i], pg = data[i + 1], pb = data[i + 2];
          sr += pr;
          sg += pg;
          sb += pb;
          const lum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
          if (lum < lumMin) lumMin = lum;
          if (lum > lumMax) lumMax = lum;
          cnt++;
        }
      }
      const meanR = sr / cnt, meanG = sg / cnt, meanB = sb / cnt;
      const cInset = Math.max(0, Math.floor(blockSz / 4));
      const cx0 = sx + cInset, cy0 = sy + cInset;
      const cx1 = sx + blockSz - cInset, cy1 = sy + blockSz - cInset;
      let csr = 0, csg = 0, csb = 0, ccnt = 0;
      for (let y = cy0; y < cy1; y++) {
        for (let x = cx0; x < cx1; x++) {
          const i = (y * w + x) * 4;
          csr += data[i];
          csg += data[i + 1];
          csb += data[i + 2];
          ccnt++;
        }
      }
      const centerR = ccnt > 0 ? (csr / ccnt) : meanR;
      const centerG = ccnt > 0 ? (csg / ccnt) : meanG;
      const centerB = ccnt > 0 ? (csb / ccnt) : meanB;
      const blockContrast = lumMax - lumMin;
      const dynamicBoost = blockContrast > 70 ? 0.20 : (blockContrast > 42 ? 0.10 : 0);
      const centerW = Math.max(0, Math.min(0.9, centerBiasBase + dynamicBoost));
      let outR = meanR * (1 - centerW) + centerR * centerW;
      let outG = meanG * (1 - centerW) + centerG * centerW;
      let outB = meanB * (1 - centerW) + centerB * centerW;
      if (minorityProtect > 0.001) {
        const animeRgb = sampleAnime(data, sx, sy, blockSz, blockSz, w);
        const animeSat = Math.max(animeRgb[0], animeRgb[1], animeRgb[2]) - Math.min(animeRgb[0], animeRgb[1], animeRgb[2]);
        const baseSat = Math.max(outR, outG, outB) - Math.min(outR, outG, outB);
        const animeDist = Math.hypot(animeRgb[0] - outR, animeRgb[1] - outG, animeRgb[2] - outB);
        if (animeDist > 18 && animeSat > baseSat + 8) {
          const minorityBlend = Math.min(0.78, minorityProtect * (0.22 + Math.min(1, (animeDist - 18) / 54) * 0.5));
          outR = outR * (1 - minorityBlend) + animeRgb[0] * minorityBlend;
          outG = outG * (1 - minorityBlend) + animeRgb[1] * minorityBlend;
          outB = outB * (1 - minorityBlend) + animeRgb[2] * minorityBlend;
        }
      }
      grid[r][c] = [Math.round(outR), Math.round(outG), Math.round(outB)];
    }
  }
  return { grid, rows, cols };
}

function resolveTargetGridByAspect(width, height, targetShortSide, targetRows, targetCols) {
  const shortSide = Number.isInteger(targetShortSide) && targetShortSide > 0 ? targetShortSide : null;
  if (shortSide && width > 0 && height > 0) {
    if (width >= height) {
      return { rows: shortSide, cols: Math.max(shortSide, Math.round(width / height * shortSide)) };
    }
    return { rows: Math.max(shortSide, Math.round(height / width * shortSide)), cols: shortSide };
  }
  if (Number.isInteger(targetRows) && Number.isInteger(targetCols) && targetRows > 0 && targetCols > 0) {
    return { rows: targetRows, cols: targetCols };
  }
  return { rows: null, cols: null };
}
function detectSemanticFeatureMask(baseGridData, rawGrid, rows, cols, strength, isSmallGrid, gridScale) {
  const t = Math.max(0, Math.min(1, Number(strength) || 0));
  const gs = typeof gridScale === 'number' ? gridScale : (isSmallGrid ? 0.15 : 0.8);
  const mask = Array.from({ length: rows }, () => new Uint8Array(cols));
  if (!baseGridData || !rawGrid || t <= 0 || rows < 3 || cols < 3) return mask;
  const totalCells = rows * cols;
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const borderPad = 2;
  // ★ maxComponentSize 按 gridScale 连续缩放：小图允许更大比例特征
  let maxComponentSize = Math.max(8, Math.round(totalCells * (0.03 + t * 0.05)));
  maxComponentSize = Math.round(maxComponentSize * (1 + (1 - gs) * 0.5));
  // Find dominant background color
  const globalFreq = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = baseGridData[r][c];
      if (idx >= 0) globalFreq.set(idx, (globalFreq.get(idx) || 0) + 1);
    }
  }
  let bgIdx = -1, bgCount = 0;
  for (const [idx, count] of globalFreq) {
    if (count > bgCount) { bgCount = count; bgIdx = idx; }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c]) continue;
      const idx = baseGridData[r][c];
      if (idx < 0) { visited[r][c] = 1; continue; }
      const cur = MARD_PALETTE[idx];
      visited[r][c] = 1;
      // Chroma gate: must be clearly chromatic (no special dark exception — dark features handled by strokes)
      // ★ gridScale 连续缩放：小图门槛低(4)，大图门槛高(8)
      // ★ 极小图 (gs<0.15) 进一步降低彩度门槛保护鼻子/嘴巴等小特征
      const chromaGate = gs < 0.15
        ? (2.5 + gs * 6) + (1 - t) * 3
        : (4 + gs * 4) + (1 - t) * 4;
      if (cur.chroma < chromaGate) continue;
      // Skip background color entirely
      if (idx === bgIdx) continue;
      const queue = [[r, c]];
      let head = 0;
      const component = [];
      let borderCells = 0;
      while (head < queue.length) {
        const [cr, cc] = queue[head++];
        component.push([cr, cc]);
        if (cr <= borderPad || cc <= borderPad || cr >= rows - 1 - borderPad || cc >= cols - 1 - borderPad) {
          borderCells++;
        }
        for (const [dr, dc] of dirs4) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) continue;
          if (baseGridData[nr][nc] !== idx) continue;
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
      if (component.length > maxComponentSize) continue;
      // ★ Allow single-pixel components ONLY if they have very high chroma and strong contrast
      // This protects tiny but visually critical features like cat noses, small accessories
      if (component.length === 1) {
        const [sr, sc] = component[0];
        const src1 = rawGrid[sr][sc];
        if (!src1) continue;
        const [l1, a1, b1] = rgbToLab(src1[0], src1[1], src1[2]);
        const ch1 = Math.hypot(a1, b1);
        if (ch1 < (
          gs < 0.15
            ? (8 + gs * 12) + (1 - t) * (4 + gs * 2)   // 极小图降低单像素彩度门槛
            : (15 + gs * 10) + (1 - t) * (7 + gs * 3)
        )) continue; // chromatic gate scaled by gridScale
        // Check contrast with all 8 neighbors
        let nbrContrast = 0, nbrCount = 0;
        for (const [dr, dc] of dirs8) {
          const nr = sr + dr, nc = sc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const nSrc = rawGrid[nr][nc];
          if (!nSrc) continue;
          nbrContrast += Math.abs(src1[0] - nSrc[0]) + Math.abs(src1[1] - nSrc[1]) + Math.abs(src1[2] - nSrc[2]);
          nbrCount++;
        }
        if (nbrCount < 3) continue;
        const avgNbrContrast = nbrContrast / nbrCount;
        const contrastGate = gs < 0.15
          ? (20 + gs * 30) + (1 - t) * (8 + gs * 6)   // 极小图降低对比度门槛
          : (35 + gs * 20) + (1 - t) * (12 + gs * 8);
        if (avgNbrContrast < contrastGate) continue; // contrast gate scaled by gridScale
        mask[sr][sc] = 1;
        continue;
      }
      // Skip border-hugging components
      if (borderCells > component.length * 0.5) continue;
      let rawChromaSum = 0;
      let boundaryContrast = 0;
      let boundaryEdges = 0;
      let neighborCount = 0;
      const outsideFreq = new Map();
      const componentSet = new Set(component.map(([rr, cc]) => rr * cols + cc));
      for (const [rr, cc] of component) {
        const src = rawGrid[rr][cc];
        if (src) {
          const [, a2, b2] = rgbToLab(src[0], src[1], src[2]);
          rawChromaSum += Math.hypot(a2, b2);
        }
        for (const [dr, dc] of dirs8) {
          const nr = rr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (componentSet.has(nr * cols + nc)) continue;
          const nIdx = baseGridData[nr][nc];
          if (nIdx < 0) continue;
          neighborCount++;
          outsideFreq.set(nIdx, (outsideFreq.get(nIdx) || 0) + 1);
          const src2 = rawGrid[rr][cc];
          const nSrc = rawGrid[nr][nc];
          if (src2 && nSrc) {
            boundaryContrast += Math.abs(src2[0] - nSrc[0]) + Math.abs(src2[1] - nSrc[1]) + Math.abs(src2[2] - nSrc[2]);
            boundaryEdges++;
          }
        }
      }
      if (neighborCount < 3) continue;
      let domIdx = -1, domCount = 0;
      for (const [nIdx, count] of outsideFreq) {
        if (count > domCount) { domIdx = nIdx; domCount = count; }
      }
      if (domIdx < 0) continue;
      const dom = MARD_PALETTE[domIdx];
      const avgRawChroma = rawChromaSum / Math.max(1, component.length);
      const avgBoundaryContrast = boundaryContrast / Math.max(1, boundaryEdges);
      const colorGap = deltaE2000FromLab(cur.L, cur.a, cur.b_lab, dom.L, dom.a, dom.b_lab);
      // ★ Strict thresholds: only protect strongly distinct, chromatic features
      // ★ gridScale 连续缩放：小图门槛低保护更多细节
      // ★ 极小图进一步降低阈值保护鼻子/嘴巴等
      const rawChromaGate = gs < 0.15
        ? (3 + gs * 5) + (1 - t) * (2 + gs * 1)
        : (6 + gs * 4) + (1 - t) * (3 + gs * 2);
      if (avgRawChroma < rawChromaGate) continue;
      // Require large color gap from surroundings
      const colorGapGate = gs < 0.15
        ? (6 + gs * 8) + (1 - t) * (2 + gs * 1)
        : (10 + gs * 5) + (1 - t) * (3 + gs * 2);
      if (colorGap < colorGapGate) continue;
      // Require visible boundary contrast
      const boundaryContrastGate = gs < 0.15
        ? (15 + gs * 20) + (1 - t) * (6 + gs * 4)
        : (25 + gs * 15) + (1 - t) * (10 + gs * 5);
      if (avgBoundaryContrast < boundaryContrastGate) continue;
      for (const [rr, cc] of component) {
        mask[rr][cc] = 1;
      }
    }
  }
  // ★ PASS 2: Dark stroke detection — protect dark pixels (L<25) with high brightness contrast to neighbors
  // This is separate from the chroma-based pass above because black strokes have near-zero chroma
  // Key distinction from old "dark special channel" (which caused noise protection): we require
  // the dark pixel to have HIGH CONTRAST with neighbors (stroke behavior) rather than just being dark
  const visited2 = Array.from({ length: rows }, () => new Uint8Array(cols));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mask[r][c]) { visited2[r][c] = 1; continue; } // already protected
      if (visited2[r][c]) continue;
      const idx = baseGridData[r][c];
      if (idx < 0) { visited2[r][c] = 1; continue; }
      const cur = MARD_PALETTE[idx];
      // Only consider dark cells (L < 25 — true black/near-black outlines)
      if (cur.L >= 25) { visited2[r][c] = 1; continue; }
      // Skip background
      if (idx === bgIdx) { visited2[r][c] = 1; continue; }
      // BFS to find dark connected component (same palette color)
      visited2[r][c] = 1;
      const queue2 = [[r, c]];
      const darkComp = [];
      while (queue2.length > 0) {
        const [cr, cc] = queue2.shift();
        darkComp.push([cr, cc]);
        for (const [dr, dc] of dirs4) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited2[nr][nc]) continue;
          if (baseGridData[nr][nc] !== idx) continue;
          visited2[nr][nc] = 1;
          queue2.push([nr, nc]);
        }
      }
      // Size filter: protect 1-pixel dark strokes too, but cap at reasonable size
      // (strokes are thin — max ~15% of grid is generous)
      if (darkComp.length > Math.max(12, totalCells * 0.15)) continue;
      // ★ Key criterion: high brightness contrast with surrounding non-dark neighbors
      // This distinguishes true strokes from dark noise/artifacts
      let brightNeighborCount = 0, totalNeighborCount = 0;
      let lumContrastSum = 0;
      const darkSet = new Set(darkComp.map(([rr, cc]) => `${rr},${cc}`));
      for (const [rr, cc] of darkComp) {
        for (const [dr, dc] of dirs8) {
          const nr = rr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (darkSet.has(`${nr},${nc}`)) continue;
          const nIdx = baseGridData[nr][nc];
          if (nIdx < 0) continue;
          totalNeighborCount++;
          const nPal = MARD_PALETTE[nIdx];
          const lumDiff = nPal.L - cur.L;
          lumContrastSum += lumDiff;
          if (lumDiff > 25) brightNeighborCount++; // neighbor significantly brighter
        }
      }
      if (totalNeighborCount < 2) continue;
      const avgLumContrast = lumContrastSum / totalNeighborCount;
      const brightRatio = brightNeighborCount / totalNeighborCount;
      // ★ Must have meaningful contrast: avg L difference > 30 OR >40% of neighbors are much brighter
      // This prevents dark noise in dark areas from being protected
      if (avgLumContrast < (30 - t * 8) && brightRatio < (0.4 - t * 0.1)) continue;
      // Mark as protected
      for (const [rr, cc] of darkComp) {
        mask[rr][cc] = 1;
      }
    }
  }
  return mask;
}
function restoreProtectedFeatureCells(gridData, sourceGridData, featureMask) {
  if (!gridData || !sourceGridData || !featureMask) return gridData;
  for (let r = 0; r < gridData.length; r++) {
    for (let c = 0; c < gridData[r].length; c++) {
      if (featureMask[r][c] && sourceGridData[r][c] >= 0) {
        gridData[r][c] = sourceGridData[r][c];
      }
    }
  }
  return gridData;
}
function medianCutQuantizeRawGrid(rawGrid, rows, cols, maxColors) {
  const freq = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = rawGrid[r][c];
      if (!cell) continue;
      const key = (cell[0] << 16) | (cell[1] << 8) | cell[2];
      const prev = freq.get(key);
      if (prev) {
        prev.count++;
      } else {
        freq.set(key, { r: cell[0], g: cell[1], b: cell[2], count: 1 });
      }
    }
  }
  const colors = Array.from(freq.values());
  if (colors.length === 0 || colors.length <= maxColors) return rawGrid.map(row => row.map(cell => cell ? [...cell] : null));
  function makeBox(list) {
    let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0, total = 0;
    for (const c of list) {
      if (c.r < rMin) rMin = c.r; if (c.r > rMax) rMax = c.r;
      if (c.g < gMin) gMin = c.g; if (c.g > gMax) gMax = c.g;
      if (c.b < bMin) bMin = c.b; if (c.b > bMax) bMax = c.b;
      total += c.count;
    }
    return { list, rMin, rMax, gMin, gMax, bMin, bMax, total };
  }
  function splitBox(box) {
    if (box.list.length < 2) return null;
    const rRange = box.rMax - box.rMin;
    const gRange = box.gMax - box.gMin;
    const bRange = box.bMax - box.bMin;
    let ch = 'r';
    if (gRange >= rRange && gRange >= bRange) ch = 'g';
    else if (bRange >= rRange && bRange >= gRange) ch = 'b';
    const sorted = [...box.list].sort((a, b) => a[ch] - b[ch]);
    const half = box.total * 0.5;
    let acc = 0, splitAt = 0;
    for (let i = 0; i < sorted.length; i++) {
      acc += sorted[i].count;
      if (acc >= half) { splitAt = i; break; }
    }
    if (splitAt <= 0 || splitAt >= sorted.length - 1) splitAt = Math.floor(sorted.length / 2);
    return [makeBox(sorted.slice(0, splitAt + 1)), makeBox(sorted.slice(splitAt + 1))];
  }
  let boxes = [makeBox(colors)];
  while (boxes.length < maxColors) {
    let pick = -1;
    let bestScore = -1;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.list.length < 2) continue;
      const range = Math.max(b.rMax - b.rMin, b.gMax - b.gMin, b.bMax - b.bMin);
      const score = range * Math.sqrt(b.total);
      if (score > bestScore) { bestScore = score; pick = i; }
    }
    if (pick < 0) break;
    const pair = splitBox(boxes[pick]);
    if (!pair) break;
    boxes.splice(pick, 1, pair[0], pair[1]);
  }
  const palette = boxes.map(b => {
    let sr = 0, sg = 0, sb = 0, total = 0;
    for (const c of b.list) {
      sr += c.r * c.count;
      sg += c.g * c.count;
      sb += c.b * c.count;
      total += c.count;
    }
    return [Math.round(sr / Math.max(1, total)), Math.round(sg / Math.max(1, total)), Math.round(sb / Math.max(1, total))];
  });
  const remap = new Map();
  function nearestPalette(rgb) {
    const key = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
    if (remap.has(key)) return remap.get(key);
    let best = palette[0], bestD = Infinity;
    for (const p of palette) {
      const d = (rgb[0] - p[0]) ** 2 + (rgb[1] - p[1]) ** 2 + (rgb[2] - p[2]) ** 2;
      if (d < bestD) { bestD = d; best = p; }
    }
    remap.set(key, best);
    return best;
  }
  const out = [];
  for (let r = 0; r < rows; r++) {
    out[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = rawGrid[r][c];
      out[r][c] = cell ? [...nearestPalette(cell)] : null;
    }
  }
  return out;
}
// ========== V2 Pipeline: Edge Detection ==========
function computeSimpleEdgeMap(rawGrid, rows, cols) {
  const edge = [];
  for (let r = 0; r < rows; r++) {
    edge[r] = new Uint8Array(cols);
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      const L0 = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      let maxLumDiff = 0;
      let maxColorDiff = 0;
      // ★ 4-direction comparison (right, down, left, up) for better edge detection
      // ★ NEW: also track RGB color difference to catch hue-edges where luminance is similar
      const neighbors = [];
      if (c + 1 < cols) neighbors.push(rawGrid[r][c + 1]);
      if (r + 1 < rows) neighbors.push(rawGrid[r + 1][c]);
      if (c > 0) neighbors.push(rawGrid[r][c - 1]);
      if (r > 0) neighbors.push(rawGrid[r - 1][c]);
      for (const n of neighbors) {
        const nL = 0.299 * n[0] + 0.587 * n[1] + 0.114 * n[2];
        maxLumDiff = Math.max(maxLumDiff, Math.abs(L0 - nL));
        // Perceptual color distance: weighted RGB difference (fast approximation)
        const cd = Math.abs(rgb[0] - n[0]) * 0.3 + Math.abs(rgb[1] - n[1]) * 0.59 + Math.abs(rgb[2] - n[2]) * 0.11;
        maxColorDiff = Math.max(maxColorDiff, cd);
      }
      // Edge if either luminance OR color difference exceeds threshold
      edge[r][c] = (maxLumDiff > 35 || maxColorDiff > 40) ? 1 : 0;
    }
  }
  return edge;
}
function blockHasEdge(edgeMap, startRow, startCol, blockH, blockW, rows, cols) {
  let edgeCount = 0, total = 0;
  for (let r = startRow; r < Math.min(startRow + blockH, rows); r++) {
    for (let c = startCol; c < Math.min(startCol + blockW, cols); c++) {
      total++;
      if (edgeMap[r][c]) edgeCount++;
    }
  }
  return total > 0 && (edgeCount / total) > 0.15;
}

// ========== V2 Pipeline: Dominant Color Sampling ==========
function sampleDominantColor(data, sx, sy, bw, bh, imgW) {
  const buckets = new Uint32Array(4096);
  const bucketR = new Float64Array(4096);
  const bucketG = new Float64Array(4096);
  const bucketB = new Float64Array(4096);
  let total = 0;
  for (let y = sy; y < sy + bh; y++) {
    for (let x = sx; x < sx + bw; x++) {
      const idx = (y * imgW + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      buckets[key]++;
      bucketR[key] += r;
      bucketG[key] += g;
      bucketB[key] += b;
      total++;
    }
  }
  if (total === 0) return [0, 0, 0];
  let bestKey = 0, bestCount = 0;
  for (let i = 0; i < 4096; i++) {
    if (buckets[i] > bestCount) { bestCount = buckets[i]; bestKey = i; }
  }
  const cnt = buckets[bestKey];
  return [
    Math.round(bucketR[bestKey] / cnt),
    Math.round(bucketG[bestKey] / cnt),
    Math.round(bucketB[bestKey] / cnt)
  ];
}
function dominantFromList(colors) {
  if (colors.length === 0) return [0, 0, 0];
  if (colors.length === 1) return colors[0];
  const buckets = new Map();
  for (const [r, g, b] of colors) {
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    if (!buckets.has(key)) buckets.set(key, { count: 0, r: 0, g: 0, b: 0 });
    const bk = buckets.get(key);
    bk.count++; bk.r += r; bk.g += g; bk.b += b;
  }
  let best = null, bestCount = 0;
  for (const bk of buckets.values()) {
    if (bk.count > bestCount) { bestCount = bk.count; best = bk; }
  }
  return [Math.round(best.r / best.count), Math.round(best.g / best.count), Math.round(best.b / best.count)];
}
function sampleEdgePreserving(data, sx, sy, bw, bh, imgW) {
  const pixels = [];
  for (let y = sy; y < sy + bh; y++) {
    for (let x = sx; x < sx + bw; x++) {
      const idx = (y * imgW + x) * 4;
      pixels.push([data[idx], data[idx + 1], data[idx + 2]]);
    }
  }
  if (pixels.length === 0) return [0, 0, 0];
  const lums = pixels.map(([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b);
  // ★ Dark-stroke priority: if very dark pixels (lum<30) exist and occupy >3%, return their representative
  // This specifically protects thin black outlines from being overwhelmed by background majority
  const veryDarkPixels = [];
  for (let i = 0; i < pixels.length; i++) {
    if (lums[i] < 30) veryDarkPixels.push(pixels[i]);
  }
  if (veryDarkPixels.length > 0 && veryDarkPixels.length / pixels.length >= 0.03) {
    return dominantFromList(veryDarkPixels);
  }
  // Split into dark and bright groups by luminance
  const threshold = 120;
  const darkPixels = [], brightPixels = [];
  for (let i = 0; i < pixels.length; i++) {
    if (lums[i] < threshold) darkPixels.push(pixels[i]);
    else brightPixels.push(pixels[i]);
  }
  // ★ Lowered minority threshold from 10% to 4% — thin lines can be very small portion of a block
  const minGroup = darkPixels.length <= brightPixels.length ? darkPixels : brightPixels;
  const majGroup = darkPixels.length <= brightPixels.length ? brightPixels : darkPixels;
  // ★ Tightened upper bound: 50%→30% — when minority approaches 50%, it's not a "minority feature"
  // but a contested zone; in that case, go with majority for cleaner bead blocks
  if (minGroup.length > 0 && minGroup.length / pixels.length >= 0.04 && minGroup.length / pixels.length <= 0.30) {
    return dominantFromList(minGroup);
  }
  // ★ NEW: High-chroma minority detection — catch small colored features in a differently-colored block
  // E.g., a yellow pixel among gray: lum split won't catch it, but chroma split will
  if (pixels.length >= 4) {
    // Quick median hue check: find the dominant hue bucket, and see if any minority has very different hue + high chroma
    const avgR = pixels.reduce((s, p) => s + p[0], 0) / pixels.length;
    const avgG = pixels.reduce((s, p) => s + p[1], 0) / pixels.length;
    const avgB = pixels.reduce((s, p) => s + p[2], 0) / pixels.length;
    const highChromaMinority = [];
    for (const p of pixels) {
      const cd = Math.abs(p[0] - avgR) + Math.abs(p[1] - avgG) + Math.abs(p[2] - avgB);
      if (cd > 80) highChromaMinority.push(p); // significantly different from average
    }
    if (highChromaMinority.length > 0 && highChromaMinority.length / pixels.length >= 0.03 && highChromaMinority.length / pixels.length <= 0.4) {
      return dominantFromList(highChromaMinority);
    }
  }
  return dominantFromList(majGroup.length > 0 ? majGroup : pixels);
}
function buildRawGridDominantColor(imageData, pixN, baseCenterBias, minorityColorProtect) {
  const data = imageData.data;
  const imgW = imageData.width, imgH = imageData.height;
  const { rows, cols } = resolveTargetGridByAspect(imgW, imgH, pixN);
  const bw = imgW / cols, bh = imgH / rows;
  // Compute edge map at grid resolution
  const tempRaw = [];
  for (let r = 0; r < rows; r++) {
    tempRaw[r] = [];
    for (let c = 0; c < cols; c++) {
      const sx = Math.floor(c * bw), sy = Math.floor(r * bh);
      const sw = Math.max(1, Math.round(bw)), sh = Math.max(1, Math.round(bh));
      tempRaw[r][c] = sampleDominantColor(data, sx, sy, sw, sh, imgW);
    }
  }
  const edgeMap = computeSimpleEdgeMap(tempRaw, rows, cols);
  // Re-sample: use edge-preserving for edge blocks, dominant for flat blocks
  const rawGrid = [];
  for (let r = 0; r < rows; r++) {
    rawGrid[r] = [];
    for (let c = 0; c < cols; c++) {
      const sx = Math.floor(c * bw), sy = Math.floor(r * bh);
      const sw = Math.max(1, Math.round(bw)), sh = Math.max(1, Math.round(bh));
      if (blockHasEdge(edgeMap, r, c, 1, 1, rows, cols)) {
        rawGrid[r][c] = sampleEdgePreserving(data, sx, sy, sw, sh, imgW);
      } else {
        rawGrid[r][c] = tempRaw[r][c];
      }
    }
  }
  return { rawGrid, rows, cols };
}

// ========== V3 Pipeline: Smart Sampling (Mode + Edge-Aware) ==========
// Phase 1.1: 众数 + 边缘感知双模采样
// 平坦区域 → 取像素众数（消除过渡色）
// 边缘区域 → 按梯度方向分割像素为两组，取占比更大一组的众数
function sampleModeSmart(data, sx, sy, bw, bh, imgW) {
  const total = bw * bh;
  if (total <= 1) return sampleCenter(data, sx, sy, bw, bh, imgW);
  // Step 1: Compute gradient magnitude to detect if this block straddles an edge
  let gxSum = 0, gySum = 0, gradMag = 0;
  const pixels = [];
  const lums = [];
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const idx = ((sy + y) * imgW + (sx + x)) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      pixels.push([r, g, b]);
      lums.push(0.299 * r + 0.587 * g + 0.114 * b);
    }
  }
  // Sobel-like gradient estimation across the block
  for (let y = 1; y < bh - 1; y++) {
    for (let x = 1; x < bw - 1; x++) {
      const i = y * bw + x;
      const gx = lums[i + 1] - lums[i - 1];
      const gy = lums[i + bw] - lums[i - bw];
      gxSum += gx; gySum += gy;
      gradMag += Math.abs(gx) + Math.abs(gy);
    }
  }
  const interiorCount = Math.max(1, (bh - 2) * (bw - 2));
  const avgGrad = gradMag / interiorCount;
  // Step 2: If flat region (low gradient), use mode sampling (most frequent color bucket)
  if (avgGrad < 28) {
    return sampleDominantColor(data, sx, sy, bw, bh, imgW);
  }
  // Step 3: Edge region — split pixels along dominant gradient direction
  // Determine split direction from accumulated gradient
  const gradAngle = Math.atan2(gySum, gxSum); // angle of gradient
  // Split line passes through block center, perpendicular to gradient direction
  const cx = bw / 2, cy = bh / 2;
  // Normal to gradient = the edge direction; we split along gradient direction
  const cosA = Math.cos(gradAngle), sinA = Math.sin(gradAngle);
  const groupA = [], groupB = [];
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const dot = (x - cx) * cosA + (y - cy) * sinA;
      const p = pixels[y * bw + x];
      if (dot >= 0) groupA.push(p);
      else groupB.push(p);
    }
  }
  // Take mode of the larger group (the dominant side of the edge)
  const major = groupA.length >= groupB.length ? groupA : groupB;
  if (major.length === 0) return sampleDominantColor(data, sx, sy, bw, bh, imgW);
  // Mode via 4-bit quantized buckets (same as sampleDominantColor)
  const buckets = new Map();
  for (const [r, g, b] of major) {
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    if (!buckets.has(key)) buckets.set(key, { count: 0, r: 0, g: 0, b: 0 });
    const bk = buckets.get(key);
    bk.count++; bk.r += r; bk.g += g; bk.b += b;
  }
  let best = null, bestCount = 0;
  for (const bk of buckets.values()) {
    if (bk.count > bestCount) { bestCount = bk.count; best = bk; }
  }
  if (!best) return sampleDominantColor(data, sx, sy, bw, bh, imgW);
  return [Math.round(best.r / best.count), Math.round(best.g / best.count), Math.round(best.b / best.count)];
}

function buildRawGridSmartSample(imageData, pixN) {
  const data = imageData.data;
  const imgW = imageData.width, imgH = imageData.height;
  const { rows, cols } = resolveTargetGridByAspect(imgW, imgH, pixN);
  const bw = imgW / cols, bh = imgH / rows;
  const rawGrid = [];
  for (let r = 0; r < rows; r++) {
    rawGrid[r] = [];
    for (let c = 0; c < cols; c++) {
      const sx = Math.floor(c * bw), sy = Math.floor(r * bh);
      const sw = Math.max(1, Math.round(bw)), sh = Math.max(1, Math.round(bh));
      rawGrid[r][c] = sampleModeSmart(data, sx, sy, sw, sh, imgW);
    }
  }
  return { rawGrid, rows, cols };
}

// ========== V2 Pipeline: K-Means Quantization ==========
function kMeansPPInit(labColors, k) {
  const n = labColors.length;
  if (n <= k) return labColors.map(c => [...c]);
  const centers = [labColors[Math.floor(Math.random() * n)].slice()];
  const dist = new Float64Array(n).fill(Infinity);
  for (let i = 1; i < k; i++) {
    const last = centers[i - 1];
    let totalDist = 0;
    for (let j = 0; j < n; j++) {
      const d = deltaE2000FromLab(labColors[j][0], labColors[j][1], labColors[j][2], last[0], last[1], last[2]);
      dist[j] = Math.min(dist[j], d * d);
      totalDist += dist[j];
    }
    if (totalDist === 0) break;
    let r = Math.random() * totalDist, cum = 0;
    for (let j = 0; j < n; j++) {
      cum += dist[j];
      if (cum >= r) { centers.push(labColors[j].slice()); break; }
    }
  }
  return centers;
}
function extractDominantPalette(rawGrid, rows, cols, maxColors) {
  // Collect all unique-ish colors via 4-bit quantized buckets
  const buckets = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [R, G, B] = rawGrid[r][c];
      const key = ((R >> 4) << 8) | ((G >> 4) << 4) | (B >> 4);
      if (!buckets.has(key)) buckets.set(key, { count: 0, r: 0, g: 0, b: 0 });
      const bk = buckets.get(key);
      bk.count++; bk.r += R; bk.g += G; bk.b += B;
    }
  }
  // Get representative colors
  const reps = [];
  const repWeights = [];
  for (const bk of buckets.values()) {
    reps.push(rgbToLab(
      Math.round(bk.r / bk.count),
      Math.round(bk.g / bk.count),
      Math.round(bk.b / bk.count)
    ));
    repWeights.push(bk.count);
  }
  const k = Math.min(maxColors, reps.length);
  if (k <= 0) return [];
  // K-Means++ in Lab space
  let centers = kMeansPPInit(reps, k);
  for (let iter = 0; iter < 20; iter++) {
    const assign = new Int32Array(reps.length);
    for (let i = 0; i < reps.length; i++) {
      let bestD = Infinity, bestC = 0;
      for (let j = 0; j < centers.length; j++) {
        const d = deltaE2000FromLab(reps[i][0], reps[i][1], reps[i][2], centers[j][0], centers[j][1], centers[j][2]);
        if (d < bestD) { bestD = d; bestC = j; }
      }
      assign[i] = bestC;
    }
    const newCenters = centers.map(() => [0, 0, 0, 0]); // L, a, b, weight
    for (let i = 0; i < reps.length; i++) {
      const ci = assign[i];
      const w = repWeights[i];
      newCenters[ci][0] += reps[i][0] * w;
      newCenters[ci][1] += reps[i][1] * w;
      newCenters[ci][2] += reps[i][2] * w;
      newCenters[ci][3] += w;
    }
    let converged = true;
    for (let j = 0; j < centers.length; j++) {
      if (newCenters[j][3] === 0) continue;
      const nL = newCenters[j][0] / newCenters[j][3];
      const nA = newCenters[j][1] / newCenters[j][3];
      const nB = newCenters[j][2] / newCenters[j][3];
      if (Math.abs(nL - centers[j][0]) + Math.abs(nA - centers[j][1]) + Math.abs(nB - centers[j][2]) > 0.5) converged = false;
      centers[j] = [nL, nA, nB];
    }
    if (converged) break;
  }
  // Map each K-Means center to nearest MARD palette color, tracking cluster weight
  const usedIndices = new Set();
  const paletteEntries = []; // {idx, weight, centerL, centerA, centerB}
  // ★ 注入点2: 手绘风格调色板偏好 — 方向匹配条件 bonus
  // 分析数据显示MARD色族G系(棕肤)18%+H系(灰)31%+F系(红)12%，不能只偏向灰色
  // 改为：低彩度center→灰色PREFERRED可获bonus；高彩度center→仅同色相方向PREFERRED获bonus
  const useHandcraftBonus = appState.useHandcraftStyle && HANDCRAFT_PREFERRED_SET;
  for (let ci = 0; ci < centers.length; ci++) {
    const centerChroma = Math.hypot(centers[ci][1], centers[ci][2]);
    const centerHue = (Math.atan2(centers[ci][2], centers[ci][1]) * 180 / Math.PI + 360) % 360;
    let bestIdx = 0, bestD = Infinity;
    for (let i = 0; i < MARD_PALETTE.length; i++) {
      if (usedIndices.has(i)) continue;
      const p = MARD_PALETTE[i];
      let d = deltaE2000FromLab(centers[ci][0], centers[ci][1], centers[ci][2], p.L, p.a, p.b_lab);
      // 方向匹配 bonus
      if (useHandcraftBonus && HANDCRAFT_PREFERRED_SET.has(i)) {
        if (centerChroma < 12) {
          // center 本身接近灰色 → PREFERRED 灰色系色号可获得 bonus
          // 但绿色方向(hue 90-200)的带色调灰不给bonus（防止H14等污染调色板）
          if (p.chroma < 3) {
            d -= 2.5; // 纯灰：满额bonus
          } else if (p.chroma < 8) {
            const pHueDeg = p.hue;
            if (pHueDeg > 90 && pHueDeg < 200) {
              // 绿色方向带色调灰：不给bonus
            } else {
              d -= 2.0; // 暖色/紫色/蓝色方向的微色调灰：给弱bonus
            }
          }
        } else if (p.chroma >= 8) {
          // center 是彩色 → 仅同色相方向(色相差<45度)的 PREFERRED 色号获得 bonus
          const hueDist = Math.min(Math.abs(centerHue - p.hue), 360 - Math.abs(centerHue - p.hue));
          if (hueDist < 45) d -= 2.0;
        }
        // 不同方向的灰色/彩色 PREFERRED 色号不给 bonus
      }
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    usedIndices.add(bestIdx);
    // Compute cluster weight from assignments
    let w = 0;
    for (let i = 0; i < reps.length; i++) {
      let closestC = 0, closestD = Infinity;
      for (let j = 0; j < centers.length; j++) {
        const dd = deltaE2000FromLab(reps[i][0], reps[i][1], reps[i][2], centers[j][0], centers[j][1], centers[j][2]);
        if (dd < closestD) { closestD = dd; closestC = j; }
      }
      if (closestC === ci) w += repWeights[i];
    }
    paletteEntries.push({ idx: bestIdx, weight: w });
  }
  // Deduplicate similar MARD colors — unified threshold
  const deduped = [];
  const removed = new Set();
  // Sort by weight descending so heavier clusters survive
  paletteEntries.sort((a, b) => b.weight - a.weight);
  for (let i = 0; i < paletteEntries.length; i++) {
    if (removed.has(i)) continue;
    deduped.push(paletteEntries[i].idx);
    const pi = MARD_PALETTE[paletteEntries[i].idx];
    for (let j = i + 1; j < paletteEntries.length; j++) {
      if (removed.has(j)) continue;
      const pj = MARD_PALETTE[paletteEntries[j].idx];
      const dist = deltaE2000FromLab(pi.L, pi.a, pi.b_lab, pj.L, pj.a, pj.b_lab);
      // ★ 收紧相似色合并阈值：暗色(L<40)时用更大的合并阈值，避免 M12/F11/H16 等相近暗棕色被保留为独立聚类
      const dedupThreshold = (pi.L < 40 && pj.L < 40) ? 10 : 7;
      if (dist < dedupThreshold) {
        removed.add(j);
      }
    }
  }
  // ★ Ensure dark colors exist in palette for outlines/strokes
  // Check 1: Must have truly dark color (L<20) for black outlines
  let hasTrulyDark = false;
  let hasDark = false;
  for (const idx of deduped) {
    if (MARD_PALETTE[idx].L < 20) hasTrulyDark = true;
    if (MARD_PALETTE[idx].L < 35) hasDark = true;
  }
  // Count dark pixels in rawGrid (lowered threshold to 1% — even thin outlines matter)
  let darkPixelCount = 0, veryDarkPixelCount = 0;
  const totalPixels = rows * cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (rgb) {
        const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        if (lum < 30) veryDarkPixelCount++;
        if (lum < 60) darkPixelCount++;
      }
    }
  }
  // Add truly dark color (L<20) if very dark pixels exist (>1%)
  if (!hasTrulyDark && veryDarkPixelCount > totalPixels * 0.01) {
    let dR = 0, dG = 0, dB = 0, dN = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rgb = rawGrid[r][c];
        if (rgb && (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) < 30) {
          dR += rgb[0]; dG += rgb[1]; dB += rgb[2]; dN++;
        }
      }
    }
    if (dN > 0) {
      // ★ Search specifically in very dark MARD colors (L<25) for accurate black outline representation
      const veryDarkIndices = ALL_INDICES.filter(i => MARD_PALETTE[i].L < 25);
      const darkIdx = findNearestColor(Math.round(dR / dN), Math.round(dG / dN), Math.round(dB / dN),
        veryDarkIndices.length > 0 ? veryDarkIndices : DARK_NEUTRAL_INDICES.length > 0 ? DARK_NEUTRAL_INDICES : null);
      if (darkIdx >= 0 && !deduped.includes(darkIdx)) {
        deduped.push(darkIdx);
      }
    }
  }
  // Also ensure a dark color (L<35) if dark pixels (lum<60) exist at >1%
  if (!hasDark && darkPixelCount > totalPixels * 0.01) {
    let dR = 0, dG = 0, dB = 0, dN = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rgb = rawGrid[r][c];
        if (rgb && (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) < 60) {
          dR += rgb[0]; dG += rgb[1]; dB += rgb[2]; dN++;
        }
      }
    }
    if (dN > 0) {
      const darkIdx = findNearestColor(Math.round(dR / dN), Math.round(dG / dN), Math.round(dB / dN),
        DARK_NEUTRAL_INDICES.length > 0 ? DARK_NEUTRAL_INDICES : null);
      if (darkIdx >= 0 && !deduped.includes(darkIdx)) {
        deduped.push(darkIdx);
      }
    }
  }
  // ★ 增强版：确保稀有高彩度特征色入选调色板（如猫鼻子黄色、腮红、配饰等）
  // 门槛根据网格尺寸自适应：小图降低chroma和距离要求，允许更多特征色
  const featureTotalCells = rows * cols;
  const featureGridScale = Math.max(0, Math.min(1, (featureTotalCells - 400) / (14000 - 400)));
  const outlierChromaMin = Math.round(15 + featureGridScale * 10); // 小图15，大图25
  const outlierDistMin = Math.round(12 + featureGridScale * 6);    // 小图12，大图18
  const maxFeatureColors = featureGridScale < 0.5 ? 3 : 2;        // 小图3个，大图2个
  const chromaOutliers = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const [cL, cA, cB] = rgbToLab(rgb[0], rgb[1], rgb[2]);
      const chroma = Math.hypot(cA, cB);
      if (chroma < outlierChromaMin) continue;
      let minDE = Infinity;
      for (const idx of deduped) {
        const p = MARD_PALETTE[idx];
        const de = deltaE2000FromLab(cL, cA, cB, p.L, p.a, p.b_lab);
        if (de < minDE) minDE = de;
      }
      if (minDE < outlierDistMin) continue;
      const key = ((rgb[0] >> 5) << 6) | ((rgb[1] >> 5) << 3) | (rgb[2] >> 5);
      if (!chromaOutliers.has(key)) {
        chromaOutliers.set(key, { r: 0, g: 0, b: 0, count: 0, chroma: 0 });
      }
      const bk = chromaOutliers.get(key);
      bk.r += rgb[0]; bk.g += rgb[1]; bk.b += rgb[2];
      bk.count++; bk.chroma += chroma;
    }
  }
  const outlierList = [...chromaOutliers.values()]
    .filter(bk => bk.count >= 1)
    .sort((a, b) => (b.chroma / b.count) - (a.chroma / a.count));
  let addedFeatureColors = 0;
  for (const bk of outlierList) {
    if (addedFeatureColors >= maxFeatureColors) break;
    const avgR = Math.round(bk.r / bk.count);
    const avgG = Math.round(bk.g / bk.count);
    const avgB = Math.round(bk.b / bk.count);
    const featureIdx = findNearestColor(avgR, avgG, avgB, null);
    if (featureIdx >= 0 && !deduped.includes(featureIdx)) {
      const fp = MARD_PALETTE[featureIdx];
      // 小图放宽 chroma 要求（10 vs 15）
      if (fp.chroma >= (10 + featureGridScale * 5)) {
        deduped.push(featureIdx);
        addedFeatureColors++;
      }
    }
  }
  return deduped;
}

// ========== V2 Pipeline: BFS Island Merge ==========
function mergeSmallIslands(gridData, rawGrid, rows, cols, minSize, featureMask) {
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  function bfs(sr, sc) {
    const color = gridData[sr][sc];
    const queue = [[sr, sc]];
    let head = 0;
    const cells = [];
    visited[sr][sc] = 1;
    let protectedCount = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      cells.push([r, c]);
      if (featureMask && featureMask[r] && featureMask[r][c]) protectedCount++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gridData[nr][nc] === color) {
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
    }
    return { cells, protectedCount };
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c] || gridData[r][c] === -1) continue;
      const { cells, protectedCount } = bfs(r, c);
      // ★ Only skip if MAJORITY (>50%) of cells are feature-protected
      if (protectedCount > cells.length * 0.5) continue;
      if (cells.length >= minSize) continue;
      // Find most common neighbor color
      const neighborFreq = new Map();
      for (const [cr, cc] of cells) {
        for (const [dr, dc] of dirs) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gridData[nr][nc] !== gridData[cr][cc] && gridData[nr][nc] !== -1) {
            neighborFreq.set(gridData[nr][nc], (neighborFreq.get(gridData[nr][nc]) || 0) + 1);
          }
        }
      }
      if (neighborFreq.size === 0) continue;
      let bestColor = gridData[r][c], bestCount = 0;
      for (const [color, count] of neighborFreq) {
        if (count > bestCount) { bestCount = count; bestColor = color; }
      }
      for (const [cr, cc] of cells) gridData[cr][cc] = bestColor;
    }
  }
  return gridData;
}

// ========== V2 Pipeline: Dark-Aware BFS Island Merge ==========
// Like mergeSmallIslands but protects dark cells (outlines/strokes) from being merged into bright neighbors
function mergeSmallIslandsDarkAware(gridData, rawGrid, rows, cols, minSize, featureMask) {
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  function bfs(sr, sc) {
    const color = gridData[sr][sc];
    const queue = [[sr, sc]];
    let head = 0; // ★ Dual-pointer BFS: O(1) dequeue instead of O(n) Array.shift()
    const cells = [];
    visited[sr][sc] = 1;
    let protectedCount = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      cells.push([r, c]);
      if (featureMask && featureMask[r] && featureMask[r][c]) protectedCount++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gridData[nr][nc] === color) {
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
    }
    return { cells, protectedCount };
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c] || gridData[r][c] === -1) continue;
      const { cells, protectedCount } = bfs(r, c);
      // Skip if majority of cells are feature-protected
      if (protectedCount > cells.length * 0.5) continue;
      if (cells.length >= minSize) continue;
      // ★ Dark island protection: if this island is dark, only merge into dark neighbors
      const islandColor = gridData[cells[0][0]][cells[0][1]];
      const islandPal = islandColor >= 0 ? MARD_PALETTE[islandColor] : null;
      const islandIsDark = islandPal && islandPal.L < 38;
      // ★ NEW: Chromatic feature island protection — preserve high-chroma small islands
      // that differ significantly from all neighbors (e.g., cat nose, small colored features)
      const islandIsChromatic = islandPal && islandPal.chroma >= 20;
      // Find most common neighbor color
      const neighborFreq = new Map();
      for (const [cr, cc] of cells) {
        for (const [dr, dc] of dirs) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gridData[nr][nc] !== gridData[cr][cc] && gridData[nr][nc] !== -1) {
            neighborFreq.set(gridData[nr][nc], (neighborFreq.get(gridData[nr][nc]) || 0) + 1);
          }
        }
      }
      if (neighborFreq.size === 0) continue;
      let bestColor = gridData[r][c], bestCount = 0;
      if (islandIsDark) {
        // ★ For dark islands: prefer merging into dark neighbors, skip bright ones
        let bestDarkColor = -1, bestDarkCount = 0;
        let bestAnyColor = -1, bestAnyCount = 0;
        for (const [color, count] of neighborFreq) {
          if (count > bestAnyCount) { bestAnyCount = count; bestAnyColor = color; }
          const nPal = MARD_PALETTE[color];
          if (nPal && nPal.L < 50 && count > bestDarkCount) {
            bestDarkCount = count; bestDarkColor = color;
          }
        }
        if (bestDarkColor >= 0) {
          // Merge into a dark neighbor — keeps the stroke/outline intact
          bestColor = bestDarkColor;
        } else {
          // No dark neighbor: this dark island is truly isolated, skip merging to preserve it
          continue;
        }
      } else if (islandIsChromatic && cells.length <= 3) {
        // ★ Chromatic small islands (1-3 cells): check if merging would lose the color identity
        // Only merge into a similarly chromatic neighbor; if all neighbors are achromatic, preserve
        let bestChromColor = -1, bestChromCount = 0;
        let allNeighborsLowChroma = true;
        for (const [color, count] of neighborFreq) {
          const nPal = MARD_PALETTE[color];
          if (nPal && nPal.chroma >= 12) {
            allNeighborsLowChroma = false;
            // Also check hue distance — prefer same hue family
            const hueDist = Math.min(Math.abs(islandPal.hue - nPal.hue), 360 - Math.abs(islandPal.hue - nPal.hue));
            if (hueDist < 60 && count > bestChromCount) {
              bestChromCount = count; bestChromColor = color;
            }
          }
        }
        if (allNeighborsLowChroma) {
          // All neighbors are gray/achromatic — this chromatic island is a distinct feature, skip merging
          continue;
        }
        if (bestChromColor >= 0) {
          bestColor = bestChromColor;
        } else {
          // No same-hue chromatic neighbor: preserve to avoid color identity loss
          continue;
        }
      } else {
        for (const [color, count] of neighborFreq) {
          if (count > bestCount) { bestCount = count; bestColor = color; }
        }
      }
      for (const [cr, cc] of cells) gridData[cr][cc] = bestColor;
    }
  }
  return gridData;
}

// ========== V2 Pipeline: Color Matching ==========
function nearestColorByLabV2(L, a, bVal, palette, rawRgb) {
  let bestIdx = palette[0], bestScore = Infinity;
  const rawL = 0.299 * rawRgb[0] + 0.587 * rawRgb[1] + 0.114 * rawRgb[2];
  for (const idx of palette) {
    const p = MARD_PALETTE[idx];
    const de = deltaE2000FromLab(L, a, bVal, p.L, p.a, p.b_lab);
    let penalty = 0;
    // ★ Enhanced lightness protection for dark colors — prevent dark strokes from being lifted
    if (L < 15) {
      // Very dark (black outlines): strong penalty for any significant lightening
      const pLum = 0.299 * p.r + 0.587 * p.g + 0.114 * p.b;
      const lumDiff = Math.abs(rawL - pLum);
      if (lumDiff > 15) penalty += lumDiff * 0.5;
    } else if (L < 30) {
      const pLum = 0.299 * p.r + 0.587 * p.g + 0.114 * p.b;
      const lumDiff = Math.abs(rawL - pLum);
      if (lumDiff > 25) penalty += lumDiff * 0.35;
    }
    // Hue shift penalty — stronger for high-chroma colors (these are visually distinct features)
    const rawHue = Math.atan2(bVal, a);
    const palHue = Math.atan2(p.b_lab, p.a);
    let hueDiff = Math.abs(rawHue - palHue);
    if (hueDiff > Math.PI) hueDiff = 2 * Math.PI - hueDiff;
    const rawChroma = Math.sqrt(a * a + bVal * bVal);
    if (rawChroma > 20 && hueDiff > 0.4) penalty += hueDiff * rawChroma * 0.12;
    else if (rawChroma > 10 && hueDiff > 0.6) penalty += hueDiff * rawChroma * 0.08;
    // ★ 中等亮度+中等彩度区域额外色相保护（肤色/暖棕色容易被偏移）
    if (L > 30 && L < 75 && rawChroma > 8 && rawChroma < 25 && hueDiff > 0.3) {
      penalty += hueDiff * rawChroma * 0.06;
    }
    // Saturation jump penalty — prevents vivid colors from being matched to gray
    const palChroma = Math.sqrt(p.a * p.a + p.b_lab * p.b_lab);
    const chromaDiff = Math.abs(rawChroma - palChroma);
    if (chromaDiff > 12) penalty += chromaDiff * 0.08;
    // ★ desaturation penalty — if raw is chromatic but palette is achromatic, penalize
    if (rawChroma > 14 && palChroma < 8) penalty += (rawChroma - palChroma) * 0.18;
    // ★ 回移V1关键penalty：阻止彩色→暗灰的错误映射
    // neutralDarkPenalty：彩色源映射到暗灰色时加penalty
    if (rawChroma > 14 && palChroma < 8 && p.L < 58) {
      penalty += 3.5 + (rawChroma - 14) * 0.1;
    }
    // warmToNeutralPenalty：暖色调映射到冷灰色时加penalty
    const rawHueDeg = (rawHue * 180 / Math.PI + 360) % 360;
    const rawIsWarm = rawHueDeg <= 85 || rawHueDeg >= 320;
    if (rawIsWarm && rawChroma > 8 && palChroma < 9 && p.L < 54) {
      penalty += 2.0;
    }
    // warmDarkAffinityBonus：暖暗色匹配到暖色时给bonus
    const palIsWarm = (p.hue <= 72 || p.hue >= 318);
    const rawIsDark = L < 44;
    const rawWarmDark = rawIsDark && rawIsWarm && rawChroma >= 5.5;
    if (rawWarmDark && palIsWarm && palChroma >= 6 && p.L < 60) {
      penalty -= Math.min(2.0, 0.8 + Math.max(0, rawChroma - 5.5) * 0.06);
    }
    // ★ 低彩度色调偏移修正 — 仅针对绿色/青色方向的带色调灰色MARD色施加惩罚
    // 不影响暖色调灰(H8/H12等)和紫色调灰(H22等)的正常匹配
    if (rawChroma < 5 && palChroma > 3) {
      const palHueDeg = (Math.atan2(p.b_lab, p.a) * 180 / Math.PI + 360) % 360;
      // 只惩罚绿色-青色方向(hue 90-200)的带色调灰，这是最常见的噪点方向
      if (palHueDeg > 90 && palHueDeg < 200) {
        penalty += palChroma * 0.8;
      }
    }
    const score = de + penalty;
    if (score < bestScore) { bestScore = score; bestIdx = idx; }
  }
  return bestIdx;
}

// ========== V2 Pipeline: Main Generator (with Layered Lock Architecture) ==========
// Phase 1.2: 分层锁定后处理
// Layer 1: 描边层 (最高优先级) → 锁定描边像素
// Layer 2: 关键特征层 → 锁定高彩度小区域 (眼睛、腮红等)
// Layer 3: 填充层 → 未锁定区域做简化
// 合成规则：描边 > 特征 > 填充，冲突时高优先级覆盖
function generateGridV2(imageData, pixN, targetRows, targetCols) {
  const preset = PROFILE_PRESETS[appState.activePresetId] || PROFILE_PRESETS.smart_balanced;
  // Step 0 (Handcraft): 原图全局色调预分析
  if (appState.useHandcraftStyle && HANDCRAFT_STYLE_PROFILE) {
    appState.globalColorHints = preAnalyzeGlobalColorDistribution(imageData);
  }
  // Step 1: Smart sampling (众数 + 边缘感知双模)
  const { rawGrid, rows, cols } = buildRawGridSmartSample(imageData, pixN);
  // ★ gridScale：连续的尺寸缩放因子 0~1（0=极小图, 1=大图120x120+）
  // 取代之前的 isSmallGrid 硬切换，让所有尺寸都能平滑受益
  const totalCells = rows * cols;
  const gridScale = Math.max(0, Math.min(1, (totalCells - 400) / (14000 - 400)));
  const isSmallGrid = gridScale < 0.25; // 向后兼容：约60x60以下
  // Step 2: K-Means palette extraction → MARD matching
  // Phase 1.3: Dynamic color budget — separate bg from fg to avoid wasting color slots
  let baseBudget = Math.max(6, Math.min(10, getCompatColorBudget(preset.similarMerge || 14)));
  // ★ 注入点1: 手绘风格颜色预算（自适应分级，基于颜色分析数据）
  // 分析数据显示：102/104张样本属于高复杂度(>200桶)，暖色比64.7%，肤色比15.2%
  // 旧方案一刀切5-8色导致关键色丢失，现改为根据前景复杂度分级+加成
  if (appState.useHandcraftStyle && HANDCRAFT_STYLE_PROFILE) {
    const hints = appState.globalColorHints;
    let handcraftBudget = 9; // 默认中档
    if (hints) {
      // 基于前景色复杂度分级（4-bit量化桶数）
      const fgC = hints.fgColorComplexity || 0;
      if (fgC < 80) handcraftBudget = 7;        // 低复杂度
      else if (fgC < 200) handcraftBudget = 9;   // 中复杂度
      else handcraftBudget = 11;                  // 高复杂度
      // 肤色加成：有肤色区域需要额外色槽保护肤色过渡
      if (hints.skinRatio > 0.05) handcraftBudget += 2;
      // 暖色调加成：暖色系需要更多色号区分棕/肤/橙等
      if (hints.warmRatio > 0.4) handcraftBudget += 1;
      // 高背景占比时前景色可以适当少一点
      if (hints.bgRatio > 0.6) handcraftBudget -= 1;
    }
    // 上限14防止K-Means过多聚类效率下降，下限7保证最少颜色
    handcraftBudget = Math.max(7, Math.min(14, handcraftBudget));
    // ★ 关键变更：用 Math.max 取较高值，手绘风格引导选色方向而非压减颜色数
    baseBudget = Math.max(baseBudget, handcraftBudget);
  }
  const colorBudget = getDynamicColorBudget(rawGrid, rows, cols, baseBudget);
  const palette = extractDominantPalette(rawGrid, rows, cols, colorBudget);
  const matchPalette = (palette.length > 0 && palette.length < 221) ? palette : null;
  let gridData = [];
  for (let r = 0; r < rows; r++) {
    gridData[r] = [];
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (!rgb) { gridData[r][c] = -1; continue; }
      if (matchPalette) {
        const [L, a, bVal] = rgbToLab(rgb[0], rgb[1], rgb[2]);
        gridData[r][c] = nearestColorByLabV2(L, a, bVal, matchPalette, rgb);
      } else {
        gridData[r][c] = findNearestColor(rgb[0], rgb[1], rgb[2], null);
      }
    }
  }
  // === Initialize pixel lock map ===
  // 0 = unlocked, 1 = locked by outline layer, 2 = locked by feature layer
  const pixelLock = Array.from({ length: rows }, () => new Uint8Array(cols));

  // === LAYER 1: 描边层 (Outline Layer — highest priority) ===
  // ★ 大规模重写：自适应描边检测 + 多轮渐进式闭运算 + 拓扑断线修复
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  // Phase 1a: 计算全局亮度统计，用于自适应描边阈值
  let lumSum = 0, lumCount = 0, lumSorted = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      lumSum += lum; lumCount++;
      lumSorted.push(lum);
    }
  }
  lumSorted.sort((a, b) => a - b);
  const lumMedian = lumCount > 0 ? lumSorted[Math.floor(lumCount * 0.5)] : 128;
  const lumP15 = lumCount > 0 ? lumSorted[Math.floor(lumCount * 0.15)] : 40;
  // 自适应描边亮度阈值：放宽上限到75，让深灰描边（如眼镜圈）也能被检测
  const strokeLumThreshold = Math.min(75, Math.max(55, lumP15 + 15));
  // 自适应亮度差阈值：降低下界到18，更容易检测渐变边缘
  const brightDiffThreshold = Math.round(22 - (1 - gridScale) * 4); // 18~22
  
  // Phase 1b: 描边像素检测（增强版：梯度加权 + 自适应阈值）
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      if (lum > strokeLumThreshold) continue;
      let brighterCount = 0, totalN = 0, maxNbrLum = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const nRgb = rawGrid[nr][nc];
        if (!nRgb) continue;
        totalN++;
        const nLum = 0.299 * nRgb[0] + 0.587 * nRgb[1] + 0.114 * nRgb[2];
        if (nLum > maxNbrLum) maxNbrLum = nLum;
        if (nLum > lum + brightDiffThreshold) brighterCount++;
      }
      if (totalN >= 2 && brighterCount >= 1) {
        const curPal = MARD_PALETTE[gridData[r][c]];
        let locked = false;
        if (!curPal || curPal.L > 35) {
          const darkIdx = pickLockedDarkColor(rgb, {
            allowChromatic: true,
            chromaticMaxLum: strokeLumThreshold + 2,
            chromaticMaxL: 44,
            strictNeutral: lum < 40
          });
          if (darkIdx >= 0) {
            gridData[r][c] = darkIdx;
            locked = true;
          }
        } else {
          locked = true;
        }
        if (locked) pixelLock[r][c] = 1;
      }
    }
  }
  
  // Phase 1c: 多轮渐进式闭运算（统一处理1像素和2像素间隙，取代之前的两段代码）
  // 第1轮：标准1像素间隙（亮度阈值110）
  // 第2轮：2像素间隙修复（亮度阈值按gridScale从110到125渐变）
  // 第3轮：对角线方向2像素桥接（所有尺寸均执行）
  // 第4轮（仅中小图 gridScale<0.55）：3像素间隙修复，适合58格弧线/曲线结构
  const closingRounds = gridScale < 0.55 ? 4 : 3;
  const closingLumLimit = [
    110,
    Math.round(110 + (1 - gridScale) * 15),
    120,
    Math.round(100 + (1 - gridScale) * 5)  // 第4轮：小图提升到115，改善低格数断口覆盖
  ];
  // 对低格数（gridScale<0.3）进一步提升第4轮阈值
  if (gridScale < 0.3 && closingRounds >= 4) {
    closingLumLimit[3] = 115;
  }
  for (let round = 0; round < closingRounds; round++) {
    const lumLimit = closingLumLimit[round] || 100;
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (pixelLock[r][c] !== 0) continue;
        let bridged = false;
        if (round === 0) {
          // 第1轮：标准1像素闭运算（H/V/对角线）
          const pairs1 = [
            [[r-1,c],[r+1,c]], [[r,c-1],[r,c+1]],
            [[r-1,c-1],[r+1,c+1]], [[r-1,c+1],[r+1,c-1]]
          ];
          for (const [[r1,c1],[r2,c2]] of pairs1) {
            if (r1 >= 0 && r1 < rows && c1 >= 0 && c1 < cols &&
                r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols &&
                pixelLock[r1][c1] === 1 && pixelLock[r2][c2] === 1) {
              bridged = true; break;
            }
          }
        } else if (round === 1) {
          // 第2轮：2像素间隙（纵向/横向）
          // 模式：描边-当前-空/描边  或  描边-空-当前-描边
          if (r >= 1 && r + 1 < rows) {
            // 纵向：上下各1格内有描边
            if (pixelLock[r-1][c] === 1 && r + 1 < rows && pixelLock[r+1][c] === 1) {
              // 已被第1轮处理
            } else if (r >= 2 && pixelLock[r-2][c] === 1 && pixelLock[r+1] && pixelLock[r+1][c] === 1) {
              bridged = true;
            } else if (r + 2 < rows && pixelLock[r+2] && pixelLock[r+2][c] === 1 && pixelLock[r-1][c] === 1) {
              bridged = true;
            }
          }
          if (!bridged && c >= 1 && c + 1 < cols) {
            if (c >= 2 && pixelLock[r][c-2] === 1 && pixelLock[r][c+1] === 1) {
              bridged = true;
            } else if (c + 2 < cols && pixelLock[r][c+2] === 1 && pixelLock[r][c-1] === 1) {
              bridged = true;
            }
          }
        } else if (round === 3) {
          // 第4轮：3像素间隙修复（适合弧线/曲线的较长断口）
          const gaps3 = [
            [[r-3,c],[r,c]], [[r+3,c],[r,c]], [[r,c-3],[r,c]], [[r,c+3],[r,c]],
            [[r-1,c-2],[r+2,c+1]], [[r-1,c+2],[r+2,c-1]],
            [[r-2,c-1],[r+1,c+2]], [[r-2,c+1],[r+1,c-2]]
          ];
          for (const [[r1,c1],[r2,c2]] of gaps3) {
            if (r1 >= 0 && r1 < rows && c1 >= 0 && c1 < cols &&
                r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols &&
                pixelLock[r1][c1] === 1 && pixelLock[r2][c2] === 1) {
              bridged = true; break;
            }
          }
          // 3像素间隙内找任意2个描边邻居夹住当前格
          if (!bridged) {
            let strokeNbCount = 0;
            for (const [dr, dc] of dirs8) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && pixelLock[nr][nc] === 1) strokeNbCount++;
            }
            const farStroke = [
              [r-2,c],[r+2,c],[r,c-2],[r,c+2],[r-2,c-2],[r-2,c+2],[r+2,c-2],[r+2,c+2]
            ];
            for (const [fr, fc] of farStroke) {
              if (fr >= 0 && fr < rows && fc >= 0 && fc < cols && pixelLock[fr][fc] === 1 && strokeNbCount >= 1) {
                bridged = true; break;
              }
            }
          }
        } else {
          // 第3轮（对角线2像素桥接）
          const diag2 = [
            [r-1,c-1,r+1,c+1], [r-1,c+1,r+1,c-1],
            [r-2,c,r+2,c], [r,c-2,r,c+2]
          ];
          for (const [r1,c1,r2,c2] of diag2) {
            if (r1 >= 0 && r1 < rows && c1 >= 0 && c1 < cols &&
                r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols &&
                pixelLock[r1][c1] === 1 && pixelLock[r2][c2] === 1) {
              bridged = true; break;
            }
          }
        }
        if (bridged) {
          const rgb = rawGrid[r][c];
          if (rgb) {
            const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
            if (lum < lumLimit) {
              const darkIdx = pickLockedDarkColor(rgb, {
                allowChromatic: true,
                chromaticMaxLum: Math.min(82, lumLimit - 12),
                chromaticMaxL: 44,
                strictNeutral: lum < 40
              });
              if (darkIdx >= 0) {
                gridData[r][c] = darkIdx;
                pixelLock[r][c] = 1;
              }
            }
          }
        }
      }
    }
  }
  
  // Phase 1d: 拓扑断线修复 — 扫描描边端点(8连通只有1个描边邻居)，尝试延伸连接
  // 这修复耳朵尖端、尾巴末端等单向断线，闭运算无法覆盖的情况
  // ★ 改动：去掉 gridScale 约束，所有尺寸均执行；maxExtend 扩大到 4~5 格
  {
    const maxExtend = gridScale < 0.3 ? 6 : (gridScale < 0.55 ? 5 : (gridScale < 0.75 ? 4 : 3));
    const extendLumLimit = Math.round(92 + gridScale * 10); // 92~102，提升让深灰弧线可桥接
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (pixelLock[r][c] !== 1) continue;
        // 计算描边邻居数
        let strokeNeighborCount = 0;
        for (const [dr, dc] of dirs8) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && pixelLock[nr][nc] === 1) strokeNeighborCount++;
        }
        if (strokeNeighborCount !== 1) continue; // 不是端点
        // 从这个端点出发，沿最暗的方向延伸，看能不能在 maxExtend 格内遇到另一个描边像素
        const stk = [[r, c]];
        const tried = new Set([r * cols + c]);
        for (let step = 0; step < maxExtend; step++) {
          const [cr, cc] = stk[stk.length - 1];
          let bestNr = -1, bestNc = -1, bestLum = 999;
          for (const [dr, dc] of dirs8) {
            const nr = cr + dr, nc = cc + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (tried.has(nr * cols + nc)) continue;
            if (pixelLock[nr][nc] === 1) {
              // 遇到另一个描边像素！回溯桥接
              for (let s = 1; s < stk.length; s++) {
                const [br, bc] = stk[s];
                if (pixelLock[br][bc] === 0) {
                  const brgb = rawGrid[br][bc];
                  if (brgb) {
                    const darkIdx = pickLockedDarkColor(brgb, {
                      allowChromatic: true,
                      chromaticMaxLum: 76,
                      chromaticMaxL: 42,
                      strictNeutral: true
                    });
                    if (darkIdx >= 0) {
                      gridData[br][bc] = darkIdx;
                      pixelLock[br][bc] = 1;
                    }
                  }
                }
              }
              bestNr = -2; break; // 已完成
            }
            const nrgb = rawGrid[nr][nc];
            if (!nrgb) continue;
            const nlum = 0.299 * nrgb[0] + 0.587 * nrgb[1] + 0.114 * nrgb[2];
            if (nlum < bestLum && nlum < extendLumLimit) { bestLum = nlum; bestNr = nr; bestNc = nc; }
          }
          if (bestNr === -2) break; // 已桥接成功
          if (bestNr < 0) break; // 没有暗色候选，放弃
          tried.add(bestNr * cols + bestNc);
          stk.push([bestNr, bestNc]);
        }
      }
    }
  }

  // Phase 1e: 描边孤岛连通补全 v3
  // ★ 核心策略：不依赖"大域+小孤岛"假设，而是对所有相邻域做最短路径桥接
  // 工作原理：
  //   1) 标记所有描边连通域
  //   2) 对每对相邻域（BFS 发现），找最短桥接路径（亮度守门）
  //   3) 按路径长度排序，优先执行最短桥接，合并域
  //   4) 多轮直到稳定
  // 这样无论主域多大、孤岛多大，都能被逐步连接
  {
    const dirs4_1e = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const dirs8_1e = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    const maxBridgeLen_v3 = Math.max(12, Math.round(8 + gridScale * 10)); // 12~18
    const maxBridgeLum_v3 = Math.round(100 + gridScale * 15);              // 100~115
    const pathAvgLumLimit_v3 = 85;

    // 标记所有描边连通域（4连通）
    function labelAllStrokes() {
      const lbl = Array.from({ length: rows }, () => new Int32Array(cols).fill(-1));
      let nextLbl = 0;
      const szMap = new Map();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (pixelLock[r][c] !== 1 || lbl[r][c] >= 0) continue;
          const lb = nextLbl++;
          const q = [[r, c]]; lbl[r][c] = lb;
          let head = 0, cnt = 0;
          while (head < q.length) {
            const [cr, cc] = q[head++]; cnt++;
            for (const [dr, dc] of dirs4_1e) {
              const nr = cr + dr, nc = cc + dc;
              if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
              if (pixelLock[nr][nc] !== 1 || lbl[nr][nc] >= 0) continue;
              lbl[nr][nc] = lb; q.push([nr, nc]);
            }
          }
          szMap.set(lb, cnt);
        }
      }
      return { lbl, szMap, total: nextLbl };
    }

    // 在 lbl 数组里对给定的两个域找最短桥接路径
    // 从 labelA 的边界像素出发 BFS，找到 labelB 的任意像素
    function findShortestBridge(labelA, labelB, lbl) {
      const startPixels = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (lbl[r][c] !== labelA) continue;
          let onBorder = false;
          for (const [dr, dc] of dirs8_1e) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && lbl[nr][nc] !== labelA) {
              onBorder = true; break;
            }
          }
          if (onBorder) startPixels.push([r, c]);
        }
      }
      if (!startPixels.length) return null;

      const visited = new Map();
      const queue = [];
      for (const [r, c] of startPixels) {
        const k = r * cols + c;
        if (!visited.has(k)) { visited.set(k, -1); queue.push([r, c]); }
      }

      let head = 0;
      let depth = 0;
      let bestPath = null;

      while (head < queue.length && depth < maxBridgeLen_v3) {
        const levelEnd = queue.length;
        while (head < levelEnd) {
          const [cr, cc] = queue[head++];
          const curKey = cr * cols + cc;
          for (const [dr, dc] of dirs8_1e) {
            const nr = cr + dr, nc = cc + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            const nKey = nr * cols + nc;
            if (visited.has(nKey)) continue;
            visited.set(nKey, curKey);
            if (pixelLock[nr][nc] === 1 && lbl[nr][nc] === labelB) {
              // 找到！回溯路径，提取中间非锁定像素
              const path = [];
              let cur = curKey;
              let safeCount = 0;
              // 回溯到起点（visited 值为 -1 的节点就是起点）
              while (cur >= 0 && safeCount++ < maxBridgeLen_v3 * 3) {
                const parent = visited.get(cur);
                if (parent === -1 || parent === undefined) break; // 到达起点
                const br = Math.floor(cur / cols), bc = cur % cols;
                if (pixelLock[br][bc] === 0) path.push([br, bc]);
                cur = parent;
              }
              if (!path.length) return []; // 直接相邻，不需要桥接
              // 验证路径质量
              let lumSum = 0, valid = true;
              for (const [br, bc] of path) {
                const rgb = rawGrid[br][bc];
                if (!rgb) { valid = false; break; }
                const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
                if (lum > maxBridgeLum_v3) { valid = false; break; }
                lumSum += lum;
              }
              if (!valid) continue;
              if (path.length > 0 && lumSum / path.length > pathAvgLumLimit_v3) continue;
              return path;
            }
            if (pixelLock[nr][nc] === 0) {
              const nrgb = rawGrid[nr][nc];
              if (!nrgb) continue;
              const nLum = 0.299 * nrgb[0] + 0.587 * nrgb[1] + 0.114 * nrgb[2];
              if (nLum <= maxBridgeLum_v3) queue.push([nr, nc]);
            }
          }
        }
        depth++;
      }
      return null;
    }

    // 最多 3 轮合并
    for (let pass = 0; pass < 3; pass++) {
      const { lbl, szMap, total } = labelAllStrokes();
      if (total <= 1) break;

      // 找所有"几乎相邻"的域对：对每个像素扫描8邻域，发现不同域就记录
      const pairs = new Map(); // "a,b" -> {a, b}
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = lbl[r][c];
          if (a < 0) continue;
          for (const [dr, dc] of dirs8_1e) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            const b = lbl[nr][nc];
            if (b >= 0 && b !== a) {
              const key = Math.min(a, b) + ',' + Math.max(a, b);
              if (!pairs.has(key)) pairs.set(key, { a: Math.min(a, b), b: Math.max(a, b) });
            }
          }
        }
      }

      // 对每对相邻域，尝试找桥接路径
      const bridges = [];
      for (const { a, b } of pairs.values()) {
        const path = findShortestBridge(a, b, lbl);
        if (path !== null) {
          bridges.push({ a, b, path, len: path.length });
        }
      }

      if (!bridges.length) break;

      // 按路径长度排序，最短优先
      bridges.sort((x, y) => x.len - y.len);

      // 执行桥接（Union-Find 追踪合并后的标签）
      const merged = new Map();
      const find = lb => {
        let cur = lb;
        while (merged.has(cur)) cur = merged.get(cur);
        return cur;
      };

      let bridgeCount = 0;
      for (const { a, b, path } of bridges) {
        const ra = find(a), rb = find(b);
        if (ra === rb) continue; // 已合并
        for (const [br, bc] of path) {
          const brgb = rawGrid[br][bc];
          if (!brgb) continue;
          const bLum = 0.299 * brgb[0] + 0.587 * brgb[1] + 0.114 * brgb[2];
          const darkIdx = pickLockedDarkColor(brgb, {
            allowChromatic: true, chromaticMaxLum: Math.min(bLum + 5, maxBridgeLum_v3),
            chromaticMaxL: 48, strictNeutral: bLum < 50
          });
          if (darkIdx >= 0) {
            gridData[br][bc] = darkIdx;
            pixelLock[br][bc] = 1;
            lbl[br][bc] = ra;
          }
        }
        merged.set(rb, ra);
        bridgeCount++;
      }
      if (bridgeCount === 0) break;
    }
  }

  gridData = repairChromaticStrokeLocks(gridData, rawGrid, rows, cols, pixelLock);

  // === LAYER 2: 关键特征层 (Feature Layer) ===
  const featureMask = detectSemanticFeatureMask(gridData, rawGrid, rows, cols, preset.featureProtect || 0.6, isSmallGrid, gridScale);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pixelLock[r][c] === 0 && featureMask[r][c]) {
        pixelLock[r][c] = 2; // Lock as feature (won't be modified by fill layer)
      }
    }
  }

  // === LAYER 3: 填充层 (Fill Layer — only modifies unlocked pixels) ===
  // ★ 所有参数按 gridScale 连续缩放（0=极小图参数最温和，1=大图参数完整）
  // ★ 小图（gridScale<0.12，约29格）：保护小特征——提升 featureMask 彩度门槛覆盖小鼻子/嘴巴
  const rawMinIsland = preset.minIslandSize || 5;
  // 极小图降低 minIslandSize 让小特征免于合并（featureMask 已保护 lock=2，但低彩度区域需更小的合并阈值）
  const featureProtectScale = gridScale < 0.12 ? 0.35 : (gridScale < 0.25 ? 0.40 : 0.40 + gridScale * 0.60 - 0.40 * 0.25);
  const minIslandSize = Math.max(1, Math.round(rawMinIsland * (0.4 + gridScale * 0.6)));
  gridData = mergeSmallIslandsWithLock(gridData, rawGrid, rows, cols, minIslandSize, pixelLock);
  // 第二轮岛屿合并力度按 gridScale 缩放（小图跳过）
  if (gridScale > 0.3) {
    const secondMinIsland = Math.max(2, Math.floor(minIslandSize * (0.4 + gridScale * 0.2)));
    gridData = mergeSmallIslandsWithLock(gridData, rawGrid, rows, cols, secondMinIsland, pixelLock);
  }
  // 边界归一化轮数：gridScale 0→1轮, 0.5→2轮, 1→3轮
  const normPasses = Math.max(1, Math.round(1 + gridScale * 2));
  gridData = normalizeBoundariesWithLock(gridData, rawGrid, rows, cols, pixelLock, normPasses);
  // 相似色合并阈值：gridScale 0→deltaE<4, 0.5→6, 1→8
  const mergeThresh = Math.round(4 + gridScale * 4);
  gridData = mergeSimilarAdjacentBlocksWithLock(gridData, rows, cols, pixelLock, mergeThresh);
  // Dark outlier cleanup: 小图降低力度
  const darkCleanLevel = (preset.darkFringeClean || 0.5) * (0.5 + gridScale * 0.5);
  gridData = cleanupDarkOutlierSpecklesWithLock(gridData, rawGrid, rows, cols, darkCleanLevel, pixelLock);

  // ★ 新增：中性色调噪点清洗 — 利用颜色分析信息纠正映射错误
  // 扫描每个非锁定像素：如果原图像素是中性灰(chroma<6)但被映射到带色调的MARD色(chroma>3且hue在绿/紫等偏色区间)
  // 且周围多数邻居也是中性色，则强制替换为最近的纯中性灰MARD色
  gridData = cleanupNeutralTintNoise(gridData, rawGrid, rows, cols, pixelLock, matchPalette);

  // ★ 注入点3: 手绘风格彩度压制后处理（自适应阈值+肤色保护）
  if (appState.useHandcraftStyle && HANDCRAFT_STYLE_PROFILE) {
    const chromaHints = appState.globalColorHints ? Object.assign({}, appState.globalColorHints) : {};
    chromaHints.gridScale = gridScale;
    if (isSmallGrid) chromaHints.isSmallGrid = true;
    gridData = suppressHighChromaToHandcraft(gridData, rows, cols, pixelLock, matchPalette, chromaHints);
  }

  // ★ 手绘风格评分
  if (appState.useHandcraftStyle && HANDCRAFT_STYLE_PROFILE) {
    appState.handcraftScore = scoreHandcraftSimilarity(gridData, rows, cols);
  }

  return { rawGrid, gridData, rows, cols, featureMask, featureSourceGrid: null, pixelLock };
}


// ========== 中性色调噪点清洗 ==========
// 核心思路：如果原图像素是中性灰但被映射到带色调的MARD色（如H14微绿），
// 且周围邻居也是中性色区域，则强制替换为纯中性灰MARD色。
// 这利用"空间一致性"来纠正单像素级的颜色映射错误。
function cleanupNeutralTintNoise(gridData, rawGrid, rows, cols, pixelLock, palette) {
  if (!gridData || !rawGrid || rows < 3 || cols < 3) return gridData;
  // 预计算所有纯中性灰MARD色号（chroma < 3, L > 30）
  const neutralGrayIndices = [];
  for (let i = 0; i < MARD_PALETTE.length; i++) {
    const p = MARD_PALETTE[i];
    if (p.chroma < 3 && p.L > 30) neutralGrayIndices.push(i);
  }
  if (neutralGrayIndices.length === 0) return gridData;
  // 如果有受限调色板，只从其中选纯灰色
  const searchNeutral = palette ? neutralGrayIndices.filter(i => palette.includes(i)) : neutralGrayIndices;
  if (searchNeutral.length === 0) return gridData;
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  let fixCount = 0;
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (pixelLock[r][c] > 0) continue;
      const idx = gridData[r][c];
      if (idx < 0) continue;
      const p = MARD_PALETTE[idx];
      // 条件1：当前MARD色带有可见色调（chroma > 3）且在绿色/青色方向(hue 90-200)
      if (p.chroma <= 3) continue;
      if (!(p.hue > 90 && p.hue < 200)) continue; // 只清理绿色方向噪点
      // 条件2：当前MARD色是浅色/中性区域（L > 50），排除深色描边区域
      if (p.L <= 50) continue;
      // 条件3：原图像素是中性灰（RGB通道差异小）
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const maxCh = Math.max(rgb[0], rgb[1], rgb[2]);
      const minCh = Math.min(rgb[0], rgb[1], rgb[2]);
      const rgbSpread = maxCh - minCh;
      if (rgbSpread > 20) continue; // RGB通道差异大于20说明确实有颜色，不是噪点
      // 条件4：原图像素的Lab彩度也很低
      const [rL, rA, rB] = rgbToLab(rgb[0], rgb[1], rgb[2]);
      const rawChroma = Math.hypot(rA, rB);
      if (rawChroma > 8) continue;
      // 条件5：周围邻居中多数也是中性色（至少4/8个邻居的MARD色chroma<6或是描边）
      let neutralNbrCount = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const nIdx = gridData[nr][nc];
        if (nIdx < 0) continue;
        const np = MARD_PALETTE[nIdx];
        if (np.chroma < 6 || np.L < 30) neutralNbrCount++; // 纯灰或描边
      }
      if (neutralNbrCount < 4) continue;
      // 替换为最近的纯中性灰MARD色
      let bestNeutral = -1, bestDE = Infinity;
      for (const ni of searchNeutral) {
        const np = MARD_PALETTE[ni];
        const de = deltaE2000FromLab(rL, rA, rB, np.L, np.a, np.b_lab);
        if (de < bestDE) { bestDE = de; bestNeutral = ni; }
      }
      if (bestNeutral >= 0) {
        gridData[r][c] = bestNeutral;
        fixCount++;
      }
    }
  }
  return gridData;
}

// ========== 手绘风格: 彩度压制后处理（自适应阈值+肤色保护） ==========
// 扫描所有非锁定格子，如果 MARD 色的 chroma 过高，尝试替换为同色相低彩度色
// hints 参数来自 preAnalyzeGlobalColorDistribution 增强版，null时回退到原始逻辑
function suppressHighChromaToHandcraft(gridData, rows, cols, pixelLock, palette, hints) {
  if (!HANDCRAFT_STYLE_PROFILE) return gridData;
  // ★ 自适应阈值计算（基于颜色分析数据）
  // 基础阈值18（原始值），根据图片色调动态调整
  let threshold = 18;
  if (hints) {
    // 暖色调图片(warmRatio > 0.4)：阈值提升，保护肤色和暖棕色
    if (hints.warmRatio > 0.4) threshold += 10;
    // 高彩度图片：阈值跟随原图彩度
    if (hints.avgChroma > 15) threshold = Math.max(threshold, hints.avgChroma * 1.3);
    // 有肤色的图片要更宽松
    if (hints.skinRatio > 0.05) threshold = Math.max(threshold, 30);
  } else {
    // 回退到原始逻辑
    const chromaThreshold = HANDCRAFT_STYLE_PROFILE.chromaStats.p90 || 39;
    const aggressiveThreshold = HANDCRAFT_STYLE_PROFILE.chromaStats.mean + HANDCRAFT_STYLE_PROFILE.chromaStats.std * 1.5;
    threshold = Math.min(chromaThreshold, Math.max(18, aggressiveThreshold));
  }
  // 阈值范围 [18, 40]
  threshold = Math.max(18, Math.min(40, threshold));
  // ★ 按 gridScale 连续放宽（小图+7，中图+3，大图+0）
  const gs = (hints && typeof hints.gridScale === 'number') ? hints.gridScale : (hints && hints.isSmallGrid ? 0.15 : 1);
  threshold = Math.min(50, threshold + Math.round((1 - gs) * 7));
  const searchPalette = palette || ALL_INDICES;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pixelLock && pixelLock[r][c] > 0) continue; // 不修改锁定像素
      const idx = gridData[r][c];
      if (idx < 0) continue;
      const p = MARD_PALETTE[idx];
      if (p.chroma <= threshold) continue;
      // ★ 肤色豁免：hue 8-78, chroma 8-36 的色号不压制（保护肤色/暖棕色）
      if (p.hue >= 8 && p.hue <= 78 && p.chroma >= 8 && p.chroma <= 36) continue;
      // 寻找同色相方向但更低彩度的替代色
      let bestAlt = -1, bestScore = Infinity;
      for (const altIdx of searchPalette) {
        if (altIdx === idx) continue;
        const alt = MARD_PALETTE[altIdx];
        if (alt.chroma >= p.chroma) continue; // 必须更低彩度
        if (alt.chroma > threshold) continue; // 替代色也必须在阈值内
        // 色相距离不能太远（保持颜色方向一致）
        const hueDist = Math.min(Math.abs(p.hue - alt.hue), 360 - Math.abs(p.hue - alt.hue));
        if (hueDist > 35) continue;
        // 亮度不能差太远
        const lumDiff = Math.abs(p.L - alt.L);
        if (lumDiff > 20) continue;
        // 综合评分：色相距离 + 彩度差 + 亮度差（越小越好）
        const score = hueDist * 0.5 + Math.abs(p.chroma - alt.chroma) * 0.3 + lumDiff * 0.2;
        // 手绘高频色获得 bonus（保留方向匹配逻辑）
        let bonus = 0;
        if (HANDCRAFT_PREFERRED_SET.has(altIdx)) {
          if (p.chroma < 12) bonus = 3;
          else if (hueDist < 45) bonus = 2;
        }
        if (score - bonus < bestScore) { bestScore = score - bonus; bestAlt = altIdx; }
      }
      if (bestAlt >= 0) {
        gridData[r][c] = bestAlt;
      }
    }
  }
  return gridData;
}

// Lock-aware variants of post-processing functions
function mergeSmallIslandsWithLock(gridData, rawGrid, rows, cols, minSize, pixelLock) {
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  function bfs(sr, sc) {
    const color = gridData[sr][sc];
    const queue = [[sr, sc]];
    let head = 0;
    const cells = [];
    visited[sr][sc] = 1;
    let lockedCount = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      cells.push([r, c]);
      if (pixelLock[r][c] > 0) lockedCount++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gridData[nr][nc] === color) {
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
    }
    return { cells, lockedCount };
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c] || gridData[r][c] === -1) continue;
      const { cells, lockedCount } = bfs(r, c);
      if (lockedCount > cells.length * 0.5) continue; // Majority locked → skip
      if (cells.length >= minSize) continue;
      // Dark island protection
      const islandColor = gridData[cells[0][0]][cells[0][1]];
      const islandPal = islandColor >= 0 ? MARD_PALETTE[islandColor] : null;
      const islandIsDark = islandPal && islandPal.L < 38;
      const neighborFreq = new Map();
      for (const [cr, cc] of cells) {
        for (const [dr, dc] of dirs) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gridData[nr][nc] !== gridData[cr][cc] && gridData[nr][nc] !== -1) {
            neighborFreq.set(gridData[nr][nc], (neighborFreq.get(gridData[nr][nc]) || 0) + 1);
          }
        }
      }
      if (neighborFreq.size === 0) continue;
      let bestColor = gridData[r][c], bestCount = 0;
      if (islandIsDark) {
        let bestDarkColor = -1, bestDarkCount = 0;
        for (const [color, count] of neighborFreq) {
          const nPal = MARD_PALETTE[color];
          if (nPal && nPal.L < 50 && count > bestDarkCount) { bestDarkCount = count; bestDarkColor = color; }
        }
        if (bestDarkColor >= 0) bestColor = bestDarkColor;
        else continue;
      } else {
        for (const [color, count] of neighborFreq) {
          if (count > bestCount) { bestCount = count; bestColor = color; }
        }
      }
      for (const [cr, cc] of cells) {
        if (pixelLock[cr][cc] === 0) gridData[cr][cc] = bestColor; // Only modify unlocked
      }
    }
  }
  return gridData;
}

function normalizeBoundariesWithLock(gridData, rawGrid, rows, cols, pixelLock, maxPasses) {
  const passes = maxPasses || 3;
  const out = gridData.map(row => [...row]);
  const dirs4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let changed = true;
  for (let pass = 0; pass < passes && changed; pass++) {
    changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pixelLock[r][c] > 0) continue; // Skip locked pixels
        const myIdx = out[r][c];
        if (myIdx < 0) continue;
        const rgb = rawGrid[r][c];
        if (!rgb) continue;
        const neighborColors = new Map();
        for (const [dr, dc] of dirs4) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const nIdx = out[nr][nc];
          if (nIdx >= 0 && nIdx !== myIdx) neighborColors.set(nIdx, (neighborColors.get(nIdx) || 0) + 1);
        }
        if (neighborColors.size === 0) continue;
        const [L, a, bVal] = rgbToLab(rgb[0], rgb[1], rgb[2]);
        const myPal = MARD_PALETTE[myIdx];
        const myDist = deltaE2000FromLab(L, a, bVal, myPal.L, myPal.a, myPal.b_lab);
        let bestNIdx = -1, bestNCount = 0;
        for (const [nIdx, count] of neighborColors) {
          if (count > bestNCount) { bestNCount = count; bestNIdx = nIdx; }
        }
        if (bestNIdx < 0) continue;
        const nPal = MARD_PALETTE[bestNIdx];
        const nDist = deltaE2000FromLab(L, a, bVal, nPal.L, nPal.a, nPal.b_lab);
        if (nDist < myDist - 3) {
          out[r][c] = bestNIdx;
          changed = true;
        }
      }
    }
  }
  return out;
}

function mergeSimilarAdjacentBlocksWithLock(gridData, rows, cols, pixelLock, mergeThreshold) {
  const threshold = mergeThreshold || 8;
  const out = gridData.map(row => [...row]);
  const dirs4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const colorArea = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = out[r][c];
      if (idx >= 0) colorArea.set(idx, (colorArea.get(idx) || 0) + 1);
    }
  }
  const adjacency = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = out[r][c];
      if (a < 0) continue;
      for (const [dr, dc] of dirs4) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const b = out[nr][nc];
        if (b >= 0 && b !== a) adjacency.add(Math.min(a, b) + ',' + Math.max(a, b));
      }
    }
  }
  const mergeMap = new Map();
  for (const key of adjacency) {
    const [aStr, bStr] = key.split(',');
    let a = parseInt(aStr), b = parseInt(bStr);
    while (mergeMap.has(a)) a = mergeMap.get(a);
    while (mergeMap.has(b)) b = mergeMap.get(b);
    if (a === b) continue;
    const pa = MARD_PALETTE[a], pb = MARD_PALETTE[b];
    const dist = deltaE2000FromLab(pa.L, pa.a, pa.b_lab, pb.L, pb.a, pb.b_lab);
    if (dist < threshold) {
      const areaA = colorArea.get(a) || 0, areaB = colorArea.get(b) || 0;
      if (areaA >= areaB) mergeMap.set(b, a);
      else mergeMap.set(a, b);
    }
  }
  if (mergeMap.size === 0) return out;
  for (const [from, to] of mergeMap) {
    let resolved = to;
    while (mergeMap.has(resolved)) resolved = mergeMap.get(resolved);
    mergeMap.set(from, resolved);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pixelLock[r][c] > 0) continue; // Skip locked
      const idx = out[r][c];
      if (idx >= 0 && mergeMap.has(idx)) out[r][c] = mergeMap.get(idx);
    }
  }
  return out;
}

function cleanupDarkOutlierSpecklesWithLock(gridData, rawGrid, rows, cols, level, pixelLock) {
  if (!gridData || !rawGrid || rows < 3 || cols < 3) return gridData;
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (pixelLock[r][c] > 0) continue; // Skip locked
      const curIdx = out[r][c];
      const src = rawGrid[r][c];
      if (curIdx < 0 || !src) continue;
      const srcLum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
      if (srcLum > (132 - t * 24)) continue;
      const cur = MARD_PALETTE[curIdx];
      const freq = new Map();
      let valid = 0, sameCnt = 0, darkNeutralNb = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        if (nIdx < 0) continue;
        valid++;
        if (nIdx === curIdx) sameCnt++;
        freq.set(nIdx, (freq.get(nIdx) || 0) + 1);
        const nPal = MARD_PALETTE[nIdx];
        if (nPal.L < 58 && nPal.chroma < 18) darkNeutralNb++;
      }
      // ★ 预过滤条件放宽：灰色噪点在彩色区域中也需要被检测到
      const chromaticNbCount = valid - darkNeutralNb;
      const mightBeGrayIsland = cur.chroma < 10 && sameCnt < 2 && chromaticNbCount >= 4;
      if (valid < 5 || sameCnt >= 2) continue;
      if (darkNeutralNb < 4 && !mightBeGrayIsland) continue;
      let domIdx = curIdx, domCnt = 0;
      for (const [idx, cnt] of freq) {
        if (idx !== curIdx && cnt > domCnt) { domIdx = idx; domCnt = cnt; }
      }
      if (domIdx === curIdx || domCnt < 3) continue;
      const dom = MARD_PALETTE[domIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const srcChroma = Math.hypot(sA, sB);
      const curDist = deltaE2000FromLab(sL, sA, sB, cur.L, cur.a, cur.b_lab);
      const domDist = deltaE2000FromLab(sL, sA, sB, dom.L, dom.a, dom.b_lab);
      const hueGap = Math.min(Math.abs(cur.hue - dom.hue), 360 - Math.abs(cur.hue - dom.hue));
      const warmHue = (cur.hue <= 72 || cur.hue >= 318);
      const warmOutlier = warmHue && cur.chroma > 14 && dom.chroma < 16 && srcChroma < 22;
      const grayLiftOutlier = cur.chroma < 11 && cur.L > dom.L + (9 - t * 2) && dom.L < 45 && srcLum < 110;
      const satJumpOutlier = cur.chroma > dom.chroma + 16 && srcChroma < 24 && hueGap > 28;
      // ★ 新增：灰色孤岛检测 — 当前像素是低彩度灰色，但多数邻居是彩色
      const grayInChromaticOutlier = cur.chroma < 10 && chromaticNbCount >= 4 && dom.chroma > 12;
      if (!warmOutlier && !grayLiftOutlier && !satJumpOutlier && !grayInChromaticOutlier) continue;
      // 灰色孤岛替换条件更宽松（只要domDist不超过curDist的2倍+5就替换，因为视觉一致性比精确匹配更重要）
      if (grayInChromaticOutlier) {
        if (domDist <= curDist * 2.0 + 5) out[r][c] = domIdx;
      } else {
        if (domDist <= curDist * (1.14 + (1 - t) * 0.05) + 1.2) out[r][c] = domIdx;
      }
    }
  }
  return out;
}

function getCompatColorBudget(similarMergeLevel) {
  const level = Math.max(0, Math.min(100, similarMergeLevel || 0));
  return Math.max(8, Math.min(36, 34 - Math.round(level * 0.14)));
}

// Phase 1.3: Dynamic color budget for V2 pipeline
// Separates background from foreground to avoid wasting color slots on bg
function getDynamicColorBudget(rawGrid, rows, cols, baseBudget) {
  const totalPixels = rows * cols;
  if (totalPixels === 0) return baseBudget;
  // ★ 边框宽度按网格尺寸自适应（小网格1像素，大网格2像素）
  const gScale = Math.max(0, Math.min(1, (totalPixels - 400) / (14000 - 400)));
  const borderWidth = gScale < 0.4 ? 1 : 2;
  const borderBuckets = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isBorder = r < borderWidth || r >= rows - borderWidth || c < borderWidth || c >= cols - borderWidth;
      if (!isBorder) continue;
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const key = ((rgb[0] >> 5) << 6) | ((rgb[1] >> 5) << 3) | (rgb[2] >> 5);
      if (!borderBuckets.has(key)) borderBuckets.set(key, { count: 0, r: 0, g: 0, b: 0 });
      const bk = borderBuckets.get(key);
      bk.count++; bk.r += rgb[0]; bk.g += rgb[1]; bk.b += rgb[2];
    }
  }
  if (borderBuckets.size === 0) return baseBudget;
  // Find dominant border color
  let bestBk = null, bestCount = 0;
  for (const bk of borderBuckets.values()) {
    if (bk.count > bestCount) { bestCount = bk.count; bestBk = bk; }
  }
  const bgR = Math.round(bestBk.r / bestBk.count);
  const bgG = Math.round(bestBk.g / bestBk.count);
  const bgB = Math.round(bestBk.b / bestBk.count);
  // Count how many grid cells match this background color (threshold: RGB distance < 40)
  let bgPixelCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const dist = Math.abs(rgb[0] - bgR) + Math.abs(rgb[1] - bgG) + Math.abs(rgb[2] - bgB);
      if (dist < 40) bgPixelCount++;
    }
  }
  const bgRatio = bgPixelCount / totalPixels;
  // If background > 40%, allocate 1 slot for bg, rest for foreground
  // ★ 砍幅按 gridScale 缩放：小图砍10%，大图砍20%
  if (bgRatio > 0.4) {
    const cutRatio = 0.1 + gScale * 0.1; // 小图砍10%, 大图砍20%
    return Math.max(4, Math.min(baseBudget, Math.round(baseBudget * (1 - cutRatio))));
  }
  return baseBudget;
}

function getPostMergeKeepCount(similarMergeLevel, usedColorCount) {
  const level = Math.max(0, Math.min(100, similarMergeLevel || 0));
  if (level <= 0 || usedColorCount <= 1) return usedColorCount;
  if (usedColorCount <= 8) return usedColorCount;
  if (usedColorCount <= 12) {
    const mergeFactor = Math.pow(level / 100, 0.72);
    const keepByRatio = Math.round(usedColorCount * (1 - 0.24 * mergeFactor));
    return Math.max(usedColorCount - 1, Math.min(usedColorCount, keepByRatio));
  }
  const minKeep = Math.min(4, Math.max(1, usedColorCount));
  const maxKeep = Math.max(1, usedColorCount);
  const mergeFactor = Math.pow(level / 100, 0.78);
  const keepByRatio = Math.round(maxKeep * (1 - 0.68 * mergeFactor));
  return Math.max(minKeep, Math.min(maxKeep, keepByRatio));
}
function getUserSimplifyKeepCount(simplifyLevel, usedColorCount) {
  const level = Math.max(0, Math.min(100, simplifyLevel || 0));
  if (level <= 0 || usedColorCount <= 1) return usedColorCount;
  const minKeep = usedColorCount <= 6 ? Math.max(2, usedColorCount - 1) : Math.max(4, Math.min(8, Math.round(usedColorCount * 0.28)));
  const mergeFactor = Math.pow(level / 100, 0.62);
  const keepByRatio = Math.round(usedColorCount * (1 - 0.9 * mergeFactor));
  return Math.max(minKeep, Math.min(usedColorCount, keepByRatio));
}
function applyUserColorSimplify(gridData, rawGrid, rows, cols, simplifyLevel, featureMask) {
  if (!gridData || !rawGrid || rows <= 0 || cols <= 0) return gridData;
  const freq = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = gridData[r][c];
      if (idx >= 0) freq.set(idx, (freq.get(idx) || 0) + 1);
    }
  }
  const used = freq.size;
  const keepCount = getUserSimplifyKeepCount(simplifyLevel, used);
  if (keepCount >= used) return gridData;
  const keepIndices = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, keepCount)
    .map(([idx]) => idx)
    .sort((a, b) => a - b);
  if (keepIndices.length === 0) return gridData;
  const rgbRemap = new Map();
  const out = gridData.map(row => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const srcIdx = gridData[r][c];
      if (srcIdx < 0) continue;
      const srcRaw = rawGrid[r][c];
      if (!srcRaw) continue;
      const key = `${srcRaw[0]},${srcRaw[1]},${srcRaw[2]}`;
      let mapped = rgbRemap.get(key);
      if (mapped == null) {
        mapped = findNearestColor(srcRaw[0], srcRaw[1], srcRaw[2], keepIndices);
        rgbRemap.set(key, mapped);
      }
      out[r][c] = mapped;
    }
  }
  return out;
}
function applySimilarMergeByPaletteTop(gridData, rawGrid, rows, cols, similarMergeLevel) {
  if (!gridData || !rawGrid || rows <= 0 || cols <= 0) return gridData;
  const freq = new Map();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = gridData[r][c];
      if (idx >= 0) freq.set(idx, (freq.get(idx) || 0) + 1);
    }
  }
  const used = freq.size;
  if (used <= 1) return gridData;
  const keepCount = getPostMergeKeepCount(similarMergeLevel, used);
  if (keepCount >= used) return gridData;
  const keepIndices = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, keepCount)
    .map(([idx]) => idx)
    .sort((a, b) => a - b);
  if (keepIndices.length === 0) return gridData;
  const directRemap = new Map();
  function remapIndexToKeep(srcIdx) {
    if (directRemap.has(srcIdx)) return directRemap.get(srcIdx);
    const src = MARD_PALETTE[srcIdx];
    if (!src) return srcIdx;
    let best = keepIndices[0];
    let bestD = Infinity;
    for (const kIdx of keepIndices) {
      const k = MARD_PALETTE[kIdx];
      if (!k) continue;
      const d = deltaE2000FromLab(src.L, src.a, src.b_lab, k.L, k.a, k.b_lab);
      if (d < bestD) {
        bestD = d;
        best = kIdx;
      }
    }
    directRemap.set(srcIdx, best);
    return best;
  }
  const rgbRemap = new Map();
  const out = gridData.map(row => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const srcIdx = gridData[r][c];
      if (srcIdx < 0) continue;
      const srcRaw = rawGrid[r][c];
      if (!srcRaw) {
        out[r][c] = remapIndexToKeep(srcIdx);
        continue;
      }
      const key = `${srcRaw[0]},${srcRaw[1]},${srcRaw[2]}`;
      let mapped = rgbRemap.get(key);
      if (mapped == null) {
        mapped = findNearestColor(srcRaw[0], srcRaw[1], srcRaw[2], keepIndices);
        rgbRemap.set(key, mapped);
      }
      if (mapped !== srcIdx) {
        const srcPal = MARD_PALETTE[srcIdx];
        const mappedPal = MARD_PALETTE[mapped];
        let sameNeighbors = 0;
        let strongEdgeNeighbors = 0;
        let darkStructureNeighbors = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            const nIdx = gridData[nr][nc];
            if (nIdx < 0) continue;
            if (nIdx === srcIdx) sameNeighbors++;
            const nPal = MARD_PALETTE[nIdx];
            if (nPal && nPal.L < 42) darkStructureNeighbors++;
            const nRaw = rawGrid[nr][nc];
            if (nRaw) {
              const contrast = Math.abs(srcRaw[0] - nRaw[0]) + Math.abs(srcRaw[1] - nRaw[1]) + Math.abs(srcRaw[2] - nRaw[2]);
              if (contrast > 74) strongEdgeNeighbors++;
            }
          }
        }
        const preserveLowColorBoundary = used <= 12 && sameNeighbors >= 1 && strongEdgeNeighbors >= 2;
        const preserveDarkSeparation = srcPal && mappedPal && srcPal.L < 48 && mappedPal.L > srcPal.L + 8 && darkStructureNeighbors >= 3;
        const preserveWarmDarkVsNeutral = srcPal && mappedPal && srcPal.L < 48 && mappedPal.L < 52 && srcPal.chroma >= 8 && mappedPal.chroma < 8;
        const preserveWarmDarkVsDarkWarm = srcPal && mappedPal && srcPal.L < 52 && mappedPal.L < 52 && srcPal.chroma >= 8 && mappedPal.chroma >= 8 && Math.min(Math.abs(srcPal.hue - mappedPal.hue), 360 - Math.abs(srcPal.hue - mappedPal.hue)) > 16;
        if (preserveLowColorBoundary || preserveDarkSeparation || preserveWarmDarkVsNeutral || preserveWarmDarkVsDarkWarm) {
          out[r][c] = srcIdx;
          continue;
        }
      }
      out[r][c] = mapped;
    }
  }
  return out;
}
function getResolutionTuning(pixN) {
  const n = Math.max(10, Math.min(200, Number(pixN) || 39));
  if (n >= 120) {
    return {
      sampleProtectScale: 0.42,
      mergeScale: 0.26,
      refineScale: 0.45,
      fringeScale: 0.55,
      quantizeRelax: 2,
      colorFidelity: 0.72
    };
  }
  if (n >= 87) {
    return {
      sampleProtectScale: 0.5,
      mergeScale: 0.38,
      refineScale: 0.58,
      fringeScale: 0.7,
      quantizeRelax: 1,
      colorFidelity: 0.56
    };
  }
  if (n >= 58) {
    return {
      sampleProtectScale: 0.7,
      mergeScale: 0.72,
      refineScale: 0.82,
      fringeScale: 0.88,
      quantizeRelax: 0,
      colorFidelity: 0.22
    };
  }
  return {
    sampleProtectScale: 1,
    mergeScale: 1,
    refineScale: 1,
    fringeScale: 1,
      quantizeRelax: 0,
    colorFidelity: 0
  };
}
function applyLargeGridColorFidelity(gridData, rawGrid, rows, cols, amount, featureMask) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  if (!gridData || !rawGrid || rows <= 0 || cols <= 0 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const cur = MARD_PALETTE[curIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const curDist = deltaE2000FromLab(sL, sA, sB, cur.L, cur.a, cur.b_lab);
      if (curDist < (6.8 + (1 - t) * 2.4)) continue;
      let lowContrastNeighbors = 0;
      let totalNeighbors = 0;
      for (const [dr, dc] of dirs4) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const nRaw = rawGrid[nr][nc];
        if (!nRaw) continue;
        totalNeighbors++;
        const contrast = Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        if (contrast < (42 + t * 10)) lowContrastNeighbors++;
      }
      if (totalNeighbors > 0 && lowContrastNeighbors / totalNeighbors < 0.5) continue;
      const remapIdx = findNearestColor(src[0], src[1], src[2], null);
      if (remapIdx < 0 || remapIdx === curIdx) continue;
      const remap = MARD_PALETTE[remapIdx];
      const remapDist = deltaE2000FromLab(sL, sA, sB, remap.L, remap.a, remap.b_lab);
      if (remapDist + 1.1 < curDist) {
        out[r][c] = remapIdx;
      }
    }
  }
  return out;
}
function isSkinLikeRaw(rgb) {
  if (!rgb) return false;
  const [L, a, b] = rgbToLab(rgb[0], rgb[1], rgb[2]);
  const chroma = Math.hypot(a, b);
  const hue = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
  const warm = hue >= 8 && hue <= 78;
  return warm && L >= 58 && L <= 92 && chroma >= 8 && chroma <= 36;
}
function isWarmDarkRaw(rgb) {
  if (!rgb) return false;
  const [L, a, b] = rgbToLab(rgb[0], rgb[1], rgb[2]);
  const chroma = Math.hypot(a, b);
  const hue = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
  const warm = hue <= 105 || hue >= 315;
  return warm && L < 62 && chroma >= 4.5;
}
function isNeutralDarkRaw(rgb) {
  if (!rgb) return false;
  const [L, a, b] = rgbToLab(rgb[0], rgb[1], rgb[2]);
  const chroma = Math.hypot(a, b);
  return L < 62 && chroma < 8.5;
}
function stabilizeHairLikeWarmDarkRegions(gridData, rawGrid, rows, cols, settings, featureMask) {
  const t = Math.max(0, Math.min(1, Number(settings && settings.detect) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const paletteLevels = Math.max(2, Math.min(3, Number(settings && settings.paletteLevels) || 3));
  const neutralReject = Math.max(0, Math.min(1, Number(settings && settings.neutralReject) || 0));
  const smoothStrength = Math.max(0, Math.min(1, Number(settings && settings.smooth) || 0));
  const boundaryProtect = Math.max(0, Math.min(1, Number(settings && settings.boundaryProtect) || 0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c]) continue;
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const src = rawGrid[r][c];
      const idx = out[r][c];
      if (idx < 0 || !isWarmDarkRaw(src)) continue;
      const queue = [[r, c]];
      const cells = [];
      visited[r][c] = 1;
      let minR = r, maxR = r, minC = c, maxC = c;
      let skinAdj = 0;
      let boundaryContrast = 0;
      let boundaryCount = 0;
      let avgL = 0, avgA = 0, avgB = 0;
      const regionFreq = new Map();
      let head = 0;
      while (head < queue.length) {
        const [cr, cc] = queue[head++];
        cells.push([cr, cc]);
        minR = Math.min(minR, cr); maxR = Math.max(maxR, cr);
        minC = Math.min(minC, cc); maxC = Math.max(maxC, cc);
        const curSrc = rawGrid[cr][cc];
        const [L, a, b] = rgbToLab(curSrc[0], curSrc[1], curSrc[2]);
        avgL += L; avgA += a; avgB += b;
        regionFreq.set(out[cr][cc], (regionFreq.get(out[cr][cc]) || 0) + 1);
        for (const [dr, dc] of dirs4) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) continue;
          if (featureMask && featureMask[nr] && featureMask[nr][nc]) continue;
          if (out[nr][nc] < 0 || !isWarmDarkRaw(rawGrid[nr][nc])) continue;
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
        for (const [dr, dc] of dirs8) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (isSkinLikeRaw(rawGrid[nr][nc])) skinAdj++;
          if (Math.abs(dr) + Math.abs(dc) !== 1) continue;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !(isWarmDarkRaw(rawGrid[nr][nc]) && out[nr][nc] >= 0)) {
            const nRaw = rawGrid[nr][nc];
            if (curSrc && nRaw) {
              boundaryContrast += Math.abs(curSrc[0] - nRaw[0]) + Math.abs(curSrc[1] - nRaw[1]) + Math.abs(curSrc[2] - nRaw[2]);
              boundaryCount++;
            }
          }
        }
      }
      if (cells.length < 4) continue;
      const boxH = maxR - minR + 1;
      const boxW = maxC - minC + 1;
      const centroidY = (minR + maxR) / 2;
      const avgContrast = boundaryContrast / Math.max(1, boundaryCount);
      const meanL = avgL / cells.length;
      const meanChroma = Math.hypot(avgA / cells.length, avgB / cells.length);
      const hairLike = (skinAdj >= 2 || centroidY < rows * 0.62) && boxH >= 2 && boxW >= 2 && avgContrast > (24 - t * 4) && meanL < 56 && meanChroma >= 4.8;
      if (!hairLike) continue;
      const avgRgb = cells.reduce((acc, [rr, cc]) => {
        const rgb = rawGrid[rr][cc];
        acc[0] += rgb[0]; acc[1] += rgb[1]; acc[2] += rgb[2];
        return acc;
      }, [0, 0, 0]).map(v => v / cells.length);
      const warmRegionIndices = [...regionFreq.entries()]
        .map(([idx, count]) => ({ idx, count, pal: MARD_PALETTE[idx] }))
        .filter(item => item.pal && ((item.pal.hue <= 105 || item.pal.hue >= 315) && item.pal.L < 64 && item.pal.chroma >= 4.5))
        .sort((a, b) => b.count - a.count)
        .map(item => item.idx);
      const allowCount = paletteLevels;
      const allowed = [];
      for (const idxCandidate of warmRegionIndices) {
        if (!allowed.includes(idxCandidate)) allowed.push(idxCandidate);
        if (allowed.length >= allowCount) break;
      }
      const nearestWarm = findNearestColor(avgRgb[0], avgRgb[1], avgRgb[2], DARK_WARM_INDICES);
      if (nearestWarm >= 0 && !allowed.includes(nearestWarm)) allowed.push(nearestWarm);
      while (allowed.length > allowCount) allowed.pop();
      if (allowed.length === 0) continue;
      const neutralRejectL = 54 + neutralReject * 6;
      const neutralRejectChroma = 7.5 + neutralReject * 2.5;
      for (const [rr, cc] of cells) {
        const curIdx2 = out[rr][cc];
        const curPal = MARD_PALETTE[curIdx2];
        const srcRgb = rawGrid[rr][cc];
        let boundaryCell = false;
        let localContrast = 0;
        let contrastN = 0;
        for (const [dr, dc] of dirs4) {
          const nr = rr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (!(isWarmDarkRaw(rawGrid[nr][nc]) && out[nr][nc] >= 0)) boundaryCell = true;
          const nRaw = rawGrid[nr][nc];
          if (nRaw) {
            localContrast += Math.abs(srcRgb[0] - nRaw[0]) + Math.abs(srcRgb[1] - nRaw[1]) + Math.abs(srcRgb[2] - nRaw[2]);
            contrastN++;
          }
        }
        const avgLocalContrast = localContrast / Math.max(1, contrastN);
        if (boundaryCell && avgLocalContrast > (82 + boundaryProtect * 24)) continue;
        const filteredAllowed = allowed.filter(idx => {
          const pal = MARD_PALETTE[idx];
          if (!pal) return false;
          if (pal.chroma < neutralRejectChroma && pal.L < neutralRejectL) return false;
          return true;
        });
        const finalAllowed = filteredAllowed.length > 0 ? filteredAllowed : allowed;
        const nextIdx = findNearestColor(srcRgb[0], srcRgb[1], srcRgb[2], finalAllowed);
        if (nextIdx < 0 || nextIdx === curIdx2) continue;
        const nextPal = MARD_PALETTE[nextIdx];
        if (curPal && nextPal && Math.min(Math.abs(curPal.hue - nextPal.hue), 360 - Math.abs(curPal.hue - nextPal.hue)) > 28 && !allowed.includes(curIdx2)) continue;
        const [sL2, sA2, sB2] = rgbToLab(srcRgb[0], srcRgb[1], srcRgb[2]);
        const curDist2 = deltaE2000FromLab(sL2, sA2, sB2, curPal.L, curPal.a, curPal.b_lab);
        const nextDist2 = deltaE2000FromLab(sL2, sA2, sB2, nextPal.L, nextPal.a, nextPal.b_lab);
        if (nextDist2 <= curDist2 * (1.08 + smoothStrength * 0.16) + 1.2) {
          out[rr][cc] = nextIdx;
        }
      }
    }
  }
  return out;
}
function cleanupFigureBoundaryNoise(gridData, rawGrid, rows, cols, amount, featureMask) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      const curPal = MARD_PALETTE[curIdx];
      const rawWarmDark = isWarmDarkRaw(src);
      const rawNeutralDark = isNeutralDarkRaw(src);
      const rawSkin = isSkinLikeRaw(src);
      if (rawSkin) continue;
      let skinAdj = 0;
      let warmAdj = 0;
      let neutralAdj = 0;
      let sameAdj = 0;
      let bgAdj = 0;
      let localContrast = 0;
      let localCount = 0;
      const warmFreq = new Map();
      const neutralFreq = new Map();
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        const nRaw = rawGrid[nr][nc];
        if (nIdx < 0) { bgAdj++; continue; }
        if (!nRaw) continue;
        if (nIdx === curIdx) sameAdj++;
        if (isSkinLikeRaw(nRaw)) skinAdj++;
        const nPal = MARD_PALETTE[nIdx];
        const warmLike = (nPal.hue <= 110 || nPal.hue >= 315) && nPal.L < 66 && nPal.chroma >= 4.5;
        const neutralLike = nPal.L < 66 && nPal.chroma < 9.5;
        if (warmLike) {
          warmAdj++;
          warmFreq.set(nIdx, (warmFreq.get(nIdx) || 0) + 1);
        }
        if (neutralLike) {
          neutralAdj++;
          neutralFreq.set(nIdx, (neutralFreq.get(nIdx) || 0) + 1);
        }
        localContrast += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        localCount++;
      }
      const boundaryZone = skinAdj >= 1 || bgAdj >= 2;
      if (!boundaryZone) continue;
      if (sameAdj >= 4) continue;
      const avgContrast = localContrast / Math.max(1, localCount);
      const curWarmLike = (curPal.hue <= 110 || curPal.hue >= 315) && curPal.L < 66 && curPal.chroma >= 4.5;
      const curNeutralLike = curPal.L < 66 && curPal.chroma < 9.5;
      let warmTarget = -1, warmTargetCnt = 0;
      for (const [idx, cnt] of warmFreq) {
        if (cnt > warmTargetCnt) { warmTarget = idx; warmTargetCnt = cnt; }
      }
      let neutralTarget = -1, neutralTargetCnt = 0;
      for (const [idx, cnt] of neutralFreq) {
        if (cnt > neutralTargetCnt) { neutralTarget = idx; neutralTargetCnt = cnt; }
      }
      const hairBleedToShoulder = curWarmLike && !rawWarmDark && neutralAdj >= Math.max(2, warmAdj) && avgContrast < (88 - t * 10);
      const shoulderBleedToHair = curNeutralLike && rawWarmDark && warmAdj >= Math.max(2, neutralAdj) && avgContrast < (84 - t * 8);
      const boundarySpeckle = !rawWarmDark && !rawNeutralDark && (warmAdj >= 2 || neutralAdj >= 2) && avgContrast < (72 - t * 8);
      if (hairBleedToShoulder && neutralTarget >= 0) {
        out[r][c] = neutralTarget;
        continue;
      }
      if (shoulderBleedToHair && warmTarget >= 0) {
        out[r][c] = warmTarget;
        continue;
      }
      if (boundarySpeckle) {
        if (neutralAdj > warmAdj && neutralTarget >= 0) out[r][c] = neutralTarget;
        else if (warmTarget >= 0) out[r][c] = warmTarget;
      }
    }
  }
  return out;
}
function cleanupClothInteriorNoise(gridData, rawGrid, rows, cols, amount, featureMask) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      if (!isNeutralDarkRaw(src)) continue;
      const curPal = MARD_PALETTE[curIdx];
      if (!curPal || curPal.chroma > 12 || curPal.L > 60) continue;
      let neutralAdj = 0;
      let sameAdj = 0;
      let skinAdj = 0;
      let bgAdj = 0;
      let warmAdj = 0;
      let localContrast = 0;
      let localCount = 0;
      const neutralFreq = new Map();
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        const nRaw = rawGrid[nr][nc];
        if (nIdx < 0) { bgAdj++; continue; }
        if (!nRaw) continue;
        if (nIdx === curIdx) sameAdj++;
        if (isSkinLikeRaw(nRaw)) skinAdj++;
        if (isWarmDarkRaw(nRaw)) warmAdj++;
        if (isNeutralDarkRaw(nRaw)) {
          neutralAdj++;
          neutralFreq.set(nIdx, (neutralFreq.get(nIdx) || 0) + 1);
        }
        localContrast += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        localCount++;
      }
      const interiorZone = skinAdj === 0 && bgAdj <= 1 && warmAdj <= 2;
      if (!interiorZone) continue;
      if (neutralAdj < 5) continue;
      if (sameAdj >= 4) continue;
      const avgContrast = localContrast / Math.max(1, localCount);
      if (avgContrast > (64 - t * 10)) continue;
      let neutralTarget = -1, neutralTargetCnt = 0;
      for (const [idx, cnt] of neutralFreq) {
        if (cnt > neutralTargetCnt) {
          neutralTarget = idx;
          neutralTargetCnt = cnt;
        }
      }
      if (neutralTarget < 0 || neutralTarget === curIdx || neutralTargetCnt < 3) continue;
      const targetPal = MARD_PALETTE[neutralTarget];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const curDist = deltaE2000FromLab(sL, sA, sB, curPal.L, curPal.a, curPal.b_lab);
      const tarDist = deltaE2000FromLab(sL, sA, sB, targetPal.L, targetPal.a, targetPal.b_lab);
      const isolatedNoise = curPal.chroma > targetPal.chroma + 3 || Math.abs(curPal.L - targetPal.L) > (8 - t * 2) || sameAdj <= 1;
      if (!isolatedNoise) continue;
      if (tarDist <= curDist * (1.12 + t * 0.08) + 1.4) {
        out[r][c] = neutralTarget;
      }
    }
  }
  return out;
}
function suppressLargeGridFlatRegionNoise(gridData, rawGrid, rows, cols, amount, featureMask) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      let freq = new Map();
      let same = 0;
      let lowContrast = 0;
      let valid = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        const nRaw = rawGrid[nr][nc];
        if (nIdx < 0 || !nRaw) continue;
        valid++;
        if (nIdx === curIdx) same++;
        freq.set(nIdx, (freq.get(nIdx) || 0) + 1);
        const contrast = Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        if (contrast < (34 + t * 10)) lowContrast++;
      }
      if (valid < 6) continue;
      if (same >= 4) continue;
      if (lowContrast / valid < 0.72) continue;
      let domIdx = curIdx;
      let domCnt = 0;
      for (const [idx, cnt] of freq) {
        if (cnt > domCnt) { domIdx = idx; domCnt = cnt; }
      }
      if (domIdx === curIdx || domCnt < 4) continue;
      const curPal = MARD_PALETTE[curIdx];
      const domPal = MARD_PALETTE[domIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const curDist = deltaE2000FromLab(sL, sA, sB, curPal.L, curPal.a, curPal.b_lab);
      const domDist = deltaE2000FromLab(sL, sA, sB, domPal.L, domPal.a, domPal.b_lab);
      const bothNeutral = curPal.chroma < 10 && domPal.chroma < 10;
      const bothSky = curPal.L > 55 && domPal.L > 55 && curPal.hue >= 180 && curPal.hue <= 260 && domPal.hue >= 180 && domPal.hue <= 260;
      const bothDarkCloth = curPal.L < 58 && domPal.L < 58 && curPal.chroma < 14 && domPal.chroma < 14;
      if (!(bothNeutral || bothSky || bothDarkCloth)) continue;
      if (domDist <= curDist * (1.08 + t * 0.06) + 1.0) {
        out[r][c] = domIdx;
      }
    }
  }
  return out;
}
function cleanupBackgroundRegionNoise(gridData, rawGrid, bgMask, rows, cols, amount) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  if (!gridData || !rawGrid || !bgMask || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      let bgNeighbors = 0;
      let freq = new Map();
      let same = 0;
      let lowContrast = 0;
      let valid = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        const nRaw = rawGrid[nr][nc];
        if (!nRaw || nIdx < 0) continue;
        valid++;
        if (bgMask[nr][nc] === 1) {
          bgNeighbors++;
          freq.set(nIdx, (freq.get(nIdx) || 0) + 1);
          if (nIdx === curIdx) same++;
        }
        const contrast = Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        if (contrast < (30 + t * 12)) lowContrast++;
      }
      const likelyBackground = bgMask[r][c] === 1 || bgNeighbors >= 6;
      if (!likelyBackground) continue;
      if (valid < 6 || bgNeighbors < 5) continue;
      if (same >= 4) continue;
      if (lowContrast / valid < 0.72) continue;
      let domIdx = curIdx;
      let domCnt = 0;
      for (const [idx, cnt] of freq) {
        if (cnt > domCnt) { domIdx = idx; domCnt = cnt; }
      }
      if (domIdx === curIdx || domCnt < 4) continue;
      const curPal = MARD_PALETTE[curIdx];
      const domPal = MARD_PALETTE[domIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const curDist = deltaE2000FromLab(sL, sA, sB, curPal.L, curPal.a, curPal.b_lab);
      const domDist = deltaE2000FromLab(sL, sA, sB, domPal.L, domPal.a, domPal.b_lab);
      if (domDist <= curDist * (1.08 + t * 0.06) + 1.0) {
        out[r][c] = domIdx;
      }
    }
  }
  return out;
}
function cleanupForegroundSpeckles(gridData, rawGrid, rows, cols, featureMask, strength) {
  const t = Math.max(0, Math.min(1, Number(strength) || 0));
  if (!gridData || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const maxSize = t >= 0.8 ? 3 : 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c] || out[r][c] < 0) continue;
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const srcIdx = out[r][c];
      const queue = [[r, c]];
      const component = [];
      visited[r][c] = 1;
      let head = 0;
      while (head < queue.length) {
        const [cr, cc] = queue[head++];
        component.push([cr, cc]);
        for (const [dr, dc] of dirs4) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) continue;
          if (out[nr][nc] !== srcIdx) continue;
          if (featureMask && featureMask[nr] && featureMask[nr][nc]) continue;
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
      if (component.length > maxSize) continue;
      let bgNeighbors = 0;
      let totalNeighbors = 0;
      let sameColorSupport = 0;
      for (const [cr, cc] of component) {
        for (const [dr, dc] of dirs8) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          totalNeighbors++;
          const nIdx = out[nr][nc];
          if (nIdx < 0) { bgNeighbors++; continue; }
          if (nIdx === srcIdx) sameColorSupport++;
        }
      }
      const bgRatio = bgNeighbors / Math.max(1, totalNeighbors);
      if (bgRatio < 0.58) continue;
      if (sameColorSupport > component.length * 2) continue;
      for (const [cr, cc] of component) out[cr][cc] = -1;
    }
  }
  return out;
}
function cleanupGrayFringeAroundDark(gridData, rawGrid, rows, cols, level, featureMask) {
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const curIdx = out[r][c];
      const src = rawGrid[r][c];
      if (curIdx < 0 || !src) continue;
      const cur = MARD_PALETTE[curIdx];
      if (cur.chroma > (10 + (1 - t) * 3)) continue;
      if (cur.L < 24 || cur.L > 74) continue;
      const srcLum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
      if (srcLum > 148) continue;
      let darkCandidates = [];
      let contrastSum = 0;
      let contrastCount = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        if (nIdx < 0) continue;
        const nPal = MARD_PALETTE[nIdx];
        if (nPal.L < 42) darkCandidates.push(nIdx);
        const nRaw = rawGrid[nr][nc];
        if (nRaw) {
          contrastSum += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
          contrastCount++;
        }
      }
      if (darkCandidates.length < 3) continue;
      const avgContrast = contrastSum / Math.max(1, contrastCount);
      if (avgContrast < (42 - t * 8)) continue;
      const freq = new Map();
      darkCandidates.forEach(idx => freq.set(idx, (freq.get(idx) || 0) + 1));
      let targetIdx = darkCandidates[0];
      let targetCnt = 0;
      for (const [idx, cnt] of freq) {
        if (cnt > targetCnt) { targetIdx = idx; targetCnt = cnt; }
      }
      const target = MARD_PALETTE[targetIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const curDist = deltaE2000FromLab(sL, sA, sB, cur.L, cur.a, cur.b_lab);
      const tarDist = deltaE2000FromLab(sL, sA, sB, target.L, target.a, target.b_lab);
      if (tarDist <= curDist * (1.18 + t * 0.08) + 2.2) {
        out[r][c] = targetIdx;
      }
    }
  }
  return out;
}
// ========== V2 Pipeline: Final Similar Color Merge ==========
// After BFS, adjacent blocks may have very close colors (e.g., two shades of yellow, deltaE<8).
// In bead work, this means the user needs two almost-identical bead colors — wasteful.
// This merges the smaller block into the larger when they are adjacent and very similar.
function mergeSimilarAdjacentBlocks(gridData, rows, cols) {
  const out = gridData.map(row => [...row]);
  const dirs4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  // Count area of each MARD color index
  const colorArea = new Map(); // colorIdx → pixel count
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = out[r][c];
      if (idx >= 0) colorArea.set(idx, (colorArea.get(idx) || 0) + 1);
    }
  }
  // Find adjacent color pairs
  const adjacency = new Set(); // "min,max" of adjacent color pairs
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = out[r][c];
      if (a < 0) continue;
      for (const [dr, dc] of dirs4) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const b = out[nr][nc];
        if (b >= 0 && b !== a) {
          const key = Math.min(a, b) + ',' + Math.max(a, b);
          adjacency.add(key);
        }
      }
    }
  }
  // Build merge map: for each similar pair, merge smaller into larger
  const mergeMap = new Map(); // fromIdx → toIdx
  for (const key of adjacency) {
    const [aStr, bStr] = key.split(',');
    let a = parseInt(aStr), b = parseInt(bStr);
    // Resolve chains
    while (mergeMap.has(a)) a = mergeMap.get(a);
    while (mergeMap.has(b)) b = mergeMap.get(b);
    if (a === b) continue;
    const pa = MARD_PALETTE[a], pb = MARD_PALETTE[b];
    const dist = deltaE2000FromLab(pa.L, pa.a, pa.b_lab, pb.L, pb.a, pb.b_lab);
    if (dist < 8) {
      const areaA = colorArea.get(a) || 0;
      const areaB = colorArea.get(b) || 0;
      if (areaA >= areaB) {
        mergeMap.set(b, a);
      } else {
        mergeMap.set(a, b);
      }
    }
  }
  if (mergeMap.size === 0) return out;
  // Resolve transitive chains
  for (const [from, to] of mergeMap) {
    let resolved = to;
    while (mergeMap.has(resolved)) resolved = mergeMap.get(resolved);
    mergeMap.set(from, resolved);
  }
  // Apply merge
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = out[r][c];
      if (idx >= 0 && mergeMap.has(idx)) {
        out[r][c] = mergeMap.get(idx);
      }
    }
  }
  return out;
}
// ========== V2 Pipeline: Boundary Normalization ==========
// After BFS merging, some boundary pixels may be closer to their neighbor's color than their own block.
// This step flips them to the neighbor, producing sharper, cleaner block boundaries for bead work.
function normalizeBoundaries(gridData, rawGrid, rows, cols) {
  const out = gridData.map(row => [...row]);
  const dirs4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let changed = true;
  // Iterate until stable (usually 1-2 passes)
  for (let pass = 0; pass < 3 && changed; pass++) {
    changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const myIdx = out[r][c];
        if (myIdx < 0) continue;
        const rgb = rawGrid[r][c];
        if (!rgb) continue;
        // Check if this cell is on a boundary (has a differently-colored neighbor)
        const neighborColors = new Map(); // colorIdx → count
        for (const [dr, dc] of dirs4) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const nIdx = out[nr][nc];
          if (nIdx >= 0 && nIdx !== myIdx) {
            neighborColors.set(nIdx, (neighborColors.get(nIdx) || 0) + 1);
          }
        }
        if (neighborColors.size === 0) continue; // Interior cell, skip
        // Compare: how close is this pixel to its current color vs the most common neighbor color?
        const [L, a, bVal] = rgbToLab(rgb[0], rgb[1], rgb[2]);
        const myPal = MARD_PALETTE[myIdx];
        const myDist = deltaE2000FromLab(L, a, bVal, myPal.L, myPal.a, myPal.b_lab);
        let bestNIdx = -1, bestNCount = 0;
        for (const [nIdx, count] of neighborColors) {
          if (count > bestNCount) { bestNCount = count; bestNIdx = nIdx; }
        }
        if (bestNIdx < 0) continue;
        const nPal = MARD_PALETTE[bestNIdx];
        const nDist = deltaE2000FromLab(L, a, bVal, nPal.L, nPal.a, nPal.b_lab);
        // Only flip if neighbor is significantly closer (delta > 3 to avoid oscillation)
        if (nDist < myDist - 3) {
          out[r][c] = bestNIdx;
          changed = true;
        }
      }
    }
  }
  return out;
}
function preserveThinDarkStrokes(gridData, rawGrid, rows, cols, level, featureMask) {
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const curIdx = out[r][c];
      const src = rawGrid[r][c];
      if (curIdx < 0 || !src) continue;
      const cur = MARD_PALETTE[curIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const srcChroma = Math.hypot(sA, sB);
      const srcHue = (Math.atan2(sB, sA) * 180 / Math.PI + 360) % 360;
      const srcWarm = srcHue <= 85 || srcHue >= 320;
      // ★ Raised L threshold from 42 to 48 — catch more dark-gray strokes
      if (sL > (48 + (1 - t) * 10)) continue;
      let contrastSum = 0;
      let contrastCount = 0;
      let brighterNeighbors = 0;
      let darkNeighbors = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nRaw = rawGrid[nr][nc];
        const nIdx = out[nr][nc];
        if (nRaw) {
          contrastSum += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
          contrastCount++;
          const nLum = 0.299 * nRaw[0] + 0.587 * nRaw[1] + 0.114 * nRaw[2];
          if (nLum > (0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2]) + 12) brighterNeighbors++;
        }
        if (nIdx >= 0 && MARD_PALETTE[nIdx].L < 46) darkNeighbors++;
      }
      const avgContrast = contrastSum / Math.max(1, contrastCount);
      // ★ Lowered requirements: only 1 brighter neighbor needed (was 2), contrast threshold reduced to 30
      const looksLikeStroke = brighterNeighbors >= 1 && avgContrast > (30 - t * 8);
      if (!looksLikeStroke && darkNeighbors < 2) continue;
      // ★ Relaxed "too light" check: if current palette L is notably higher than source, or achromatic mismatch
      const currentTooLight = cur.L > sL + (6 - t * 2) || (cur.chroma < 7 && srcChroma > 5);
      if (!currentTooLight) continue;
      const allowed = srcWarm && srcChroma >= 5.5
        ? (DARK_WARM_INDICES.length > 0 ? DARK_WARM_INDICES : DARK_CHROMATIC_INDICES)
        : (DARK_NEUTRAL_INDICES.length > 0 ? DARK_NEUTRAL_INDICES : ALL_INDICES);
      const rep = findNearestColor(src[0], src[1], src[2], allowed);
      if (rep >= 0) out[r][c] = rep;
    }
  }
  return out;
}
function cleanupDarkOutlierSpeckles(gridData, rawGrid, rows, cols, level) {
  if (!gridData || !rawGrid || rows < 3 || cols < 3) return gridData;
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (t <= 0) return gridData;
  const out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const curIdx = out[r][c];
      const src = rawGrid[r][c];
      if (curIdx < 0 || !src) continue;
      const srcLum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
      if (srcLum > (132 - t * 24)) continue;
      const cur = MARD_PALETTE[curIdx];
      const freq = new Map();
      let valid = 0;
      let sameCnt = 0;
      let darkNeutralNb = 0;
      for (const [dr, dc] of dirs8) {
        const nr = r + dr, nc = c + dc;
        const nIdx = out[nr][nc];
        if (nIdx < 0) continue;
        valid++;
        if (nIdx === curIdx) sameCnt++;
        freq.set(nIdx, (freq.get(nIdx) || 0) + 1);
        const nPal = MARD_PALETTE[nIdx];
        if (nPal.L < 58 && nPal.chroma < 18) darkNeutralNb++;
      }
      if (valid < 5 || sameCnt >= 2 || darkNeutralNb < 4) continue;
      let domIdx = curIdx, domCnt = 0;
      for (const [idx, cnt] of freq) {
        if (idx !== curIdx && cnt > domCnt) {
          domIdx = idx;
          domCnt = cnt;
        }
      }
      if (domIdx === curIdx || domCnt < 3) continue;
      const dom = MARD_PALETTE[domIdx];
      const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
      const srcChroma = Math.hypot(sA, sB);
      const curDist = deltaE2000FromLab(sL, sA, sB, cur.L, cur.a, cur.b_lab);
      const domDist = deltaE2000FromLab(sL, sA, sB, dom.L, dom.a, dom.b_lab);
      const hueGap = Math.min(Math.abs(cur.hue - dom.hue), 360 - Math.abs(cur.hue - dom.hue));
      const warmHue = (cur.hue <= 72 || cur.hue >= 318);
      const warmOutlier = warmHue && cur.chroma > 14 && dom.chroma < 16 && srcChroma < 22;
      const grayLiftOutlier = cur.chroma < 11 && cur.L > dom.L + (9 - t * 2) && dom.L < 45 && srcLum < 110;
      const satJumpOutlier = cur.chroma > dom.chroma + 16 && srcChroma < 24 && hueGap > 28;
      if (!warmOutlier && !grayLiftOutlier && !satJumpOutlier) continue;
      if (domDist <= curDist * (1.14 + (1 - t) * 0.05) + 1.2) {
        out[r][c] = domIdx;
      }
    }
  }
  return out;
}
function generateGridCompat(imageData, pixN, targetRows, targetCols) {
  const preset = PROFILE_PRESETS[appState.activePresetId] || PROFILE_PRESETS.detail_keep;
  const tuning = getResolutionTuning(pixN);
  let centerBias = preset.centerBias != null ? preset.centerBias : 0.3;
  if ((appState.activePresetId === 'line_boost' || appState.activePresetId === 'detail_keep') && pixN <= 110) {
    centerBias = Math.min(0.9, centerBias + 0.1);
  }
  const sampleProtect = Math.max(0, Math.min(1, (preset.featureProtect || 0) * (tuning.sampleProtectScale || 1)));
  const { grid, rows, cols } = buildRawGridSimpleMean(imageData, pixN, centerBias, sampleProtect, targetRows, targetCols);
  if (!grid || rows <= 0 || cols <= 0) {
    throw new Error('网格生成失败');
  }
  let quantizeMode = preset.quantizeMode || 'medium';
  if ((tuning.quantizeRelax || 0) >= 1) {
    if (quantizeMode === 'strong') quantizeMode = 'soft';
    else if (quantizeMode === 'medium') quantizeMode = 'off';
  }
  if ((tuning.quantizeRelax || 0) >= 2) {
    quantizeMode = 'off';
  }
  let workRaw = grid.map(row => row.map(cell => (cell ? [...cell] : null)));
  if (quantizeMode !== 'off') {
    let colorBudget = getCompatColorBudget(appState.internalMergeLevel);
    if (quantizeMode === 'strong') colorBudget = Math.max(10, Math.round(colorBudget * 0.72));
    if (quantizeMode === 'soft') colorBudget = Math.min(48, colorBudget + 6);
    workRaw = medianCutQuantizeRawGrid(grid, rows, cols, colorBudget);
  }
  const sourceFeatureGrid = firstPassMatchRgb(workRaw, rows, cols);
  const semanticFeatureMask = detectSemanticFeatureMask(sourceFeatureGrid, workRaw, rows, cols, preset.featureProtect || 0);
  let gridData = sourceFeatureGrid.map(row => [...row]);
  if (preset.darkLineBoost > 0) {
    gridData = reinforceDarkLines(gridData, grid, rows, cols, preset.darkLineBoost);
  }
  if (preset.warmSpeckleGuard > 0) {
    gridData = suppressWarmSpeckles(gridData, grid, rows, cols, preset.warmSpeckleGuard);
  }
  if (appState.ditherStrength > 0) {
    const usedColors = new Set();
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (gridData[r][c] !== -1) usedColors.add(gridData[r][c]);
    }
    const allowedIndices = [...usedColors].sort((a, b) => a - b);
    if (allowedIndices.length > 0) {
      gridData = applyDithering(workRaw, rows, cols, allowedIndices, appState.ditherStrength);
    }
  }
  if (appState.ditherStrength > 0) {
    const deNoiseStrength = Math.min(100, 36 + appState.ditherStrength * 0.55);
    gridData = deSpeckleGrid(gridData, workRaw, rows, cols, deNoiseStrength);
  }
  if (appState.internalMergeLevel > 0) {
    gridData = applySimilarMergeByPaletteTop(gridData, workRaw, rows, cols, appState.internalMergeLevel);
  }
  gridData = cleanupDarkOutlierSpeckles(gridData, workRaw, rows, cols, preset.warmSpeckleGuard || 0);
  gridData = restoreProtectedFeatureCells(gridData, sourceFeatureGrid, semanticFeatureMask);
  return { rawGrid: workRaw, gridData, rows, cols, featureMask: semanticFeatureMask, featureSourceGrid: sourceFeatureGrid };
}
function buildBeadDesign(imageData, pixN, targetRows, targetCols) {
  const preset = PROFILE_PRESETS[appState.activePresetId] || PROFILE_PRESETS.detail_keep;
  // Route: V2 pipeline for dominant sampling mode, V1 for mean sampling mode
  if (preset.samplingMode === 'dominant') {
    return generateGridV2(imageData, pixN, targetRows, targetCols);
  }
  return buildBeadDesignV1(imageData, pixN, targetRows, targetCols);
}
function buildBeadDesignV1(imageData, pixN, targetRows, targetCols) {
  const { rawGrid, gridData: compatGridData, rows, cols, featureMask: compatFeatureMask, featureSourceGrid } = generateGridCompat(imageData, pixN, targetRows, targetCols);
  let gridData = compatGridData;
  const preset = PROFILE_PRESETS[appState.activePresetId] || PROFILE_PRESETS.detail_keep;
  const tuning = getResolutionTuning(pixN);
  const featureMask = compatFeatureMask || detectSemanticFeatureMask(gridData, rawGrid, rows, cols, preset.featureProtect || 0);
  const protectedSourceGrid = featureSourceGrid ? featureSourceGrid.map(row => [...row]) : gridData.map(row => [...row]);
  const refineStrength = Math.round((appState.beadRefineStrength || 0) * (tuning.refineScale || 1));
  if (refineStrength > 0) {
    gridData = refineGridForBeads(gridData, rawGrid, rows, cols, refineStrength);
  }
  const postMergeFactor = Math.max(0, Number(preset.postMergeFactor) || 0);
  const postMergeLevel = Math.max(0, Math.min(100, Math.round(appState.internalMergeLevel * postMergeFactor * (tuning.mergeScale || 1))));
  if (postMergeLevel > 0) {
    gridData = applySimilarMergeByPaletteTop(gridData, rawGrid, rows, cols, postMergeLevel);
  }
  gridData = cleanupDarkOutlierSpeckles(gridData, rawGrid, rows, cols, preset.warmSpeckleGuard || 0);
  const fringeStrength = (preset.darkFringeClean || 0) * (tuning.fringeScale || 1);
  gridData = cleanupGrayFringeAroundDark(gridData, rawGrid, rows, cols, fringeStrength, featureMask);
  gridData = preserveThinDarkStrokes(gridData, rawGrid, rows, cols, fringeStrength, featureMask);
  gridData = applyLargeGridColorFidelity(gridData, rawGrid, rows, cols, tuning.colorFidelity || 0, featureMask);
  if (appState.activePresetId !== 'line_boost' && (appState.activePresetId === 'detail_keep' || appState.profileId === 'smart' || appState.activePresetId === 'portrait_opt')) {
    const exp = getEffectiveHairExperimentSettings();
    const scale = pixN >= 87 ? 1 : (pixN >= 58 ? 0.72 : 0.38);
    gridData = stabilizeHairLikeWarmDarkRegions(gridData, rawGrid, rows, cols, {
      detect: (exp.hairRegionDetectStrength || 0) * scale,
      paletteLevels: exp.hairPaletteLevels || 3,
      neutralReject: exp.hairNeutralReject || 0,
      smooth: exp.hairInteriorSmooth || 0,
      boundaryProtect: exp.hairBoundaryProtect || 0
    }, featureMask);
    gridData = cleanupFigureBoundaryNoise(gridData, rawGrid, rows, cols, exp.figureBoundaryClean || 0, featureMask);
    gridData = cleanupClothInteriorNoise(gridData, rawGrid, rows, cols, preset.clothNoiseClean || 0, featureMask);
    if (pixN >= 120) {
      gridData = suppressLargeGridFlatRegionNoise(gridData, rawGrid, rows, cols, 0.86, featureMask);
    }
  }
  if (appState.userSimplifyLevel > 0) {
    gridData = applyUserColorSimplify(gridData, rawGrid, rows, cols, appState.userSimplifyLevel, featureMask);
    gridData = restoreProtectedFeatureCells(gridData, protectedSourceGrid, featureMask);
  }
  gridData = restoreProtectedFeatureCells(gridData, protectedSourceGrid, featureMask);
  return { rawGrid, gridData, rows, cols, featureMask };
}
function refineGridForBeads(gridData, rawGrid, rows, cols, strength) {
  if (!gridData || !rawGrid || !strength || strength <= 0) return gridData;
  const t = Math.max(0, Math.min(100, strength)) / 100;
  const totalCells = rows * cols;
  const passes = (t > 0.72 && totalCells <= 9000) ? 2 : 1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  let out = gridData.map(row => [...row]);
  for (let pass = 0; pass < passes; pass++) {
    const next = out.map(row => [...row]);
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const curIdx = out[r][c];
        const src = rawGrid[r][c];
        if (curIdx < 0 || !src) continue;
        let sameCnt = 0;
        let valid = 0;
        let contrastSum = 0;
        const freq = new Map();
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          const nIdx = out[nr][nc];
          if (nIdx < 0) continue;
          valid++;
          if (nIdx === curIdx) sameCnt++;
          freq.set(nIdx, (freq.get(nIdx) || 0) + 1);
          const nRaw = rawGrid[nr][nc];
          if (nRaw) {
            contrastSum += Math.abs(src[0]-nRaw[0]) + Math.abs(src[1]-nRaw[1]) + Math.abs(src[2]-nRaw[2]);
          }
        }
        if (valid < 4) continue;
        let domIdx = curIdx, domCnt = 0;
        for (const [idx, cnt] of freq) {
          if (cnt > domCnt) { domCnt = cnt; domIdx = idx; }
        }
        if (domIdx === curIdx) continue;
        const support = domCnt / valid;
        const supportThresh = 0.72 - t * 0.10;
        if (support < supportThresh) continue;
        const avgContrast = contrastSum / Math.max(1, valid);
        const strongEdge = avgContrast > (96 - t * 20);
        if (strongEdge && sameCnt > 0) continue;
        if (sameCnt > 1) continue;
        const srcLum = 0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2];
        const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
        const srcChroma = Math.hypot(sA, sB);
        const curPal = MARD_PALETTE[curIdx];
        const domPal = MARD_PALETTE[domIdx];
        if (srcLum < 88 && avgContrast > 62 && curPal.L < 45 && domPal.L > curPal.L + 9) continue;
        if (srcChroma > 15 && curPal.chroma > 13 && domPal.chroma < 8 && domPal.L < 45) continue;
        const curDist = deltaE2000FromLab(sL, sA, sB, curPal.L, curPal.a, curPal.b_lab);
        const domDist = deltaE2000FromLab(sL, sA, sB, domPal.L, domPal.a, domPal.b_lab);
        const allowSlack = 1.06 + t * 0.24;
        if (domDist <= curDist * allowSlack) {
          next[r][c] = domIdx;
        }
      }
    }
    out = next;
  }
  return out;
}
const HOST_BRIDGE = {
  embedded: window.self !== window.top || new URLSearchParams(window.location.search).get('embedded') === '1',
  source: 'god-dou-image-convert',
  version: '20260426-p0p1'
};
let activeImportRequestId = '';
let activeImportGenerationId = '';

function postHostMessage(type, payload, meta) {
  if (!HOST_BRIDGE.embedded || !window.parent || window.parent === window) return false;
  const requestId = meta?.requestId || payload?.requestId || '';
  const generationId = meta?.generationId || payload?.generationId || '';
  window.parent.postMessage({
    source: HOST_BRIDGE.source,
    version: HOST_BRIDGE.version,
    type,
    requestId,
    generationId,
    payload: {
      ...(payload || {}),
      bridgeVersion: HOST_BRIDGE.version,
      requestId,
      generationId
    }
  }, '*');
  return true;
}

function notifyHostReady() {
  postHostMessage('god-dou:image-convert:ready');
}

function applyIncomingPreset(profileId, actualPresetId, silent) {
  const presetId = actualPresetId && PROFILE_PRESETS[actualPresetId]
    ? actualPresetId
    : (profileId === 'smart' ? PROFILE_PRESETS.smart.fallback : profileId);
  const tabProfileId = profileId || (presetId && presetId.startsWith('smart_') ? 'smart' : presetId);
  appState.profileId = tabProfileId;
  updateProfileTagState(tabProfileId);
  appState.activePresetId = presetId;
  appState.smartResolvedForFile = tabProfileId === 'smart';
  applyProfileDefaults(PROFILE_PRESETS[presetId], PROFILE_PRESETS[presetId]?.hint);
  if (!silent) {
    triggerLiveConvert(false);
  }
}

function applyIncomingEngineeringOptions(options) {
  if (!options || typeof options !== 'object') return;
  if (typeof options.removeBg === 'boolean') {
    const removeBgToggle = document.getElementById('removeBgToggle');
    if (removeBgToggle) removeBgToggle.classList.toggle('on', options.removeBg);
  }
  if (Number.isFinite(options.simplifyLevel)) {
    appState.userSimplifyLevel = Math.max(0, Math.min(100, Math.round(options.simplifyLevel)));
    const smSlider = document.getElementById('smLevelSlider');
    if (smSlider) smSlider.value = String(appState.userSimplifyLevel);
  }
  if (Number.isFinite(options.ditherStrength)) {
    appState.ditherStrength = Math.max(0, Math.min(100, Math.round(options.ditherStrength)));
    const ditherSlider = document.getElementById('ditherSlider');
    const ditherVal = document.getElementById('ditherVal');
    if (ditherSlider) ditherSlider.value = String(appState.ditherStrength);
    if (ditherVal) ditherVal.textContent = String(appState.ditherStrength);
  }
  if (typeof options.showGrid === 'boolean') appState.showGrid = options.showGrid;
  if (typeof options.showLabels === 'boolean') appState.showLabels = options.showLabels;
  if (typeof options.showMirror === 'boolean') appState.showMirror = options.showMirror;
  if (typeof options.finalShowLabels === 'boolean') appState.finalShowLabels = options.finalShowLabels;
  if (typeof options.finalQuality === 'string') appState.finalQuality = options.finalQuality;
  const chipGrid = document.getElementById('chipGrid');
  const chipLabel = document.getElementById('chipLabel');
  const chipMirror = document.getElementById('chipMirror');
  if (chipGrid) chipGrid.classList.toggle('on', appState.showGrid);
  if (chipLabel) chipLabel.classList.toggle('on', appState.showLabels);
  if (chipMirror) chipMirror.classList.toggle('on', appState.showMirror);
  refreshColorSimplifyIndicator();
  syncFinalLabelChip();
  syncFinalQualityChip();
}

function captureImageConvertStateSnapshot() {
  return {
    pixN: appState.pixN,
    profileId: appState.profileId,
    activePresetId: appState.activePresetId,
    smartResolvedForFile: appState.smartResolvedForFile,
    userSimplifyLevel: appState.userSimplifyLevel,
    ditherStrength: appState.ditherStrength,
    internalMergeLevel: appState.internalMergeLevel,
    beadRefineStrength: appState.beadRefineStrength,
    showGrid: appState.showGrid,
    showLabels: appState.showLabels,
    showMirror: appState.showMirror,
    finalShowLabels: appState.finalShowLabels,
    finalQuality: appState.finalQuality,
    removeBgOn: !!document.getElementById('removeBgToggle')?.classList.contains('on')
  };
}

function restoreImageConvertStateSnapshot(snapshot) {
  if (!snapshot) return;
  Object.assign(appState, snapshot);
  const sizeSelect = document.getElementById('sizePresetSelect');
  const customInput = document.getElementById('customSizeInput');
  if (sizeSelect) sizeSelect.value = String(appState.pixN);
  if (customInput) customInput.value = String(appState.pixN);
  const smSlider = document.getElementById('smLevelSlider');
  const ditherSlider = document.getElementById('ditherSlider');
  const ditherVal = document.getElementById('ditherVal');
  if (smSlider) smSlider.value = String(appState.userSimplifyLevel || 0);
  if (ditherSlider) ditherSlider.value = String(appState.ditherStrength || 0);
  if (ditherVal) ditherVal.textContent = String(appState.ditherStrength || 0);
  const removeBgToggle = document.getElementById('removeBgToggle');
  if (removeBgToggle) removeBgToggle.classList.toggle('on', !!snapshot.removeBgOn);
  updateProfileTagState(appState.profileId);
  updateSizeQuickInfo(String(appState.pixN));
  renderCustomSizeDetail(appState.pixN);
  updateSizeInfo();
  refreshColorSimplifyIndicator();
  syncFinalLabelChip();
  syncFinalQualityChip();
}

function applyImportedAiCandidate(payload) {
  const dataUrl = payload?.imageDataUrl;
  if (!dataUrl || typeof dataUrl !== 'string') {
    showToast('AI 候选图无效，请重新选择');
    return;
  }
  activeImportRequestId = payload?.requestId || '';
  activeImportGenerationId = payload?.generationId || '';
  if (payload?.pixN) {
    const nextSize = Math.max(10, Math.min(200, Number(payload.pixN)));
    appState.pixN = nextSize;
    const sizeSelect = document.getElementById('sizePresetSelect');
    const customInput = document.getElementById('customSizeInput');
    if (sizeSelect) sizeSelect.value = String(nextSize);
    if (customInput) customInput.value = String(nextSize);
    updateSizeQuickInfo(String(nextSize));
    renderCustomSizeDetail(nextSize);
    updateSizeInfo();
  }
  if (payload?.profileId || payload?.actualPresetId) {
    applyIncomingPreset(payload?.profileId || 'smart', payload?.actualPresetId, true);
  }
  applyIncomingEngineeringOptions(payload?.engineeringOptions);
  appState.liveJobId++;
  appState.currentSolutionKey = '';
  appState.cropImageSrc = dataUrl;
  appState.file = dataUrlToFile(dataUrl, `ai-candidate-${payload?.candidateId || Date.now()}.png`);
  appState.cachedImg = null;
  appState.cachedImageData = null;
  appState.bgMask = null;
  appState.fullGridData = null;
  appState.smartResolvedForFile = !!(payload?.actualPresetId || payload?.profileId === 'smart');
  appState.previewScale = 0;
  appState.previewOffsetX = 0;
  appState.previewOffsetY = 0;
  appState.previewNeedsReset = true;
  appState.hideOriginalPreview = true;
  appState.previewMode = 'beads';
  appState.pendingAutoPage = payload?.targetPage || 'page-result';
  appState.targetGridRows = Number.isInteger(payload?.targetRows) ? payload.targetRows : null;
  appState.targetGridCols = Number.isInteger(payload?.targetCols) ? payload.targetCols : null;
  appState.targetShortSide = Number.isInteger(payload?.targetShortSide) ? payload.targetShortSide : null;
  const previewImg = document.getElementById('previewImg');
  if (previewImg) {
    previewImg.src = dataUrl;
    previewImg.style.display = 'block';
  }
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) uploadArea.classList.add('has-image');
  appState.fromAiCandidate = true;
  navigateTo('page-convert');
  if (payload?.usePerfectPixel === true) {
    runPerfectPixelPipelineForAiCandidate(payload);
  } else {
    triggerLiveConvert(true);
  }
  postHostMessage('god-dou:image-convert:imported', {
    candidateId: payload?.candidateId || '',
    actualPresetId: payload?.actualPresetId || appState.activePresetId
  }, {
    requestId: activeImportRequestId,
    generationId: activeImportGenerationId
  });
  showToast(`已导入「${payload?.candidateTitle || 'AI 拼豆方案'}」`);
}

function restartConvertOrBackToAiPicks() {
  if (appState.fromAiCandidate === true) {
    postHostMessage('god-dou:image-convert:back-to-ai-picks', {});
    return;
  }
  navigateTo('page-convert');
}

function goHostHome() {
  postHostMessage('god-dou:image-convert:go-home', {});
}

function resetImageConvertPipeline() {
  appState.fromAiCandidate = false;
  appState.cropImageSrc = '';
  appState.file = null;
  appState.cachedImg = null;
  appState.cachedImageData = null;
  appState.bgMask = null;
  appState.fullGridData = null;
  appState.gridData = null;
  appState.editGridData = null;
  appState.editBaseGridData = null;
  appState.smartResolvedForFile = false;
  appState.currentSolutionKey = '';
  appState.targetGridRows = null;
  appState.targetGridCols = null;
  appState.targetShortSide = null;
  appState.scale = 1;
  appState.offsetX = 0;
  appState.offsetY = 0;
  appState.editScale = 1;
  appState.editOffsetX = 0;
  appState.editOffsetY = 0;
  appState.previewScale = 0;
  appState.previewOffsetX = 0;
  appState.previewOffsetY = 0;
  appState.previewNeedsReset = true;
  appState.hideOriginalPreview = false;
  appState.undoStack = [];
  appState.pendingStrokeAction = null;
  appState.liveJobId = (appState.liveJobId || 0) + 1;
  const previewImg = document.getElementById('previewImg');
  if (previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  if (uploadPlaceholder) uploadPlaceholder.style.display = '';
  const uploadArea = document.getElementById('uploadArea');
  if (uploadArea) uploadArea.classList.remove('has-image');
  const fileInput = document.getElementById('fileInput');
  if (fileInput) fileInput.value = '';
  navigateTo('page-convert');
}

function showPerfectPixelLoadingToast(text) {
  let el = document.getElementById('ppLoadingToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ppLoadingToast';
    el.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.78);color:#fff;padding:14px 22px;border-radius:10px;font-size:14px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.25);pointer-events:none';
    document.body.appendChild(el);
  }
  el.textContent = text || '正在进行图像处理...';
  el.style.display = 'block';
}

function hidePerfectPixelLoadingToast() {
  const el = document.getElementById('ppLoadingToast');
  if (el) el.style.display = 'none';
}

async function runPerfectPixelPipelineForAiCandidate(payload) {
  const dataUrl = payload?.imageDataUrl;
  if (!window.PerfectPixelBridge || typeof window.PerfectPixelBridge.runPerfectPixelPipeline !== 'function') {
    showToast('PerfectPixel 未加载，使用默认方式');
    triggerLiveConvert(true);
    return;
  }
  try {
    showPerfectPixelLoadingToast('正在进行图像处理...');
    await new Promise(r => setTimeout(r, 16));
    const img = await loadImageFromSrc(dataUrl);
    const imageData = getPixelData(img);
    const result = window.PerfectPixelBridge.runPerfectPixelPipeline(imageData, {
      ppOptions: { sampleMethod: 'center' }
    });
    if (!result || !result.ok) {
      hidePerfectPixelLoadingToast();
      showToast('图像处理失败：' + (result?.reason || '未知原因') + '，已使用默认方式');
      triggerLiveConvert(true);
      return;
    }
    const { rawGrid, gridData, rows, cols, colorStats } = result;
    appState.liveJobId++;
    appState.rawGrid = rawGrid;
    appState.gridRows = rows;
    appState.gridCols = cols;
    appState.gridData = gridData;
    appState.fullGridData = gridData.map(row => [...row]);
    appState.bgMask = null;
    appState.colorStats = colorStats;
    appState.materials = typeof buildMaterialItems === 'function' ? buildMaterialItems() : [];
    appState.metadata = {
      pixN: Math.max(rows, cols),
      rows, cols,
      totalBeads: countForegroundBeads(gridData, rows, cols),
      colorCount: colorStats.length
    };
    appState.cachedImg = null;
    appState.cachedImageData = null;
    invalidateEditState();
    refreshColorSimplifyIndicator();
    const previewSection = document.getElementById('previewSection');
    if (previewSection) previewSection.classList.add('show');
    if (typeof renderLivePreview === 'function') renderLivePreview();
    if (typeof hideUploadPreview === 'function') hideUploadPreview();
    syncConvertBottomBar(true);
    hidePerfectPixelLoadingToast();
    const targetPage = appState.pendingAutoPage || 'page-result';
    appState.pendingAutoPage = '';
    if (typeof ensureSolutionKey === 'function') ensureSolutionKey();
    initPaletteInteractionForCurrent();
    renderResult();
    navigateTo(targetPage);
  } catch (err) {
    hidePerfectPixelLoadingToast();
    console.error('[PP] pipeline error:', err);
    showToast('图像处理异常，已使用默认方式');
    triggerLiveConvert(true);
  }
}

async function buildConvertedPreviewForCandidate(payload) {
  const dataUrl = payload?.imageDataUrl;
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('候选图数据无效');
  }
  const stateSnapshot = captureImageConvertStateSnapshot();
  try {
    if (payload?.pixN) {
      appState.pixN = Math.max(10, Math.min(200, Number(payload.pixN)));
    }
    if (payload?.profileId || payload?.actualPresetId) {
      applyIncomingPreset(payload?.profileId || 'smart', payload?.actualPresetId, true);
    }
    applyIncomingEngineeringOptions(payload?.engineeringOptions);
    const img = await loadImageFromSrc(dataUrl);
    const imageData = getPixelData(img);
    if (!payload?.actualPresetId && appState.profileId === 'smart') {
      appState.smartResolvedForFile = false;
      const auto = resolveSmartProfile(imageData);
      appState.activePresetId = auto.id;
      applyProfileDefaults(PROFILE_PRESETS[auto.id], '智能推荐：' + auto.reason);
      appState.smartResolvedForFile = true;
    }
    const actualPresetId = payload?.actualPresetId || appState.activePresetId;
    const profileId = payload?.profileId || appState.profileId;
    const targetGrid = resolveTargetGridByAspect(imageData.width, imageData.height, payload?.targetShortSide, payload?.targetRows, payload?.targetCols);
    const targetRows = targetGrid.rows;
    const targetCols = targetGrid.cols;
    const { rawGrid, gridData, rows, cols } = buildBeadDesign(imageData, appState.pixN, targetRows, targetCols);
    const colorStats = buildColorStats(gridData, rows, cols);
    const beadCount = countForegroundBeads(gridData, rows, cols);
    return {
      previewUrl: renderGridPreviewDataUrl(gridData, rows, cols),
      rows,
      cols,
      colorCount: colorStats.length,
      beadCount,
      legendItems: colorStats.slice(0, 18).map((item) => ({
        code: item.id,
        color: `rgb(${item.r},${item.g},${item.b})`,
        count: item.count
      })),
      profileId,
      actualPresetId
    };
  } finally {
    restoreImageConvertStateSnapshot(stateSnapshot);
  }
}

function handleHostImportMessage(event) {
  const data = event.data || {};
  if (data.source !== 'god-dou-home') return;
  const payload = data.payload || {};
  const requestId = data.requestId || payload.requestId || '';
  const generationId = data.generationId || payload.generationId || '';
  if (data.type === 'god-dou:image-convert:import-ai-candidate') {
    applyImportedAiCandidate({ ...payload, requestId, generationId });
    return;
  }
  if (data.type === 'god-dou:image-convert:reset') {
    resetImageConvertPipeline();
    return;
  }
  if (data.type === 'god-dou:image-convert:convert-preview') {
    buildConvertedPreviewForCandidate({ ...payload, requestId, generationId })
      .then(result => {
        postHostMessage('god-dou:image-convert:preview-result', {
          candidateId: payload?.candidateId || '',
          ...result
        }, {
          requestId,
          generationId
        });
      })
      .catch(error => {
        postHostMessage('god-dou:image-convert:toast', {
          message: `候选预览生成失败：${error?.message || '未知错误'}`
        }, {
          requestId,
          generationId
        });
      });
  }
}

window.addEventListener('message', handleHostImportMessage);

function godDouBack() {
  if (!postHostMessage('god-dou:image-convert:go-back')) {
    history.back();
  }
}

function openHostCart() {
  if (!postHostMessage('god-dou:image-convert:open-cart')) {
    showToast('购物车链路待接入');
  }
}

function syncConvertBottomBar(hasResult) {
  const convertPage = document.getElementById('page-convert');
  const navBar = document.getElementById('convertNavBar');
  const convertBtn = document.getElementById('convertBtn');
  const homeBtn = document.getElementById('homeBtn');
  const backBtn = document.getElementById('convertBackBtn');
  const title = document.getElementById('convertPageTitle');
  if (convertPage) convertPage.classList.remove('page-top-breath');
  if (navBar) {
    navBar.style.display = 'flex';
    navBar.classList.toggle('compact-shell', hasResult);
  }
  if (convertBtn) {
    convertBtn.style.display = hasResult ? 'block' : 'none';
    convertBtn.disabled = !hasResult;
  }
  if (homeBtn) homeBtn.style.display = hasResult ? 'block' : 'none';
  if (backBtn) backBtn.style.display = hasResult ? 'none' : 'flex';
  if (title) title.style.display = hasResult ? 'none' : 'block';
}

function getBeadSystemDefault() {
  return window.GodDouBeadRegistry?.getDefault?.('image-convert') || { seriesId: 'mard', variantId: '221' };
}

function getBeadSystemLabel() {
  return window.GodDouBeadRegistry?.getDisplayLabel?.('image-convert') || 'MARD（221色）';
}

let appState = {
  beadSystem: getBeadSystemDefault(),
  currentSolutionKey: '',
  file: null, pixN: 29, profileId: 'smart', activePresetId: 'smart_balanced', smartResolvedForFile: false, ditherStrength: 0, internalMergeLevel: 10, userSimplifyLevel: 0, beadRefineStrength: 68,
  gridData: null, rawGrid: null, gridRows: 0, gridCols: 0, colorStats: null, metadata: null,
  gridVersion: 0, editSourceVersion: -1,
  highlightedResultColor: null,
  workspaceMode: 'preview',
  showGrid: true, showLabels: false, showMirror: false, finalShowLabels: true, finalQuality: 'hd',
  scale: 1, offsetX: 0, offsetY: 0, dragging: false, lastX: 0, lastY: 0,
  editGridData: null, editBaseGridData: null, currentTool: 'brush', currentColorIdx: 0, brushSize: 1,
  undoStack: [],
  pendingStrokeAction: null,
  editEventsBound: false,
  editViewportDirty: true,
  lastEditViewportKey: '',
  replaceFrom: -1, replaceTo: -1,
  editScale: 1, editOffsetX: 0, editOffsetY: 0,
  cachedImg: null, cachedImageData: null,
  liveConvertTimer: null, liveJobId: 0,
  previewMode: 'beads',
  hideOriginalPreview: false,
  pendingAutoPage: '',
  targetGridRows: null,
  targetGridCols: null,
  targetShortSide: null,
  previewScale: 1,
  previewOffsetX: 0,
  previewOffsetY: 0,
  previewNeedsReset: true,
  cropImageSrc: '',
  cropImg: null,
  cropViewport: { scale: 1, offsetX: 0, offsetY: 0 },
  cropRect: { x: 40, y: 40, w: 200, h: 200 },
  bgMask: null, // grid-level background mask (rows x cols), true=background
  fullGridData: null, // complete gridData before background removal (for toggle)
  useHandcraftStyle: true,  // 手绘风格引导开关
  handcraftScore: null,     // 最近一次生成的手绘相似度评分
  globalColorHints: null,   // 原图全局色调预分析结果
  experimentScene: 'auto',
  experimentOverrides: {
    hairRegionDetectStrength: null,
    hairPaletteLevels: null,
    hairNeutralReject: null,
    hairInteriorSmooth: null,
    hairBoundaryProtect: null,
    figureBoundaryClean: null
  }
};
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  target.classList.add('active');
  target.classList.add('fade-in');
  setTimeout(() => target.classList.remove('fade-in'), 240);
  if (pageId === 'page-result') {
    setWorkspaceMode('preview', true);
    renderResult();
  } else if (pageId === 'page-final-art') {
    syncFinalLabelChip();
    syncFinalQualityChip();
    renderFinalArtwork();
  }
}
function goFinalArtworkFromMaterial() {
  closeMaterialSheet();
  syncFinalLabelChip();
  syncFinalQualityChip();
  navigateTo('page-final-art');
}
function syncFinalLabelChip() {
  const chip = document.getElementById('finalLabelChip');
  if (!chip) return;
  const enabled = appState.finalShowLabels !== false;
  chip.classList.toggle('on', enabled);
  chip.textContent = enabled ? '已开启' : '已关闭';
}
function toggleFinalLabel() {
  appState.finalShowLabels = appState.finalShowLabels === false;
  syncFinalLabelChip();
  renderFinalArtwork();
}
function syncFinalQualityChip() {
  const map = {
    standard: document.getElementById('finalQualityStandard'),
    hd: document.getElementById('finalQualityHd'),
    ultra: document.getElementById('finalQualityUltra'),
    '8k': document.getElementById('finalQuality8k'),
    '16k': document.getElementById('finalQuality16k')
  };
  Object.entries(map).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle('on', appState.finalQuality === key);
  });
}
function setFinalQuality(level) {
  appState.finalQuality = level;
  syncFinalQualityChip();
  renderFinalArtwork();
  const plan = resolveSafeFinalExportPlan(level);
  if (plan.requested && !isFinalExportEstimateSafe(plan.requested)) {
    showToast(`${plan.requested.label} 可能超过浏览器导出限制，保存时会自动降级`);
  }
}
function renderFinalLegend() {
  const container = document.getElementById('finalCanvasLegend');
  if (!container) return;
  const chips = [...(appState.colorStats || [])].sort((a, b) => {
    const countDiff = (b.count || 0) - (a.count || 0);
    return countDiff || a.idx - b.idx;
  });
  if (!chips.length) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.style.width = '100%';
  container.style.marginLeft = '0';
  container.style.marginRight = '0';
  container.innerHTML =
    `<div class="final-legend-grid">` +
    chips.map((chip) => (
      `<div class="final-legend-item">` +
        `<span class="final-legend-swatch">${chip.id}</span>` +
        `<span class="final-legend-count">${chip.count}</span>` +
      `</div>`
    )).join('') +
    `</div>`;
  chips.forEach((chip, index) => {
    const item = container.querySelectorAll('.final-legend-item')[index];
    if (!item) return;
    const swatch = item.querySelector('.final-legend-swatch');
    const lum = (chip.r * 0.299 + chip.g * 0.587 + chip.b * 0.114) / 255;
    const fg = lum < 0.58 ? '#fff' : '#333';
    if (swatch) {
      swatch.style.background = `rgb(${chip.r},${chip.g},${chip.b})`;
      swatch.style.color = fg;
    }
  });
}
function bgFromComputed(value) {
  return value || '#ddd';
}
function setWorkspaceMode(mode, skipRender) {
  const prevMode = appState.workspaceMode;
  appState.workspaceMode = mode;
  const previewPanel = document.getElementById('workspacePreviewPanel');
  const editPanel = document.getElementById('workspaceEditPanel');
  const previewTab = document.getElementById('workspaceTabPreview');
  const editTab = document.getElementById('workspaceTabEdit');
  if (previewPanel) previewPanel.classList.toggle('active', mode === 'preview');
  if (editPanel) editPanel.classList.toggle('active', mode === 'edit');
  if (previewTab) previewTab.classList.toggle('active', mode === 'preview');
  if (editTab) editTab.classList.toggle('active', mode === 'edit');
  if (mode === 'edit') {
    appState.editViewportDirty = true;
    initEditPage();
    requestAnimationFrame(() => requestAnimationFrame(() => renderEditCanvas()));
  } else {
    // 从编辑回到预览：强制重建 PaletteInteraction（gridData 可能已被编辑覆写）
    if (prevMode === 'edit' && !skipRender) {
      try {
        if (window.PaletteInteraction && typeof window.PaletteInteraction.destroy === 'function') {
          window.PaletteInteraction.destroy();
        }
        appState.displayGridData = null;
        if (typeof initPaletteInteractionForCurrent === 'function') initPaletteInteractionForCurrent();
      } catch (e) { console.warn('[setWorkspaceMode] reinit palette failed', e); }
    }
    if (!skipRender) renderResult(true);
  }
}
function invalidateEditState() {
  appState.gridVersion += 1;
  appState.editGridData = null;
  appState.editBaseGridData = null;
  appState.editSourceVersion = -1;
  appState.undoStack = [];
  appState.pendingStrokeAction = null;
  appState.displayGridData = null;
  // 清掉色块高亮状态（避免编辑后旧高亮 idx 错乱）
  appState.highlightedResultColor = null;
}
function openMaterialSheet() {
  renderMaterialList();
  const sheet = document.getElementById('materialSheet');
  if (sheet) sheet.classList.add('show');
}
function closeMaterialSheet() {
  const sheet = document.getElementById('materialSheet');
  if (sheet) sheet.classList.remove('show');
}
function buildMaterialItems() {
  if (!appState.colorStats) return [];
  const pricePer50 = 0.9;
  return appState.colorStats.map(s => {
    const need = s.count;
    const buy = Math.ceil(need / 50) * 50;
    const price = (buy / 50) * pricePer50;
    return {
      ...s,
      name: `${s.id} 色`,
      need,
      buy,
      price
    };
  });
}
function renderMaterialList() {
  const summary = document.getElementById('materialSummary');
  const list = document.getElementById('materialList');
  if (!summary || !list || !appState.materials) return;
  const items = appState.materials;
  const totalBeads = items.reduce((sum, item) => sum + item.need, 0);
  const totalCost = items.reduce((sum, item) => sum + item.price, 0);
  summary.innerHTML =
    `<div><div class="num">${totalBeads.toLocaleString()}</div><div class="label">总颗数</div></div>` +
    `<div><div class="num">${items.length}</div><div class="label">颜色</div></div>` +
    `<div><div class="num" style="color:var(--accent)">¥${totalCost.toFixed(1)}</div><div class="label">费用</div></div>`;
  list.innerHTML = items.map(item =>
    `<div class="material-item">` +
    `<div class="material-swatch" style="background:rgb(${item.r},${item.g},${item.b})"></div>` +
    `<span class="material-name">${item.name}</span>` +
    `<span class="material-code">${item.id}</span>` +
    `<span class="material-need">${item.need}</span>` +
    `<span class="material-buy">${item.buy}</span>` +
    `<span class="material-price">¥${item.price.toFixed(1)}</span>` +
    `</div>`
  ).join('');
}

function syncPaletteSystemChip() {
  const tag = document.getElementById('paletteSystemTag');
  if (!tag) return;
  tag.textContent = getBeadSystemLabel();
}

function ensureSolutionKey() {
  if (!appState.currentSolutionKey) {
    appState.currentSolutionKey = `image-convert:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }
  return appState.currentSolutionKey;
}

function buildSolutionCartPayload() {
  if (!appState.metadata || !appState.materials) return null;
  const totalCost = appState.materials.reduce((sum, item) => sum + item.price, 0);
  const beadLabel = getBeadSystemLabel();
  const resultCanvas = document.getElementById('resultCanvas');
  const thumbDataUrl = resultCanvas ? resultCanvas.toDataURL('image/png') : '';
  return {
    id: ensureSolutionKey(),
    dedupeKey: ensureSolutionKey(),
    kind: 'solution',
    source: 'image-convert',
    title: '图片转换方案',
    subtitle: `${appState.metadata.cols}×${appState.metadata.rows} · ${appState.metadata.colorCount}色 · ${appState.metadata.totalBeads.toLocaleString()}颗`,
    price: Number(totalCost.toFixed(1)),
    quantity: 1,
    selected: true,
    thumbDataUrl,
    materialSummary: `${beadLabel} · ${appState.materials.length}色 · 预计¥${totalCost.toFixed(1)}`,
    materials: appState.materials.map(item => ({
      id: item.id,
      name: item.name,
      need: item.need,
      buy: item.buy,
      price: Number(item.price.toFixed(1)),
      rgb: [item.r, item.g, item.b]
    })),
    metadata: {
      beadSystem: appState.beadSystem,
      cols: appState.metadata.cols,
      rows: appState.metadata.rows,
      colorCount: appState.metadata.colorCount,
      totalBeads: appState.metadata.totalBeads,
      profileId: appState.profileId
    }
  };
}

function getExportCellSize(rows, cols) {
  const maxSide = Math.max(rows, cols);
  if (maxSide <= 58) return 18;
  if (maxSide <= 87) return 14;
  if (maxSide <= 116) return 11;
  return 8;
}

function getFinalQualityConfig() {
  const quality = appState.finalQuality || 'hd';
  if (quality === 'standard') return { label: '普通', exportMultiplier: 1 };
  if (quality === 'ultra') return { label: '超清', exportMultiplier: 4 };
  if (quality === '8k') return { label: '臻清', exportMultiplier: 8 };
  if (quality === '16k') return { label: '印刷级', exportMultiplier: 16 };
  return { label: '高清', exportMultiplier: 2 };
}

function getFinalExportLegendLayout(chipCount, legendWidth, uiScale) {
  const count = Math.max(0, Number(chipCount) || 0);
  if (!count) {
    return {
      columns: 0,
      rows: 0,
      chipWidth: 0,
      chipHeight: 0,
      swatchSize: 0,
      chipGapX: 0,
      chipGapY: 0,
      showText: false
    };
  }
  const maxChipWidth = 18 * uiScale;
  const chipGapX = count > 1
    ? Math.max(1, Math.min(6 * uiScale, (legendWidth / count) * 0.18))
    : 0;
  const availableWidth = Math.max(1, legendWidth - chipGapX * Math.max(0, count - 1));
  const chipWidth = Math.max(1, Math.min(maxChipWidth, availableWidth / count));
  const swatchSize = Math.max(1, Math.floor(chipWidth));
  const showText = swatchSize >= 10 * uiScale;
  return {
    columns: count,
    rows: 1,
    chipWidth: swatchSize,
    chipHeight: showText ? swatchSize + 10 * uiScale : swatchSize,
    swatchSize,
    chipGapX,
    chipGapY: 0,
    showText
  };
}

const FINAL_EXPORT_BUDGET = {
  maxSide: 12000,
  maxPixels: 64000000,
  maxEstimatedBytes: 256 * 1024 * 1024
};

function getFinalQualityConfigByLevel(level) {
  const previous = appState.finalQuality;
  appState.finalQuality = level;
  const config = getFinalQualityConfig();
  appState.finalQuality = previous;
  return config;
}

function estimateFinalArtworkExport(level, includeLegend) {
  if (!appState.gridData || !appState.metadata) return null;
  const rows = appState.metadata.rows;
  const cols = appState.metadata.cols;
  const config = getFinalQualityConfigByLevel(level);
  const uiScale = Math.max(1, Number(config.exportMultiplier || 1));
  const cellSize = (350 * uiScale) / Math.max(cols, 1);
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;
  const paddingX = 2 * uiScale;
  const chips = (appState.colorStats || []);
  const legendLayout = getFinalExportLegendLayout(chips.length, gridWidth, uiScale);
  const legendHeight = legendLayout.rows * legendLayout.chipHeight + Math.max(0, legendLayout.rows - 1) * legendLayout.chipGapY;
  const footerH = includeLegend ? (4 * uiScale) + (4 * uiScale) + legendHeight + (8 * uiScale) : 0;
  const width = Math.round(gridWidth + paddingX * 2);
  const height = Math.round(gridHeight + footerH);
  const pixelCount = width * height;
  return {
    level,
    label: config.label,
    exportMultiplier: uiScale,
    width,
    height,
    pixelCount,
    estimatedBytes: pixelCount * 4
  };
}

function isFinalExportEstimateSafe(estimate) {
  return !!estimate
    && estimate.width <= FINAL_EXPORT_BUDGET.maxSide
    && estimate.height <= FINAL_EXPORT_BUDGET.maxSide
    && estimate.pixelCount <= FINAL_EXPORT_BUDGET.maxPixels
    && estimate.estimatedBytes <= FINAL_EXPORT_BUDGET.maxEstimatedBytes;
}

function resolveSafeFinalExportPlan(level) {
  const order = ['standard', 'hd', 'ultra', '8k', '16k'];
  const requestedIndex = Math.max(0, order.indexOf(level || 'hd'));
  const requested = estimateFinalArtworkExport(order[requestedIndex], true);
  if (isFinalExportEstimateSafe(requested)) {
    return { requested, selected: requested, downgraded: false };
  }
  for (let i = requestedIndex - 1; i >= 0; i--) {
    const candidate = estimateFinalArtworkExport(order[i], true);
    if (isFinalExportEstimateSafe(candidate)) {
      return { requested, selected: candidate, downgraded: true };
    }
  }
  return { requested, selected: null, downgraded: false };
}

function drawFinalAxisLabels(ctx, rows, cols, cellSize, originX, originY, gridWidth, gridHeight, axisBand) {
  ctx.save();
  ctx.strokeStyle = '#a9b9ff';
  ctx.lineWidth = Math.max(2, cellSize * 0.18);
  ctx.strokeRect(originX - ctx.lineWidth / 2, originY - ctx.lineWidth / 2, gridWidth + ctx.lineWidth, gridHeight + ctx.lineWidth);
  ctx.restore();
}

function renderFinalArtwork(targetCanvas, options) {
  if (!options) options = {};
  if (!appState.gridData || !appState.metadata) return;
  var canvas = targetCanvas || document.getElementById('finalCanvas');
  if (!canvas) return;
  var includeLegend = options.includeLegend === true;
  var rows = appState.metadata.rows;
  var cols = appState.metadata.cols;
  var exportMultiplier = Math.max(1, Number(options.exportMultiplier || 1));
  var isExportCanvas = !!targetCanvas;
  var pixelRatio = isExportCanvas ? 1 : Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  var uiScale = isExportCanvas ? exportMultiplier : 1;
  var cellSize = isExportCanvas ? (350 * uiScale) / Math.max(cols, 1) : 12;
  var gridWidth = cols * cellSize;
  var gridHeight = rows * cellSize;
  var paddingX = isExportCanvas ? 2 * uiScale : 0;
  var topHeaderH = 0;
  var topGap = 0;
  var axisBand = 0;
  var footerGap = 0;
  var legendTitleH = 0;
  var legendTopGap = 4 * uiScale;
  var legendListTop = 4 * uiScale;
  var legendBottomPad = 8 * uiScale;
  var chipHeight = 22 * uiScale;
  var chipGapX = 6 * uiScale;
  var chipGapY = 4 * uiScale;
  var gridOriginX = paddingX + axisBand;
  var gridOriginY = topHeaderH + topGap + axisBand;
  var exportWidth = gridWidth + paddingX * 2 + axisBand;
  var chips = (appState.colorStats || []).slice().sort(function(a, b) {
    var countDiff = (b.count || 0) - (a.count || 0);
    return countDiff || a.idx - b.idx;
  }).map(function(item) {
    return { label: item.id, rgb: [item.r, item.g, item.b], count: item.count, text: String(item.id) };
  });
  var legendOriginX = gridOriginX;
  var legendWidth = gridWidth;
  var legendLayout = getFinalExportLegendLayout(chips.length, legendWidth, uiScale);
  var legendColumns = legendLayout.columns || 1;
  var chipWidth = legendLayout.chipWidth;
  chipHeight = legendLayout.chipHeight || chipHeight;
  chipGapX = legendLayout.chipGapX;
  chipGapY = legendLayout.chipGapY;
  var chipRowsCount = legendLayout.rows;
  var legendHeight = chipRowsCount * chipHeight + Math.max(0, chipRowsCount - 1) * chipGapY;
  var footerH = includeLegend ? legendTopGap + legendTitleH + legendListTop + legendHeight + legendBottomPad : 0;
  var logicalWidth = exportWidth;
  var logicalHeight = topHeaderH + topGap + axisBand + gridHeight + footerGap + footerH;
  canvas.width = Math.round(logicalWidth * pixelRatio);
  canvas.height = Math.round(logicalHeight * pixelRatio);
  if (!isExportCanvas) {
    canvas.style.width = '100%';
    canvas.style.maxWidth = 'none';
    canvas.style.height = 'auto';
  }
  var ctx = canvas.getContext('2d');
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);
  drawFinalAxisLabels(ctx, rows, cols, cellSize, gridOriginX, gridOriginY, gridWidth, gridHeight, axisBand);
  ctx.save();
  ctx.translate(gridOriginX, topHeaderH + topGap + axisBand);
  drawGrid(ctx, _pickGridDataForRender(), rows, cols, cellSize, true, appState.finalShowLabels !== false, false);
  ctx.restore();
  if (includeLegend) {
    var footerTop = gridOriginY + gridHeight + footerGap;
    ctx.fillStyle = '#f1f3f7';
    ctx.fillRect(legendOriginX - 4 * uiScale, footerTop, legendWidth + 8 * uiScale, footerH);
    ctx.strokeStyle = 'rgba(0,0,0,.06)';
    ctx.lineWidth = Math.max(1, uiScale * 0.8);
    ctx.beginPath();
    ctx.moveTo(legendOriginX - 4 * uiScale, footerTop + 0.5 * uiScale);
    ctx.lineTo(legendOriginX + legendWidth + 4 * uiScale, footerTop + 0.5 * uiScale);
    ctx.stroke();
    var y = footerTop + legendTopGap + legendListTop;
    chips.forEach(function(chip, index) {
      var row = Math.floor(index / legendColumns);
      var col = index % legendColumns;
      var x = legendOriginX + col * (chipWidth + chipGapX);
      var chipY = y + row * (chipHeight + chipGapY);
      ctx.fillStyle = 'rgb(' + chip.rgb[0] + ',' + chip.rgb[1] + ',' + chip.rgb[2] + ')';
      ctx.beginPath();
      var swatchSize = legendLayout.swatchSize || chipWidth;
      ctx.roundRect(x, chipY, swatchSize, swatchSize, Math.max(1, Math.min(3 * uiScale, swatchSize * 0.25)));
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.08)';
      ctx.lineWidth = Math.max(0.6, uiScale * 0.5);
      ctx.stroke();
      if (!legendLayout.showText) return;
      var lum = (chip.rgb[0] * 0.299 + chip.rgb[1] * 0.587 + chip.rgb[2] * 0.114) / 255;
      ctx.fillStyle = lum < 0.58 ? '#fff' : '#333';
      ctx.textAlign = 'center';
      ctx.font = 'bold ' + Math.max(6, 6 * uiScale) + 'px "SFMono-Regular", Consolas, monospace';
      ctx.fillText(chip.text, x + swatchSize / 2, chipY + swatchSize * 0.62);
      ctx.fillStyle = '#666';
      ctx.font = Math.max(6, 6 * uiScale) + 'px "SFMono-Regular", Consolas, monospace';
      ctx.fillText(String(chip.count), x + swatchSize / 2, chipY + swatchSize + 7 * uiScale);
    });
  }
  if (!targetCanvas) {
    renderFinalLegend();
  }
}

function saveToBeanWarehouse() {
  showToast('已保存到豆仓（演示）');
}

function addCurrentToFavorites() {
  showToast('已加入收藏');
}

function addMaterialsToCart() {
  const payload = buildSolutionCartPayload();
  if (!payload) {
    showToast('请先生成结果');
    return;
  }
  if (postHostMessage('god-dou:image-convert:add-solution-to-cart', payload)) {
    closeMaterialSheet();
    return;
  }
  showToast('材料已加入购物车（演示）');
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}
async function initCropPage() {
  if (!appState.cropImageSrc) return;
  appState.cropImg = await loadImageFromSrc(appState.cropImageSrc);
  appState.cropViewport = { scale: 1, offsetX: 0, offsetY: 0 };
  resetCropRect();
  renderCropStage();
}
function resetCropRect() {
  const stage = document.getElementById('cropStage');
  if (!stage || !appState.cropImg) return;
  const w = stage.clientWidth || 320;
  const h = stage.clientHeight || 320;
  const fit = Math.min(w / appState.cropImg.width, h / appState.cropImg.height);
  const imgW = Math.round(appState.cropImg.width * fit);
  const imgH = Math.round(appState.cropImg.height * fit);
  const imgX = Math.round((w - imgW) / 2);
  const imgY = Math.round((h - imgH) / 2);
  appState.cropRect = {
    x: imgX,
    y: imgY,
    w: Math.max(80, imgW),
    h: Math.max(80, imgH)
  };
  appState.cropViewport = { scale: 1, offsetX: imgX, offsetY: imgY };
  renderCropStage();
}
function resetCropViewport() {
  appState.cropViewport = { scale: 1, offsetX: 0, offsetY: 0 };
  renderCropStage();
}
function getCropImageBounds() {
  const stage = document.getElementById('cropStage');
  if (!stage || !appState.cropImg) return null;
  const vw = stage.clientWidth || 320;
  const vh = stage.clientHeight || 320;
  const fit = Math.min(vw / appState.cropImg.width, vh / appState.cropImg.height);
  const baseW = Math.round(appState.cropImg.width * fit);
  const baseH = Math.round(appState.cropImg.height * fit);
  const scaledW = baseW * appState.cropViewport.scale;
  const scaledH = baseH * appState.cropViewport.scale;
  return {
    x: appState.cropViewport.offsetX,
    y: appState.cropViewport.offsetY,
    w: scaledW,
    h: scaledH
  };
}
function clampCropViewport(baseW, baseH) {
  const stage = document.getElementById('cropStage');
  if (!stage) return;
  const vw = stage.clientWidth || 320;
  const vh = stage.clientHeight || 320;
  appState.cropViewport.scale = Math.max(0.5, Math.min(4, appState.cropViewport.scale || 1));
  const scaledW = baseW * appState.cropViewport.scale;
  const scaledH = baseH * appState.cropViewport.scale;
  const minX = Math.min(0, vw - scaledW);
  const maxX = Math.max(0, vw - scaledW);
  const minY = Math.min(0, vh - scaledH);
  const maxY = Math.max(0, vh - scaledH);
  appState.cropViewport.offsetX = Math.min(maxX, Math.max(minX, appState.cropViewport.offsetX));
  appState.cropViewport.offsetY = Math.min(maxY, Math.max(minY, appState.cropViewport.offsetY));
}
function renderCropStage() {
  const stage = document.getElementById('cropStage');
  const canvas = document.getElementById('cropCanvas');
  const cropBox = document.getElementById('cropBox');
  if (!stage || !canvas || !cropBox || !appState.cropImg) return;
  const ctx = canvas.getContext('2d');
  const vw = stage.clientWidth || 320;
  const vh = stage.clientHeight || 320;
  const fit = Math.min(vw / appState.cropImg.width, vh / appState.cropImg.height);
  const dw = Math.round(appState.cropImg.width * fit);
  const dh = Math.round(appState.cropImg.height * fit);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  canvas.style.width = vw + 'px';
  canvas.style.height = vh + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, vw, vh);
  if (appState.cropViewport.scale === 1 && appState.cropViewport.offsetX === 0 && appState.cropViewport.offsetY === 0) {
    appState.cropViewport.offsetX = Math.round((vw - dw) / 2);
    appState.cropViewport.offsetY = Math.round((vh - dh) / 2);
  }
  clampCropViewport(dw, dh);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    appState.cropImg,
    appState.cropViewport.offsetX,
    appState.cropViewport.offsetY,
    dw * appState.cropViewport.scale,
    dh * appState.cropViewport.scale
  );
  cropBox.style.left = appState.cropRect.x + 'px';
  cropBox.style.top = appState.cropRect.y + 'px';
  cropBox.style.width = appState.cropRect.w + 'px';
  cropBox.style.height = appState.cropRect.h + 'px';
}
function cancelCrop() {
  navigateTo('page-convert');
}
function dataUrlToFile(dataUrl, filename) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}
function confirmCrop() {
  const stage = document.getElementById('cropStage');
  if (!stage || !appState.cropImg) return;
  const fit = Math.min(stage.clientWidth / appState.cropImg.width, stage.clientHeight / appState.cropImg.height);
  const imgDisplayW = appState.cropImg.width * fit * appState.cropViewport.scale;
  const imgDisplayH = appState.cropImg.height * fit * appState.cropViewport.scale;
  const imgX = appState.cropViewport.offsetX;
  const imgY = appState.cropViewport.offsetY;
  const sx = Math.max(0, (appState.cropRect.x - imgX) / Math.max(1, imgDisplayW) * appState.cropImg.width);
  const sy = Math.max(0, (appState.cropRect.y - imgY) / Math.max(1, imgDisplayH) * appState.cropImg.height);
  const sw = Math.min(appState.cropImg.width - sx, appState.cropRect.w / Math.max(1, imgDisplayW) * appState.cropImg.width);
  const sh = Math.min(appState.cropImg.height - sy, appState.cropRect.h / Math.max(1, imgDisplayH) * appState.cropImg.height);
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(sw));
  out.height = Math.max(1, Math.round(sh));
  const octx = out.getContext('2d');
  octx.drawImage(appState.cropImg, sx, sy, sw, sh, 0, 0, out.width, out.height);
  const dataUrl = out.toDataURL('image/png');
  appState.cropImageSrc = dataUrl;
  appState.file = dataUrlToFile(dataUrl, 'cropped.png');
  appState.targetGridRows = null;
  appState.targetGridCols = null;
  appState.targetShortSide = null;
    appState.cachedImg = null; appState.cachedImageData = null;
  appState.bgMask = null; appState.fullGridData = null; appState.smartResolvedForFile = false;
  appState.previewScale = 0; appState.previewOffsetX = 0; appState.previewOffsetY = 0; appState.previewNeedsReset = true;
  document.getElementById('previewImg').src = dataUrl;
  document.getElementById('previewImg').style.display = 'block';
  document.getElementById('uploadPlaceholder').style.display = 'none';
  document.getElementById('uploadArea').classList.add('has-image');
  navigateTo('page-convert');
  triggerLiveConvert(true);
}
function handleFileSelect(e) {
  const input = e && e.target ? e.target : null;
  const file = input && input.files ? input.files[0] : null;
  if (!file) return;
  if (!file.type || !file.type.startsWith('image/')) {
    showToast('请选择 JPG/PNG/WebP 图片文件');
    if (input) input.value = '';
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showToast('图片过大，请压缩到 20MB 以内');
    if (input) input.value = '';
    return;
  }
  appState.liveJobId++;
  appState.currentSolutionKey = '';
  appState.hideOriginalPreview = false;
  appState.targetGridRows = null;
  appState.targetGridCols = null;
  appState.targetShortSide = null;
  appState.cachedImg = null; appState.cachedImageData = null;
  appState.bgMask = null; appState.fullGridData = null; appState.smartResolvedForFile = false;
  appState.fromAiCandidate = false;
  const reader = new FileReader();
  reader.onload = ev => {
    if (!ev.target || !ev.target.result) {
      showToast('预览读取失败，请重试');
      return;
    }
    appState.cropImageSrc = ev.target.result;
    document.getElementById('previewImg').src = ev.target.result;
    document.getElementById('previewImg').style.display = 'block';
    document.getElementById('uploadPlaceholder').style.display = 'none';
    document.getElementById('uploadArea').classList.add('has-image');
    navigateTo('page-crop');
    initCropPage();
  };
  reader.onerror = () => showToast('预览读取失败，请重试');
  reader.readAsDataURL(file);
  if (input) input.value = '';
}
function updateSizeQuickInfo(sizeKey) {
  const quickInfo = document.getElementById('sizeQuickInfo');
  if (!quickInfo) return;
  const infoMap = {
    '29': '统一调节尺寸',
    '58': '统一调节尺寸',
    '87': '统一调节尺寸',
    '116': '统一调节尺寸',
    custom: '统一调节尺寸'
  };
  quickInfo.textContent = infoMap[sizeKey] || infoMap['29'];
}
function onSizePresetChange(value) {
  const size = value === 'custom' ? 'custom' : parseInt(value, 10);
  selectSize(size, null);
}
function setUploadAreaCompact(compact) {
  const uploadArea = document.getElementById('uploadArea');
  if (!uploadArea) return;
  uploadArea.classList.toggle('compact', !!compact);
}
function hideUploadPreview() {
  const previewImg = document.getElementById('previewImg');
  const placeholder = document.getElementById('uploadPlaceholder');
  const uploadArea = document.getElementById('uploadArea');
  if (previewImg) previewImg.style.display = 'none';
  if (placeholder) placeholder.style.display = 'block';
  if (uploadArea) uploadArea.classList.remove('has-image');
  setUploadAreaCompact(true);
  syncConvertBottomBar(false);
}
function selectSize(size, el) {
  document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  const sizeSelect = document.getElementById('sizePresetSelect');
  const customInput = document.getElementById('customSizeInput');
  const sizeKey = size === 'custom' ? 'custom' : String(size);
  if (sizeSelect) sizeSelect.value = sizeKey;
  updateSizeQuickInfo(sizeKey);
  const customRow = document.getElementById('customSizeRow');
  if (size === 'custom') {
    customRow.style.display = 'flex';
    appState.pixN = parseInt(document.getElementById('customSizeInput').value) || 50;
    commitCustomSize();
    return;
  }
  customRow.style.display = 'flex';
  appState.pixN = size;
  if (customInput) customInput.value = String(size);
  appState.previewNeedsReset = true;
  renderCustomSizeDetail(size);
  updateSizeInfo();
  triggerLiveConvert(false);
}
function renderCustomSizeDetail(value, message) {
  const detail = document.getElementById('customSizeDetail');
  if (!detail) return;
  detail.textContent = '';
}
function onCustomSizeInput() {
  const input = document.getElementById('customSizeInput');
  if (!input) return;
  document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
  const sizeSelect = document.getElementById('sizePresetSelect');
  if (sizeSelect) sizeSelect.value = 'custom';
  const raw = input.value.trim();
  if (!raw) {
    renderCustomSizeDetail(null, '建议 40~96 之间，格数越大越细致，但制作成本也会更高。');
    return;
  }
  const value = parseInt(raw, 10);
  if (!Number.isInteger(value)) {
    renderCustomSizeDetail(null, '请输入有效数字');
    return;
  }
  if (value < 10 || value > 200) {
    renderCustomSizeDetail(null, '可输入范围：10-200');
    return;
  }
  appState.pixN = value;
  appState.previewNeedsReset = true;
  updateSizeQuickInfo('custom');
  renderCustomSizeDetail(value);
  updateSizeInfo();
  triggerLiveConvert(false);
}
function commitCustomSize() {
  const input = document.getElementById('customSizeInput');
  if (!input) return;
  document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
  const sizeSelect = document.getElementById('sizePresetSelect');
  if (sizeSelect) sizeSelect.value = 'custom';
  let value = parseInt(input.value, 10);
  if (!Number.isInteger(value)) value = appState.pixN || 50;
  if (value < 10) value = 10;
  if (value > 200) value = 200;
  input.value = value;
  appState.pixN = value;
  appState.previewNeedsReset = true;
  updateSizeQuickInfo('custom');
  renderCustomSizeDetail(value);
  updateSizeInfo();
  triggerLiveConvert(false);
}
function getBoardCount(n) {
  return Math.ceil(n / 29) * Math.ceil(n / 29);
}
function updateSizeInfo() {
  const n = appState.pixN;
  const total = n * n;
  const boards = getBoardCount(n);
  document.getElementById('sizeInfo').textContent =
    `${total.toLocaleString()}颗 · ${n}×${n}拼豆 · 需${boards}块拼板`;
}
const PROFILE_PRESETS = {
  smart: {
    fallback: 'smart_balanced'
  },
  smart_balanced: {
    label: '智能推荐',
    samplingMode: 'dominant',
    edgeBias: 0.5,
    useKMeansQuantize: true,
    minIslandSize: 5,
    dither: 0,
    similarMerge: 14,
    refine: 70,
    centerBias: 0.48,
    quantizeMode: 'medium',
    darkLineBoost: 0.56,
    warmSpeckleGuard: 0.66,
    postMergeFactor: 0.55,
    featureProtect: 0.58,
    darkFringeClean: 0.58,
    hairRegionDetectStrength: 0.88,
    hairPaletteLevels: 2,
    hairNeutralReject: 0.92,
    hairInteriorSmooth: 0.78,
    hairBoundaryProtect: 0.72,
    figureBoundaryClean: 0.78,
    clothNoiseClean: 0.68,
    removeBg: true,
    hint: '优先生成更干净、更稳妥、适合真实拼豆落地的效果图'
  },
  smart_portrait: {
    label: '智能推荐',
    samplingMode: 'dominant',
    edgeBias: 0.4,
    useKMeansQuantize: true,
    minIslandSize: 4,
    dither: 0,
    similarMerge: 10,
    refine: 58,
    centerBias: 0.38,
    quantizeMode: 'soft',
    darkLineBoost: 0.24,
    warmSpeckleGuard: 0.58,
    postMergeFactor: 0.35,
    featureProtect: 0.82,
    darkFringeClean: 0.36,
    hairRegionDetectStrength: 0.96,
    hairPaletteLevels: 2,
    hairNeutralReject: 0.96,
    hairInteriorSmooth: 0.84,
    hairBoundaryProtect: 0.76,
    figureBoundaryClean: 0.84,
    clothNoiseClean: 0.74,
    removeBg: true,
    hint: '检测到真实照片或人像，优先保留主体层次并控制脏色'
  },
  smart_graphic: {
    label: '智能推荐',
    samplingMode: 'dominant',
    edgeBias: 0.8,
    useKMeansQuantize: true,
    minIslandSize: 6,
    dither: 0,
    similarMerge: 18,
    refine: 84,
    centerBias: 0.66,
    quantizeMode: 'strong',
    darkLineBoost: 0.92,
    warmSpeckleGuard: 0.9,
    postMergeFactor: 0.72,
    featureProtect: 0.68,
    darkFringeClean: 0.82,
    hairRegionDetectStrength: 0.26,
    hairPaletteLevels: 2,
    hairNeutralReject: 0.36,
    hairInteriorSmooth: 0.12,
    hairBoundaryProtect: 0.9,
    figureBoundaryClean: 0.22,
    clothNoiseClean: 0.18,
    removeBg: true,
    hint: '检测到卡通或强轮廓画面，优先压杂色并强化边缘'
  },
  portrait_opt: {
    label: '人像优化',
    samplingMode: 'dominant',
    edgeBias: 0.4,
    useKMeansQuantize: true,
    minIslandSize: 4,
    dither: 0,
    similarMerge: 10,
    refine: 58,
    centerBias: 0.38,
    quantizeMode: 'soft',
    darkLineBoost: 0.24,
    warmSpeckleGuard: 0.58,
    postMergeFactor: 0.35,
    featureProtect: 0.82,
    darkFringeClean: 0.36,
    hairRegionDetectStrength: 0.96,
    hairPaletteLevels: 2,
    hairNeutralReject: 0.96,
    hairInteriorSmooth: 0.84,
    hairBoundaryProtect: 0.76,
    figureBoundaryClean: 0.84,
    clothNoiseClean: 0.82,
    removeBg: true,
    hint: '针对人物、情侣、Q版头像做专门优化，优先处理头发、衣服与肩颈边界'
  },
  detail_keep: {
    label: '细节保真',
    samplingMode: 'mean',
    dither: 0,
    similarMerge: 6,
    refine: 30,
    centerBias: 0.32,
    quantizeMode: 'off',
    darkLineBoost: 0.18,
    warmSpeckleGuard: 0.28,
    postMergeFactor: 0.18,
    featureProtect: 0.92,
    darkFringeClean: 0.18,
    hairRegionDetectStrength: 0.98,
    hairPaletteLevels: 2,
    hairNeutralReject: 0.98,
    hairInteriorSmooth: 0.88,
    hairBoundaryProtect: 0.78,
    figureBoundaryClean: 0.82,
    clothNoiseClean: 0.78,
    removeBg: true,
    hint: '尽量保留原图细节和层次，适合想保真而接受颜色稍多的场景'
  },
  line_boost: {
    label: '线稿强化',
    samplingMode: 'dominant',
    edgeBias: 0.9,
    useKMeansQuantize: true,
    minIslandSize: 5,
    dither: 0,
    similarMerge: 22,
    refine: 92,
    centerBias: 0.82,
    quantizeMode: 'strong',
    darkLineBoost: 1,
    warmSpeckleGuard: 0.96,
    postMergeFactor: 0.84,
    featureProtect: 0.72,
    darkFringeClean: 1,
    hairRegionDetectStrength: 0,
    hairPaletteLevels: 0,
    hairNeutralReject: 0,
    hairInteriorSmooth: 0,
    hairBoundaryProtect: 0,
    figureBoundaryClean: 0,
    clothNoiseClean: 0,
    removeBg: true,
    hint: '强化边缘和轮廓，压掉杂色和灰边，适合卡通、二次元、图标类画面'
  }
};
const PROFILE_TAG_MAP = {
  smart: 'profileSmart',
  detail_keep: 'profileDetailKeep',
  line_boost: 'profileLineBoost',
  portrait_opt: 'profilePortrait'
};
function updateProfileTagState(profileId) {
  Object.entries(PROFILE_TAG_MAP).forEach(([id, elId]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.toggle('active', id === profileId);
  });
}
function analyzeImageFeatures(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const step = Math.max(1, Math.floor(Math.min(width, height) / 180));
  let satSum = 0, satSq = 0, lumSum = 0, lumSq = 0;
  let edgeCount = 0, edgeTotal = 0, count = 0;
  let skinLikeCount = 0;
  const quantBins = new Set();
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const i = (y * width + x) * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max <= 1e-6 ? 0 : (max - min) / max;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (isSkinLikeRaw([data[i], data[i + 1], data[i + 2]])) skinLikeCount++;
      satSum += sat;
      satSq += sat * sat;
      lumSum += lum;
      lumSq += lum * lum;
      count++;
      const qr = Math.floor(r * 15);
      const qg = Math.floor(g * 15);
      const qb = Math.floor(b * 15);
      quantBins.add((qr << 8) | (qg << 4) | qb);
      const ir = (y * width + (x + step < width ? x + step : x)) * 4;
      const id = (((y + step) < height ? y + step : y) * width + x) * 4;
      const diffR = Math.abs(data[i] - data[ir]) + Math.abs(data[i] - data[id]);
      const diffG = Math.abs(data[i + 1] - data[ir + 1]) + Math.abs(data[i + 1] - data[id + 1]);
      const diffB = Math.abs(data[i + 2] - data[ir + 2]) + Math.abs(data[i + 2] - data[id + 2]);
      if (diffR + diffG + diffB > 120) edgeCount++;
      edgeTotal++;
    }
  }
  const satMean = count > 0 ? satSum / count : 0;
  const satStd = Math.sqrt(Math.max(0, satSq / Math.max(count, 1) - satMean * satMean));
  const lumMean = count > 0 ? lumSum / count : 0;
  const lumStd = Math.sqrt(Math.max(0, lumSq / Math.max(count, 1) - lumMean * lumMean));
  const edgeDensity = edgeTotal > 0 ? edgeCount / edgeTotal : 0;
  return {
    satMean,
    satStd,
    lumStd,
    edgeDensity,
    paletteComplexity: quantBins.size,
    skinLikeRatio: count > 0 ? skinLikeCount / count : 0
  };
}
function resolveSmartProfile(imageData) {
  const f = analyzeImageFeatures(imageData);
  if (f.skinLikeRatio > 0.06) {
    return { id: 'smart_portrait', reason: '检测到明显人物肤色区域，已优先使用人物优化方案' };
  }
  if (f.satMean < 0.18 && f.lumStd < 0.18) {
    return { id: 'smart_portrait', reason: '检测到低饱和和平滑亮度，已偏向主体保真' };
  }
  if (f.edgeDensity > 0.3 && (f.satMean > 0.28 || f.satStd > 0.18)) {
    return { id: 'smart_graphic', reason: '检测到强轮廓和高饱和，已偏向干净轮廓风格' };
  }
  if (f.paletteComplexity > 420 && f.satStd < 0.2) {
    return { id: 'smart_portrait', reason: '检测到高色彩复杂度，已优先控制杂色并保留主体层次' };
  }
  if (f.edgeDensity > 0.22 && f.paletteComplexity < 260) {
    return { id: 'smart_graphic', reason: '检测到轮廓明显且配色较集中，已偏向线条强化' };
  }
  return { id: 'smart_balanced', reason: '检测到混合特征，已优先使用更稳妥的拼豆效果图方案' };
}
function applyProfileDefaults(defaults, profileHint) {
  appState.ditherStrength = defaults.dither;
  appState.internalMergeLevel = defaults.similarMerge != null ? defaults.similarMerge : 0;
  appState.userSimplifyLevel = 0;
  appState.beadRefineStrength = defaults.refine != null ? defaults.refine : 68;
  applyDefaultsToSliders(defaults);
  const hintEl = document.getElementById('profileHint');
  if (hintEl) {
    hintEl.textContent = profileHint || defaults.hint || '已应用该生图类型参数';
  }
}
function selectRenderProfile(profileId, silent) {
  appState.profileId = profileId;
  updateProfileTagState(profileId);
  if (profileId === 'smart') {
    appState.smartResolvedForFile = false;
    appState.activePresetId = PROFILE_PRESETS.smart.fallback;
    applyProfileDefaults(PROFILE_PRESETS[appState.activePresetId], '智能推荐：上传后自动识别最优参数');
  } else {
    appState.activePresetId = profileId;
    appState.smartResolvedForFile = true;
    applyProfileDefaults(PROFILE_PRESETS[profileId], PROFILE_PRESETS[profileId].hint);
  }
  if (!silent) {
    triggerLiveConvert(false);
  }
}
function applyDefaultsToSliders(defaults) {
  const smSlider = document.getElementById('smLevelSlider');
  const ditherSlider = document.getElementById('ditherSlider');
  const smVal = 0;
  const dv = defaults.dither != null ? defaults.dither : 0;
  smSlider.value = smVal;
  ditherSlider.value = dv;
  refreshColorSimplifyIndicator();
  document.getElementById('ditherVal').textContent = dv;
  syncExperimentControls(false);
}
function refreshColorSimplifyIndicator() {
  const label = document.getElementById('smLevelVal');
  if (!label) return;
  const currentCount = appState.colorStats ? appState.colorStats.length : 0;
  label.textContent = `${currentCount > 0 ? currentCount : 0}种`;
}
function getBaseHairExperimentSettings() {
  const preset = PROFILE_PRESETS[appState.activePresetId] || PROFILE_PRESETS.detail_keep;
  return {
    hairRegionDetectStrength: Number(preset.hairRegionDetectStrength || 0),
    hairPaletteLevels: Number(preset.hairPaletteLevels || 3),
    hairNeutralReject: Number(preset.hairNeutralReject || 0),
    hairInteriorSmooth: Number(preset.hairInteriorSmooth || 0),
    hairBoundaryProtect: Number(preset.hairBoundaryProtect || 0),
    figureBoundaryClean: Number(preset.figureBoundaryClean || 0)
  };
}
function getEffectiveHairExperimentSettings() {
  const base = getBaseHairExperimentSettings();
  const out = { ...base };
  Object.keys(out).forEach(key => {
    const override = appState.experimentOverrides[key];
    if (override != null && Number.isFinite(override)) out[key] = override;
  });
  const scene = appState.experimentScene || 'auto';
  if (scene === 'portrait') {
    out.hairRegionDetectStrength = Math.min(1, out.hairRegionDetectStrength * 1.12);
    out.hairInteriorSmooth = Math.min(1, out.hairInteriorSmooth * 1.12);
    out.hairBoundaryProtect = Math.min(1, out.hairBoundaryProtect * 1.08);
  } else if (scene === 'general') {
    out.hairRegionDetectStrength = Math.max(0, out.hairRegionDetectStrength * 0.88);
    out.hairInteriorSmooth = Math.max(0, out.hairInteriorSmooth * 0.92);
  }
  return out;
}
function syncExperimentControls(useOverrides) {
  const base = getBaseHairExperimentSettings();
  const sceneSelect = document.getElementById('expSceneSelect');
  if (sceneSelect) sceneSelect.value = appState.experimentScene || 'auto';
  const effective = useOverrides ? getEffectiveHairExperimentSettings() : base;
  const mapping = [
    ['hairRegionDetectStrength', 'expDetectSlider', 'expDetectVal', v => Math.round(v * 100)],
    ['hairPaletteLevels', 'expPaletteSlider', 'expPaletteVal', v => Math.round(v)],
    ['hairNeutralReject', 'expNeutralSlider', 'expNeutralVal', v => Math.round(v * 100)],
    ['hairInteriorSmooth', 'expSmoothSlider', 'expSmoothVal', v => Math.round(v * 100)],
    ['hairBoundaryProtect', 'expBoundarySlider', 'expBoundaryVal', v => Math.round(v * 100)],
    ['figureBoundaryClean', 'expFigureBoundarySlider', 'expFigureBoundaryVal', v => Math.round(v * 100)]
  ];
  mapping.forEach(([key, sliderId, valId, toUi]) => {
    const slider = document.getElementById(sliderId);
    const val = document.getElementById(valId);
    if (!slider || !val) return;
    slider.value = toUi(effective[key]);
    val.textContent = slider.value;
  });
}
function onExperimentControlChange() {
  const sceneSelect = document.getElementById('expSceneSelect');
  appState.experimentScene = sceneSelect ? sceneSelect.value : 'auto';
  const readPct = id => {
    const el = document.getElementById(id);
    return el ? Math.max(0, Math.min(100, parseInt(el.value, 10) || 0)) / 100 : 0;
  };
  const readInt = id => {
    const el = document.getElementById(id);
    return el ? Math.max(2, Math.min(4, parseInt(el.value, 10) || 3)) : 3;
  };
  appState.experimentOverrides.hairRegionDetectStrength = readPct('expDetectSlider');
  appState.experimentOverrides.hairPaletteLevels = readInt('expPaletteSlider');
  appState.experimentOverrides.hairNeutralReject = readPct('expNeutralSlider');
  appState.experimentOverrides.hairInteriorSmooth = readPct('expSmoothSlider');
  appState.experimentOverrides.hairBoundaryProtect = readPct('expBoundarySlider');
  appState.experimentOverrides.figureBoundaryClean = readPct('expFigureBoundarySlider');
  syncExperimentControls(true);
  triggerLiveConvert(false);
}
function resetExperimentControls() {
  appState.experimentScene = 'auto';
  Object.keys(appState.experimentOverrides).forEach(key => appState.experimentOverrides[key] = null);
  syncExperimentControls(false);
  triggerLiveConvert(false);
}
function copyExperimentSettings() {
  const payload = {
    scene: appState.experimentScene,
    ...getEffectiveHairExperimentSettings()
  };
  const text = JSON.stringify(payload, null, 2);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('实验参数已复制'));
  } else {
    showToast('当前环境不支持自动复制');
  }
}
(function initCropInteractions() {
  document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('cropStage');
    const cropBox = document.getElementById('cropBox');
    if (!stage || !cropBox) return;
    let draggingBox = false;
    let resizing = '';
    let startX = 0, startY = 0;
    let startRect = null;
    function clampRect() {
      const bounds = getCropImageBounds();
      if (!bounds) return;
      appState.cropRect.w = Math.max(80, Math.min(bounds.w - 4, appState.cropRect.w));
      appState.cropRect.h = Math.max(80, Math.min(bounds.h - 4, appState.cropRect.h));
      appState.cropRect.x = Math.max(bounds.x, Math.min(bounds.x + bounds.w - appState.cropRect.w, appState.cropRect.x));
      appState.cropRect.y = Math.max(bounds.y, Math.min(bounds.y + bounds.h - appState.cropRect.h, appState.cropRect.y));
    }
    cropBox.addEventListener('mousedown', e => {
      const handle = e.target.dataset.handle || '';
      startX = e.clientX;
      startY = e.clientY;
      startRect = { ...appState.cropRect };
      if (handle) resizing = handle;
      else draggingBox = true;
      e.stopPropagation();
    });
    window.addEventListener('mousemove', e => {
      if (!draggingBox && !resizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (draggingBox) {
        appState.cropRect.x = startRect.x + dx;
        appState.cropRect.y = startRect.y + dy;
      } else {
        if (resizing.includes('e')) appState.cropRect.w = startRect.w + dx;
        if (resizing.includes('s')) appState.cropRect.h = startRect.h + dy;
        if (resizing.includes('w')) { appState.cropRect.x = startRect.x + dx; appState.cropRect.w = startRect.w - dx; }
        if (resizing.includes('n')) { appState.cropRect.y = startRect.y + dy; appState.cropRect.h = startRect.h - dy; }
      }
      clampRect();
      renderCropStage();
    });
    window.addEventListener('mouseup', () => { draggingBox = false; resizing = ''; });
    let draggingImg = false, lastX = 0, lastY = 0, pinchDist = 0, pinchScale = 1;
    stage.addEventListener('mousedown', e => {
      if (e.target.closest('#cropBox')) return;
      draggingImg = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener('mousemove', e => {
      if (!draggingImg) return;
      appState.cropViewport.offsetX += e.clientX - lastX;
      appState.cropViewport.offsetY += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      renderCropStage();
    });
    window.addEventListener('mouseup', () => draggingImg = false);
    stage.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      appState.cropViewport.scale = Math.max(0.5, Math.min(4, appState.cropViewport.scale * delta));
      renderCropStage();
    }, { passive: false });
    stage.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        pinchDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        pinchScale = appState.cropViewport.scale;
      } else if (e.touches.length === 1) {
        lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; draggingImg = true;
      }
    }, { passive: true });
    stage.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        appState.cropViewport.scale = Math.max(0.5, Math.min(4, pinchScale * dist / Math.max(1, pinchDist)));
        renderCropStage();
      } else if (e.touches.length === 1 && draggingImg) {
        const x = e.touches[0].clientX, y = e.touches[0].clientY;
        appState.cropViewport.offsetX += x - lastX;
        appState.cropViewport.offsetY += y - lastY;
        lastX = x; lastY = y;
        renderCropStage();
      }
    }, { passive: true });
    stage.addEventListener('touchend', () => { draggingImg = false; });
  });
})();
function onHandcraftToggle() {
  const isOn = document.getElementById('handcraftToggle').classList.contains('on');
  appState.useHandcraftStyle = isOn;
  triggerLiveConvert(false);
}
function onSliderManual() {
  const sv = document.getElementById('smLevelSlider').value;
  const dv = document.getElementById('ditherSlider').value;
  document.getElementById('ditherVal').textContent = dv;
  appState.userSimplifyLevel = parseInt(sv);
  appState.ditherStrength = parseInt(dv);
  refreshColorSimplifyIndicator();
  triggerLiveConvert(false);
}
function toggleAdvanced() {
  const body = document.getElementById('advBody');
  const arrow = document.getElementById('advArrow');
  body.classList.toggle('open');
  arrow.classList.toggle('open');
}
function triggerLiveConvert(reloadImage) {
  if (!appState.file) return;
  if (appState.liveConvertTimer) clearTimeout(appState.liveConvertTimer);
  if (reloadImage) {
    appState.cachedImg = null; appState.cachedImageData = null;
    appState.bgMask = null; appState.fullGridData = null; appState.smartResolvedForFile = false;
    appState.previewScale = 0;
    appState.previewOffsetX = 0;
    appState.previewOffsetY = 0;
    appState.previewNeedsReset = true;
  }
  const delay = appState.cachedImg ? 80 : 0;
  appState.liveConvertTimer = setTimeout(() => runLiveConvert(), delay);
}
async function runLiveConvert() {
  if (!appState.file) return;
  const proc = document.getElementById('previewProcessing');
  if (proc) proc.classList.add('show');
  const jobId = ++appState.liveJobId;
  try {
    if (!appState.cachedImg) {
      appState.cachedImg = await loadImage(appState.file);
      appState.cachedImageData = getPixelData(appState.cachedImg);
    }
    if (jobId !== appState.liveJobId) return;
    if (appState.profileId === 'smart' && !appState.smartResolvedForFile && appState.cachedImageData) {
      const auto = resolveSmartProfile(appState.cachedImageData);
      appState.activePresetId = auto.id;
      appState.smartResolvedForFile = true;
      applyProfileDefaults(PROFILE_PRESETS[auto.id], '智能推荐：' + auto.reason);
    }
    const img = appState.cachedImg;
    const pixN = appState.pixN;
    if (!img || typeof img.width !== 'number' || typeof img.height !== 'number') {
      throw new Error('图片读取失败');
    }
    if (!appState.cachedImageData || !appState.cachedImageData.data) {
      throw new Error('像素数据读取失败');
    }
    if (img.width < pixN || img.height < pixN) {
      showToast('图片尺寸过小，请选择更小的拼豆尺寸');
      proc.classList.remove('show'); return;
    }
    await sleep(0);
    if (jobId !== appState.liveJobId) return;
    const targetGrid = resolveTargetGridByAspect(appState.cachedImageData.width, appState.cachedImageData.height, appState.targetShortSide, appState.targetGridRows, appState.targetGridCols);
    const { rawGrid, gridData: finalGridData, rows, cols, featureMask } = buildBeadDesign(appState.cachedImageData, pixN, targetGrid.rows, targetGrid.cols);
    let gridData = finalGridData;
    const protectedSourceGrid = finalGridData.map(row => [...row]);
    appState.rawGrid = rawGrid;
    appState.gridRows = rows;
    appState.gridCols = cols;
    appState.fullGridData = gridData.map(row => [...row]);
    appState.bgMask = detectGridBackground(gridData, rawGrid, rows, cols);
    if (pixN >= 120) {
      gridData = cleanupBackgroundRegionNoise(gridData, rawGrid, appState.bgMask, rows, cols, 0.9);
      appState.bgMask = detectGridBackground(gridData, rawGrid, rows, cols);
    }
    const removeBg = document.getElementById('removeBgToggle') ? document.getElementById('removeBgToggle').classList.contains('on') : false;
    if (removeBg) {
      applyBgMaskToGrid(gridData, appState.bgMask, rows, cols);
      cleanupIslands(gridData, rows, cols, 2);
      gridData = cleanupForegroundSpeckles(gridData, rawGrid, rows, cols, featureMask, 0.86);
      gridData = restoreProtectedFeatureCells(gridData, protectedSourceGrid, featureMask);
    }
    appState.gridData = gridData;
    invalidateEditState();
    appState.colorStats = buildColorStats(gridData, rows, cols);
    appState.materials = buildMaterialItems();
    appState.metadata = { pixN, rows, cols, totalBeads: countForegroundBeads(gridData, rows, cols), colorCount: appState.colorStats.length };
    refreshColorSimplifyIndicator();
    initPaletteInteractionForCurrent();
    document.getElementById('previewSection').classList.add('show');
    renderLivePreview();
    hideUploadPreview();
    syncConvertBottomBar(true);
    if (appState.pendingAutoPage) {
      const targetPage = appState.pendingAutoPage;
      appState.pendingAutoPage = '';
      navigateTo(targetPage);
    }
  } catch (err) {
    console.error('Live convert error:', err);
    showToast('转换出错：' + err.message);
  } finally {
    if (proc && jobId === appState.liveJobId) proc.classList.remove('show');
  }
}
function detectGridBackground(gridData, rawGrid, rows, cols) {
  const bgMask = Array.from({ length: rows }, () => new Uint8Array(cols)); // 0=foreground, 1=background
  const edgeSamples = [];
  for (let c = 0; c < cols; c++) {
    if (rawGrid[0][c]) edgeSamples.push({ r: 0, c, rgb: rawGrid[0][c] });
    if (rawGrid[rows-1][c]) edgeSamples.push({ r: rows-1, c, rgb: rawGrid[rows-1][c] });
  }
  for (let r = 1; r < rows-1; r++) {
    if (rawGrid[r][0]) edgeSamples.push({ r, c: 0, rgb: rawGrid[r][0] });
    if (rawGrid[r][cols-1]) edgeSamples.push({ r, c: cols-1, rgb: rawGrid[r][cols-1] });
  }
  if (edgeSamples.length === 0) return bgMask;
  const edgeLabs = edgeSamples.map(s => rgbToLab(s.rgb[0], s.rgb[1], s.rgb[2]));
  let bestIdx = 0, bestScore = Infinity;
  for (let i = 0; i < edgeLabs.length; i++) {
    let totalDist = 0;
    for (let j = 0; j < edgeLabs.length; j++) {
      totalDist += (edgeLabs[i][0]-edgeLabs[j][0])**2 + (edgeLabs[i][1]-edgeLabs[j][1])**2 + (edgeLabs[i][2]-edgeLabs[j][2])**2;
    }
    if (totalDist < bestScore) { bestScore = totalDist; bestIdx = i; }
  }
  const bgLab = edgeLabs[bestIdx];
  const cellLabs = Array.from({ length: rows }, () => []);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rawGrid[r][c]) {
        cellLabs[r][c] = rgbToLab(rawGrid[r][c][0], rawGrid[r][c][1], rawGrid[r][c][2]);
      } else {
        cellLabs[r][c] = [0, 0, 0];
      }
    }
  }
  const BG_THRESHOLD = 800;       // 螖E虏 threshold for seed (edge cells)
  const BG_EXPAND_THRESHOLD = 600; // 螖E虏 threshold for BFS expansion
  const GRADIENT_THRESHOLD = 500;  // Local gradient threshold to prevent crossing edges
  const queue = [];
  function tryEnqueue(r, c) {
    if (bgMask[r][c] === 1) return;
    const lab = cellLabs[r][c];
    const dist = (lab[0]-bgLab[0])**2 + (lab[1]-bgLab[1])**2 + (lab[2]-bgLab[2])**2;
    if (dist < BG_THRESHOLD) {
      bgMask[r][c] = 1;
      queue.push([r, c]);
    }
  }
  for (let c = 0; c < cols; c++) { tryEnqueue(0, c); tryEnqueue(rows-1, c); }
  for (let r = 1; r < rows-1; r++) { tryEnqueue(r, 0); tryEnqueue(r, cols-1); }
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let head = 0;
  while (head < queue.length) {
    const [cr, cc] = queue[head++];
    const curLab = cellLabs[cr][cc];
    for (const [dr, dc] of dirs) {
      const nr = cr + dr, nc = cc + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (bgMask[nr][nc] === 1) continue;
      const nLab = cellLabs[nr][nc];
      const distToBg = (nLab[0]-bgLab[0])**2 + (nLab[1]-bgLab[1])**2 + (nLab[2]-bgLab[2])**2;
      if (distToBg >= BG_EXPAND_THRESHOLD) continue;
      const localGrad = (curLab[0]-nLab[0])**2 + (curLab[1]-nLab[1])**2 + (curLab[2]-nLab[2])**2;
      if (localGrad > GRADIENT_THRESHOLD) continue;
      bgMask[nr][nc] = 1;
      queue.push([nr, nc]);
    }
  }
  const STRICT_BG_THRESHOLD = 250; // 螖E虏 鈮?15.8
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (bgMask[r][c] === 1) continue; // Already marked
      const lab = cellLabs[r][c];
      const dist = (lab[0]-bgLab[0])**2 + (lab[1]-bgLab[1])**2 + (lab[2]-bgLab[2])**2;
      if (dist < STRICT_BG_THRESHOLD) {
        bgMask[r][c] = 1;
      }
    }
  }
  return bgMask;
}
function applyBgMaskToGrid(gridData, bgMask, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (bgMask[r][c] === 1) gridData[r][c] = -1;
    }
  }
}
function onRemoveBgToggle() {
  if (!appState.fullGridData || !appState.bgMask) {
    triggerLiveConvert(false);
    return;
  }
  const removeBg = document.getElementById('removeBgToggle').classList.contains('on');
  const { rows, cols } = appState.metadata || { rows: appState.gridRows, cols: appState.gridCols };
  const gridData = appState.fullGridData.map(row => [...row]);
  if (removeBg) {
    applyBgMaskToGrid(gridData, appState.bgMask, rows, cols);
    cleanupIslands(gridData, rows, cols, 2);
  }
  appState.gridData = gridData;
  invalidateEditState();
  appState.colorStats = buildColorStats(gridData, rows, cols);
  appState.materials = buildMaterialItems();
  if (appState.metadata) {
    appState.metadata.totalBeads = countForegroundBeads(gridData, rows, cols);
    appState.metadata.colorCount = appState.colorStats.length;
  }
  refreshColorSimplifyIndicator();
  initPaletteInteractionForCurrent();
  renderLivePreview();
}
function renderLivePreview() {
  if (!appState.gridData || !appState.cachedImg) return;
  const { rows, cols } = appState.metadata;
  const img = appState.cachedImg;
  const viewport = document.getElementById('previewViewport');
  const stage = document.getElementById('previewStage');
  const origCanvas = document.getElementById('previewOrigCanvas');
  const beadsCanvas = document.getElementById('previewBeadsCanvas');
  const origCtx = origCanvas.getContext('2d');
  const beadsCtx = beadsCanvas.getContext('2d');
  if (!viewport || !stage) return;
  const viewportW = viewport.clientWidth || 343;
  const viewportH = viewport.clientHeight || 260;
  const fitScale = Math.min(viewportW / img.width, viewportH / img.height);
  const displayW = Math.max(1, Math.round(img.width * fitScale));
  const displayH = Math.max(1, Math.round(img.height * fitScale));
  origCanvas.width = displayW; origCanvas.height = displayH;
  beadsCanvas.width = displayW; beadsCanvas.height = displayH;
  stage.style.width = displayW + 'px';
  stage.style.height = displayH + 'px';
  const stageResized = stage.dataset.renderW != String(displayW) || stage.dataset.renderH != String(displayH);
  stage.dataset.renderW = String(displayW);
  stage.dataset.renderH = String(displayH);
  if (appState.previewNeedsReset || stageResized || !appState.previewScale || appState.previewScale < 1) {
    appState.previewScale = 1;
    appState.previewOffsetX = Math.round((viewportW - displayW) / 2);
    appState.previewOffsetY = Math.round((viewportH - displayH) / 2);
    appState.previewNeedsReset = false;
  }
  origCtx.clearRect(0, 0, displayW, displayH);
  beadsCtx.clearRect(0, 0, displayW, displayH);
  origCtx.drawImage(img, 0, 0, displayW, displayH);
  const cellW = displayW / cols;
  const cellH = displayH / rows;
  const _liveGrid = _pickGridDataForRender();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW, y = r * cellH;
      if (_liveGrid[r][c] === -1) {
        const cs = Math.max(2, Math.floor(Math.min(cellW, cellH) / 2));
        for (let cy = 0; cy < cellH; cy += cs) {
          for (let cx = 0; cx < cellW; cx += cs) {
            const isLight = ((Math.floor(cx/cs) + Math.floor(cy/cs)) % 2 === 0);
            beadsCtx.fillStyle = isLight ? '#f0f0f0' : '#dcdcdc';
            beadsCtx.fillRect(x + cx, y + cy, cs, cs);
          }
        }
      } else {
        const mc = MARD_PALETTE[_liveGrid[r][c]];
        beadsCtx.fillStyle = `rgb(${mc.r},${mc.g},${mc.b})`;
        beadsCtx.fillRect(x, y, cellW + 0.5, cellH + 0.5); // +0.5 to avoid gaps
      }
    }
  }
  beadsCtx.strokeStyle = 'rgba(0,0,0,0.08)';
  beadsCtx.lineWidth = 0.5;
  for (let i = 0; i <= cols; i++) {
    beadsCtx.beginPath(); beadsCtx.moveTo(i * cellW, 0); beadsCtx.lineTo(i * cellW, displayH); beadsCtx.stroke();
  }
  for (let i = 0; i <= rows; i++) {
    beadsCtx.beginPath(); beadsCtx.moveTo(0, i * cellH); beadsCtx.lineTo(displayW, i * cellH); beadsCtx.stroke();
  }
  setPreviewMode(appState.previewMode || 'beads');
  applyPreviewTransform();
  const m = appState.metadata;
  let statsHtml = `<span class="preview-summary">${m.totalBeads.toLocaleString()}颗 · ${m.colorCount}种颜色</span>`;
  // ★ 手绘风格相似度分数
  if (appState.useHandcraftStyle && appState.handcraftScore) {
    const score = appState.handcraftScore.total;
    const color = score >= 70 ? '#98D8C8' : score >= 50 ? '#FFB7C5' : '#FF6B35';
    statsHtml += `<span class="preview-summary" style="background:${color}22;color:${color};margin-left:4px">手绘 ${score}</span>`;
  }
  document.getElementById('previewStats').innerHTML = statsHtml;
}
function setPreviewMode(mode) {
  if (appState.hideOriginalPreview && mode === 'original') {
    mode = 'beads';
  }
  appState.previewMode = mode;
  const origCanvas = document.getElementById('previewOrigCanvas');
  const beadsCanvas = document.getElementById('previewBeadsCanvas');
  const tabOrig = document.getElementById('previewTabOrig');
  const tabBeads = document.getElementById('previewTabBeads');
  if (tabOrig) {
    tabOrig.classList.toggle('active', mode === 'original');
    tabOrig.style.display = appState.hideOriginalPreview ? 'none' : '';
  }
  if (tabBeads) tabBeads.classList.toggle('active', mode === 'beads');
  if (origCanvas) origCanvas.classList.toggle('hidden', mode !== 'original');
  if (beadsCanvas) beadsCanvas.classList.toggle('hidden', mode !== 'beads');
}
function applyPreviewTransform() {
  const stage = document.getElementById('previewStage');
  if (!stage) return;
  stage.style.transform = `translate(${appState.previewOffsetX}px, ${appState.previewOffsetY}px) scale(${appState.previewScale})`;
}
(function initPreviewViewport() {
  document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('previewViewport');
    if (!viewport) return;
    let dragging = false;
    let lastX = 0, lastY = 0;
    let isPinch = false, pinchDist = 0, pinchScale = 1;
    let pinchStartOffsetX = 0, pinchStartOffsetY = 0, pinchCenterX = 0, pinchCenterY = 0;
    function getDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    viewport.addEventListener('mousedown', e => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      appState.previewOffsetX += e.clientX - lastX;
      appState.previewOffsetY += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      applyPreviewTransform();
    });
    window.addEventListener('mouseup', () => dragging = false);
    viewport.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      const oldScale = appState.previewScale;
      const newScale = Math.max(0.75, Math.min(6, oldScale * delta));
      if (newScale !== oldScale) {
        const rect = viewport.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const ratio = newScale / oldScale;
        appState.previewOffsetX = mx - (mx - appState.previewOffsetX) * ratio;
        appState.previewOffsetY = my - (my - appState.previewOffsetY) * ratio;
        appState.previewScale = newScale;
      }
      applyPreviewTransform();
    }, { passive: false });
    viewport.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        dragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        isPinch = true;
        const rect = viewport.getBoundingClientRect();
        pinchDist = getDistance(e.touches);
        pinchScale = appState.previewScale;
        pinchStartOffsetX = appState.previewOffsetX;
        pinchStartOffsetY = appState.previewOffsetY;
        pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
        pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
      }
    }, { passive: true });
    viewport.addEventListener('touchmove', e => {
      if (isPinch && e.touches.length === 2) {
        const rect = viewport.getBoundingClientRect();
        const dist = getDistance(e.touches);
        const newScale = Math.max(0.75, Math.min(6, pinchScale * dist / Math.max(1, pinchDist)));
        const newCenterX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
        const newCenterY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
        const ratio = newScale / pinchScale;
        appState.previewOffsetX = newCenterX - (pinchCenterX - pinchStartOffsetX) * ratio;
        appState.previewOffsetY = newCenterY - (pinchCenterY - pinchStartOffsetY) * ratio;
        appState.previewScale = newScale;
        applyPreviewTransform();
      } else if (dragging && e.touches.length === 1) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        appState.previewOffsetX += x - lastX;
        appState.previewOffsetY += y - lastY;
        lastX = x;
        lastY = y;
        applyPreviewTransform();
      }
    }, { passive: true });
    viewport.addEventListener('touchend', () => { dragging = false; isPinch = false; });
  });
})();
function navigateToResult() {
  if (!appState.gridData) { showToast('请先上传图片'); return; }
  ensureSolutionKey();
  navigateTo('page-result');
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function cleanupIslands(gridData, rows, cols, minNeighbors) {
  const toRemove = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (gridData[r][c] === -1) continue; // already background
      let fgCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gridData[nr][nc] !== -1) fgCount++;
        }
      }
      if (fgCount < minNeighbors) toRemove.push([r, c]);
    }
  }
  for (const [r, c] of toRemove) gridData[r][c] = -1;
}
function countForegroundBeads(gridData, rows, cols) {
  let count = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (gridData[r][c] !== -1) count++;
  }
  return count;
}
function buildColorStats(gridData, rows, cols) {
  const freq = new Map();
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    const idx = gridData[r][c];
    if (idx === -1) continue; // skip background cells
    freq.set(idx, (freq.get(idx)||0)+1);
  }
  const stats = [];
  for (const [idx, count] of freq) {
    const c = MARD_PALETTE[idx];
    stats.push({ idx, id: c.id, r: c.r, g: c.g, b: c.b, count, family: c.family });
  }
  stats.sort((a,b) => b.count - a.count);
  return stats;
}
function renderResult(preserveView) {
  if (!appState.gridData) return;
  const { rows, cols } = appState.metadata;
  const container = document.getElementById('resultCanvasContainer');
  const canvas = document.getElementById('resultCanvas');
  const ctx = canvas.getContext('2d');
  const cellSize = 12;
  const totalW = cols * cellSize, totalH = rows * cellSize;
  const dpr = window.devicePixelRatio || 1;
  const backingScale = Math.max(1, Math.min(4, dpr * Math.max(1, preserveView ? appState.scale : 1)));
  canvas.width = Math.round(totalW * backingScale);
  canvas.height = Math.round(totalH * backingScale);
  canvas.style.width = totalW + 'px'; canvas.style.height = totalH + 'px';
  ctx.setTransform(backingScale, 0, 0, backingScale, 0, 0);
  ctx.imageSmoothingEnabled = false;
  if (!preserveView) {
    appState.scale = Math.min(container.clientWidth / totalW, container.clientHeight / totalH, 1);
    appState.offsetX = (container.clientWidth - totalW * appState.scale) / 2;
    appState.offsetY = (container.clientHeight - totalH * appState.scale) / 2;
  }
  applyTransform(canvas);
  drawGrid(ctx, _pickGridDataForRender(), rows, cols, cellSize, appState.showGrid, appState.showLabels, appState.showMirror);
  refreshColorSimplifyIndicator();
  renderStats();
  renderColorList();
  setWorkspaceMode(appState.workspaceMode || 'preview', true);
}
function drawGrid(ctx, gridData, rows, cols, cellSize, showGrid, showLabels, mirror, labelOptions) {
  ctx.save();
  if (mirror) { ctx.translate(cols * cellSize, 0); ctx.scale(-1, 1); }
  const checkSize = Math.max(2, Math.floor(cellSize / 3));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize, y = r * cellSize;
      if (gridData[r][c] === -1) {
        for (let cy = 0; cy < cellSize; cy += checkSize) {
          for (let cx = 0; cx < cellSize; cx += checkSize) {
            const isLight = ((Math.floor(cx/checkSize) + Math.floor(cy/checkSize)) % 2 === 0);
            ctx.fillStyle = isLight ? '#f0f0f0' : '#dcdcdc';
            ctx.fillRect(x + cx, y + cy, checkSize, checkSize);
          }
        }
      } else {
        const mc = MARD_PALETTE[gridData[r][c]];
        ctx.fillStyle = `rgb(${mc.r},${mc.g},${mc.b})`;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
  if (mirror) ctx.restore();
  if (showGrid) {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath(); ctx.moveTo(i*cellSize, 0); ctx.lineTo(i*cellSize, rows*cellSize); ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath(); ctx.moveTo(0, i*cellSize); ctx.lineTo(cols*cellSize, i*cellSize); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i += 5) {
      ctx.beginPath(); ctx.moveTo(i*cellSize, 0); ctx.lineTo(i*cellSize, rows*cellSize); ctx.stroke();
    }
    for (let i = 0; i <= rows; i += 5) {
      ctx.beginPath(); ctx.moveTo(0, i*cellSize); ctx.lineTo(cols*cellSize, i*cellSize); ctx.stroke();
    }
  }
  if (showLabels && cellSize >= 4) {
    ctx.save();
    const finalLabelMode = labelOptions?.variant === 'final';
    if (finalLabelMode && cellSize < 5.2) {
      ctx.restore();
    } else {
      const fontSize = finalLabelMode
        ? Math.max(3.2, cellSize * (cellSize >= 8 ? 0.38 : cellSize >= 6.4 ? 0.32 : 0.28))
        : Math.max(5, cellSize * 0.58);
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (gridData[r][c] === -1) continue; // skip background cells
          const mc = MARD_PALETTE[gridData[r][c]];
          const lum = (mc.r * 0.299 + mc.g * 0.587 + mc.b * 0.114) / 255;
          const fill = finalLabelMode
            ? (lum < 0.5 ? 'rgba(255,255,255,0.56)' : 'rgba(0,0,0,0.42)')
            : (lum < 0.5 ? '#fff' : '#000');
          const stroke = finalLabelMode
            ? (lum < 0.5 ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.12)')
            : (lum < 0.5 ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.5)');
          ctx.fillStyle = fill;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = finalLabelMode ? Math.max(0.35, fontSize * 0.08) : Math.max(1, fontSize * 0.18);
          const textX = mirror ? ((cols - c - 0.5) * cellSize) : (c * cellSize + cellSize / 2);
          const labelText = finalLabelMode && cellSize < 6.4 ? String(mc.id).slice(0, 2) : mc.id;
          if (!finalLabelMode || cellSize >= 6) {
            ctx.strokeText(labelText, textX, r*cellSize+cellSize/2);
          }
          ctx.fillText(labelText, textX, r*cellSize+cellSize/2);
        }
      }
      ctx.restore();
    }
  }
  if (appState.highlightedResultColor != null) {
    ctx.save();
    if (mirror) { ctx.translate(cols * cellSize, 0); ctx.scale(-1, 1); }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (gridData[r][c] !== appState.highlightedResultColor) continue;
        const x = c * cellSize, y = r * cellSize;
        ctx.save();
        ctx.shadowColor = 'rgba(255,107,53,0.28)';
        ctx.shadowBlur = Math.max(2, cellSize * 0.45);
        ctx.lineWidth = Math.max(2, cellSize * 0.2);
        ctx.strokeStyle = 'rgba(255,255,255,0.98)';
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(1, cellSize * 0.1);
        ctx.strokeStyle = 'rgba(0,0,0,0.95)';
        ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        ctx.restore();
      }
    }
    ctx.restore();
  }
}

function renderGridPreviewDataUrl(gridData, rows, cols) {
  const cellSize = Math.max(6, Math.min(12, Math.floor(300 / Math.max(rows, cols))));
  const canvas = document.createElement('canvas');
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  drawGrid(ctx, gridData, rows, cols, cellSize, true, false, false);
  return canvas.toDataURL('image/png');
}
function applyTransform(canvas) {
  canvas.style.transform = `translate(${appState.offsetX}px, ${appState.offsetY}px) scale(${appState.scale})`;
  canvas.style.transformOrigin = '0 0';
}
function renderStats() {
  const m = appState.metadata;
  const totalCells = m.rows * m.cols;
  const bgCells = totalCells - m.totalBeads;
  document.getElementById('resultStats').innerHTML =
    `<span class="info-badge purple"> ${m.cols}×${m.rows}拼豆</span>` +
    `<span class="info-badge pink"> ${m.colorCount} 种颜色</span>` +
    `<span class="info-badge green"> ${m.totalBeads.toLocaleString()} 颗</span>` +
    (bgCells > 0 ? `<span class="info-badge" style="background:rgba(0,0,0,.06);color:#888">已去除 ${bgCells.toLocaleString()} 格背景</span>` : '');
}
function renderColorList() {
  const list = document.getElementById('colorList');
  if (!list) return;
  list.innerHTML = appState.colorStats.map(s =>
    `<div class="color-item${appState.highlightedResultColor === s.idx ? ' active' : ''}" onclick="toggleResultColorHighlight(${s.idx})">` +
    `<div class="color-dot" style="background:rgb(${s.r},${s.g},${s.b})"></div>` +
    `<div class="color-meta"><span class="color-id">${s.id}</span><span class="color-count">${s.count}颗</span></div></div>`
  ).join('');
}
// 拼豆色板 V2：拉杆 + 删除/恢复 + 点击高亮定位
function initPaletteInteractionForCurrent() {
  if (!window.PaletteInteraction || !appState.gridData || !appState.colorStats) {
    appState.displayGridData = appState.gridData;
    return;
  }
  const { rows, cols } = appState.metadata || { rows: appState.gridRows, cols: appState.gridCols };
  try {
    window.PaletteInteraction.destroy();
    window.PaletteInteraction.init(
      { gridData: appState.gridData, colorStats: appState.colorStats, rows, cols, hooks: window.PerfectPixelHooks },
      // onDisplayChange: 拉杆/删/恢复 → 重画布
      function(displayGridData) {
        appState.displayGridData = displayGridData;
        if (typeof renderLivePreview === 'function') renderLivePreview();
        if (document.getElementById('page-result')?.classList.contains('active')) renderResult(true);
      },
      // onHighlightChange: 点 tile 本体 → 切换高亮，重画布
      // 注意：高亮时 _pickGridDataForRender() 会切回原始 gridData
      // 已删除色块也能高亮（其原始位置在 gridData 里仍然存在），不会真的恢复 removed
      function(idx) {
        appState.highlightedResultColor = idx;
        if (typeof renderLivePreview === 'function') renderLivePreview();
        if (document.getElementById('page-result')?.classList.contains('active')) renderResult(true);
      }
    );
    appState.displayGridData = window.PaletteInteraction.getDisplayGridData() || appState.gridData;
  } catch (err) {
    console.warn('[PaletteInteraction] init failed:', err);
    appState.displayGridData = appState.gridData;
  }
}
// 渲染数据源选择器：
//   - 有高亮 → 用原始 gridData（包含被删除的色，让删除色也能被高亮定位）
//   - 无高亮 → 用 displayGridData（remap 后，反映色板删除/合并的当前状态）
// 这是"删除色被高亮时不真的恢复，仅显示"的核心机制
function _pickGridDataForRender() {
  if (appState.highlightedResultColor != null) return appState.gridData;
  return appState.displayGridData || appState.gridData;
}
function toggleResultColorHighlight(idx) {
  appState.highlightedResultColor = appState.highlightedResultColor === idx ? null : idx;
  renderResult();
}
function toggleChip(el, key) {
  el.classList.toggle('on');
  if (key === 'grid') appState.showGrid = el.classList.contains('on');
  if (key === 'label') appState.showLabels = el.classList.contains('on');
  if (key === 'mirror') appState.showMirror = el.classList.contains('on');
  renderResult();
}
function downloadCanvasPng(canvas, filename) {
  return new Promise((resolve, reject) => {
    if (!canvas || !canvas.width || !canvas.height) {
      reject(new Error('当前没有可保存的图片'));
      return;
    }
    function triggerDownload(url, meta) {
      let ownerDocument = document;
      try {
        if (window.top && window.top.document) {
          ownerDocument = window.top.document;
        }
      } catch (error) {
        ownerDocument = document;
      }
      const link = ownerDocument.createElement('a');
      link.download = filename;
      link.href = url;
      link.style.display = 'none';
      (ownerDocument.body || ownerDocument.documentElement).appendChild(link);
      setTimeout(() => link.click(), 0);
      setTimeout(() => {
        link.remove();
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      }, 60000);
      resolve(meta || null);
    }
    if (canvas.toBlob) {
      console.info('[douleme-export] start', {
        version: '20260426-0434',
        filename,
        width: canvas.width,
        height: canvas.height
      });
      canvas.toBlob(blob => {
        console.info('[douleme-export] blob', {
          version: '20260426-0434',
          filename,
          size: blob ? blob.size : 0,
          type: blob ? blob.type : ''
        });
        if (!blob || blob.size <= 0) {
          reject(new Error('图片导出失败，可能超过浏览器画布限制'));
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownload(url, {
          size: blob.size,
          width: canvas.width,
          height: canvas.height
        });
      }, 'image/png');
      return;
    }
    try {
      const url = canvas.toDataURL('image/png');
      if (!url || url === 'data:,') throw new Error('图片导出失败，可能超过浏览器画布限制');
      triggerDownload(url, {
        size: Math.max(0, Math.round((url.length - 'data:image/png;base64,'.length) * 0.75)),
        width: canvas.width,
        height: canvas.height
      });
    } catch (error) {
      reject(error);
    }
  });
}
async function saveImage(target) {
  const activeTarget = target || (document.getElementById('page-final-art')?.classList.contains('active') ? 'final' : 'result');
  let canvas = activeTarget === 'final' ? document.getElementById('finalCanvas') : document.getElementById('resultCanvas');
  if (!canvas) {
    showToast('当前没有可保存的图片');
    return;
  }
  if (activeTarget === 'final') {
    const requestedQuality = appState.finalQuality || 'hd';
    const plan = resolveSafeFinalExportPlan(requestedQuality);
    if (!plan.selected) {
      showToast('最终图尺寸过大，请减少颜色或降低清晰度后重试');
      return;
    }
    if (plan.downgraded) {
      appState.finalQuality = plan.selected.level;
      syncFinalQualityChip();
      renderFinalArtwork();
      showToast(`${plan.requested.label} 超出浏览器限制，已自动降级为 ${plan.selected.label}`);
    }
    const scale = Math.max(1, Number(plan.selected.exportMultiplier || 1));
    const exportCanvas = document.createElement('canvas');
    renderFinalArtwork(exportCanvas, { includeLegend: true, exportMultiplier: scale });
    canvas = exportCanvas;
    console.info('[douleme-export] final canvas ready', {
      version: '20260426-0434',
      quality: appState.finalQuality || 'hd',
      scale,
      width: canvas.width,
      height: canvas.height,
      pixelCount: plan.selected.pixelCount,
      estimatedBytes: plan.selected.estimatedBytes
    });
  }
  const suffix = activeTarget === 'final' ? 'final' : 'preview';
  const filename = `pindou_${appState.metadata.cols}x${appState.metadata.rows}_${suffix}.png`;
  try {
    const exportInfo = await downloadCanvasPng(canvas, filename);
    const sizeText = exportInfo && exportInfo.size ? `，约 ${(exportInfo.size / 1024 / 1024).toFixed(2)}MB` : '';
    showToast(`图片已保存${sizeText}`);
  } catch (error) {
    console.error(error);
    showToast(error?.message || '图片保存失败，请降低清晰度后重试');
  }
}
(function() {
  const container = document.getElementById('resultCanvasContainer');
  const canvas = document.getElementById('resultCanvas');
  let isPinching = false, startDist = 0, startScale = 1;
  let startOffsetX = 0, startOffsetY = 0, startCenterX = 0, startCenterY = 0;
  container.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const oldScale = appState.scale;
    const newScale = Math.max(0.2, Math.min(10, oldScale * delta));
    if (newScale !== oldScale) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const ratio = newScale / oldScale;
      appState.offsetX = mx - (mx - appState.offsetX) * ratio;
      appState.offsetY = my - (my - appState.offsetY) * ratio;
      appState.scale = newScale;
    }
    renderResult(true);
  }, {passive: false});
  container.addEventListener('mousedown', e => {
    appState.dragging = true; appState.lastX = e.clientX; appState.lastY = e.clientY;
  });
  window.addEventListener('mousemove', e => {
    if (!appState.dragging) return;
    appState.offsetX += e.clientX - appState.lastX;
    appState.offsetY += e.clientY - appState.lastY;
    appState.lastX = e.clientX; appState.lastY = e.clientY;
    applyTransform(canvas);
  });
  window.addEventListener('mouseup', () => appState.dragging = false);
  container.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      isPinching = true;
      const rect = container.getBoundingClientRect();
      startDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      startScale = appState.scale;
      startOffsetX = appState.offsetX;
      startOffsetY = appState.offsetY;
      startCenterX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
      startCenterY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
    } else if (e.touches.length === 1) {
      appState.dragging = true;
      appState.lastX = e.touches[0].clientX; appState.lastY = e.touches[0].clientY;
    }
  }, {passive:true});
  container.addEventListener('touchmove', e => {
    if (isPinching && e.touches.length === 2) {
      const rect = container.getBoundingClientRect();
      const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      const newScale = Math.max(0.2, Math.min(10, startScale * dist / Math.max(1, startDist)));
      const newCenterX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
      const newCenterY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
      const ratio = newScale / startScale;
      appState.offsetX = newCenterX - (startCenterX - startOffsetX) * ratio;
      appState.offsetY = newCenterY - (startCenterY - startOffsetY) * ratio;
      appState.scale = newScale;
      renderResult(true);
    } else if (appState.dragging && e.touches.length === 1) {
      appState.offsetX += e.touches[0].clientX - appState.lastX;
      appState.offsetY += e.touches[0].clientY - appState.lastY;
      appState.lastX = e.touches[0].clientX; appState.lastY = e.touches[0].clientY;
      applyTransform(canvas);
    }
  }, {passive:true});
  container.addEventListener('touchend', () => { isPinching = false; appState.dragging = false; });
})();
function initEditPage() {
  if (!appState.gridData) return;
  if (!appState.editGridData || appState.editSourceVersion !== appState.gridVersion) {
    appState.editGridData = appState.gridData.map(row => [...row]);
    appState.editBaseGridData = appState.gridData.map(row => [...row]);
    appState.editSourceVersion = appState.gridVersion;
    appState.undoStack = [];
    appState.currentColorIdx = 0;
    appState.currentTool = 'brush';
    appState.brushSize = 1;
    buildPalettePanel();
    updateCurrentColor();
    if (!appState.editEventsBound) {
      setupEditCanvasEvents();
      appState.editEventsBound = true;
    }
  }
  appState.editViewportDirty = true;
  updateEditStats();
  renderEditCanvas();
}
function buildPalettePanel() {
  const panel = document.getElementById('palettePanel');
  const familyNames = {
    A: '黄橙',
    B: '绿',
    C: '蓝青',
    D: '紫',
    E: '粉',
    F: '红',
    G: '棕肤',
    H: '黑白灰',
    M: '莫兰迪'
  };
  let html = '';
  for (const f of FAMILIES) {
    const colors = MARD_PALETTE.filter(c => c.family === f);
    html += `<div class="palette-family"><div class="palette-family-title">${f} ${familyNames[f]}（${colors.length}）</div><div class="palette-colors">`;
    for (const c of colors) {
      const sel = c.index === appState.currentColorIdx ? ' selected' : '';
      html += `<div class="palette-color${sel}" style="background:rgb(${c.r},${c.g},${c.b})" data-idx="${c.index}" title="${c.id}" onclick="pickPaletteColor(${c.index})"></div>`;
    }
    html += '</div></div>';
  }
  panel.innerHTML = html;
}
function pickPaletteColor(idx) {
  appState.currentColorIdx = idx;
  updateCurrentColor();
  document.querySelectorAll('.palette-color').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.idx) === idx);
  });
}
function updateCurrentColor() {
  const c = MARD_PALETTE[appState.currentColorIdx];
  document.getElementById('currentColorPreview').style.background = `rgb(${c.r},${c.g},${c.b})`;
  document.getElementById('currentColorName').textContent = c.id;
}
function selectTool(tool, el) {
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  appState.currentTool = tool;
  document.getElementById('brushSizes').style.display = (tool === 'brush' || tool === 'eraser') ? 'flex' : 'none';
  if (tool === 'replace') openReplaceModal();
}
function selectBrushSize(size, el) {
  document.querySelectorAll('.brush-size').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  appState.brushSize = size;
}

function fitEditViewport(force) {
  if (!appState.editGridData || !appState.metadata) return;
  const container = document.getElementById('editCanvasContainer');
  if (!container) return;
  const { rows, cols } = appState.metadata;
  const cellSize = 12;
  const totalW = cols * cellSize;
  const totalH = rows * cellSize;
  const width = Math.max(1, container.clientWidth || 0);
  const height = Math.max(1, container.clientHeight || 0);
  const viewportKey = `${width}x${height}:${rows}x${cols}`;
  if (!force && !appState.editViewportDirty && appState.lastEditViewportKey === viewportKey) return;
  const fitScale = Math.min(width / totalW, height / totalH, 1);
  appState.editScale = fitScale;
  appState.editOffsetX = (width - totalW * fitScale) / 2;
  appState.editOffsetY = (height - totalH * fitScale) / 2;
  appState.editViewportDirty = false;
  appState.lastEditViewportKey = viewportKey;
}

function resetEditViewport() {
  appState.editViewportDirty = true;
  appState.lastEditViewportKey = '';
  appState.editScale = 1;
  appState.editOffsetX = 0;
  appState.editOffsetY = 0;
}

function renderEditCanvas() {
  if (!appState.editGridData) return;
  const { rows, cols } = appState.metadata;
  const container = document.getElementById('editCanvasContainer');
  const canvas = document.getElementById('editCanvas');
  const ctx = canvas.getContext('2d');
  const cellSize = 12;
  const totalW = cols * cellSize, totalH = rows * cellSize;
  canvas.width = totalW; canvas.height = totalH;
  canvas.style.width = totalW + 'px'; canvas.style.height = totalH + 'px';
  fitEditViewport(false);
  canvas.style.transform = `translate(${appState.editOffsetX}px, ${appState.editOffsetY}px) scale(${appState.editScale})`;
  canvas.style.transformOrigin = '0 0';
  drawGrid(ctx, appState.editGridData, rows, cols, cellSize, true, false, appState.showMirror);
}
function setupEditCanvasEvents() {
  const container = document.getElementById('editCanvasContainer');
  const canvas = document.getElementById('editCanvas');
  let painting = false;
  let isPinch = false, pinchDist = 0, pinchScale = 1;
  let pinchStartOffsetX = 0, pinchStartOffsetY = 0, pinchCenterX = 0, pinchCenterY = 0;
  function getCellFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (rect.width / canvas.width);
    const y = (e.clientY - rect.top) / (rect.height / canvas.height);
    const cellSize = 12;
    let col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (appState.showMirror) {
      col = appState.metadata.cols - 1 - col;
    }
    return [row, col];
  }
  function mergeStrokeAction(baseAction, nextAction) {
    if (!baseAction) return nextAction;
    const seen = new Set(baseAction.positions.map(([r, c]) => `${r},${c}`));
    for (let i = 0; i < nextAction.positions.length; i++) {
      const [r, c] = nextAction.positions[i];
      const key = `${r},${c}`;
      if (seen.has(key)) continue;
      seen.add(key);
      baseAction.positions.push([r, c]);
      baseAction.oldColors.push(nextAction.oldColors[i]);
    }
    return baseAction;
  }
  function commitPendingStroke() {
    if (!appState.pendingStrokeAction || appState.pendingStrokeAction.positions.length === 0) return;
    appState.undoStack.push(appState.pendingStrokeAction);
    if (appState.undoStack.length > 50) appState.undoStack.shift();
    appState.pendingStrokeAction = null;
  }
  function applyBrush(row, col) {
    const { rows, cols } = appState.metadata;
    const half = Math.floor(appState.brushSize / 2);
    const positions = [], oldColors = [];
    for (let dr = -half; dr <= half; dr++) {
      for (let dc = -half; dc <= half; dc++) {
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          if (appState.editGridData[r][c] === -1) continue; // skip background cells
          positions.push([r, c]);
          oldColors.push(appState.editGridData[r][c]);
          if (appState.currentTool === 'eraser') {
            const h1Idx = MARD_PALETTE.findIndex(p => p.id === 'H1');
            appState.editGridData[r][c] = h1Idx >= 0 ? h1Idx : 0;
          } else {
            appState.editGridData[r][c] = appState.currentColorIdx;
          }
        }
      }
    }
    return { positions, oldColors, newColor: appState.currentTool === 'eraser' ? (MARD_PALETTE.findIndex(p=>p.id==='H1')||0) : appState.currentColorIdx };
  }
  function handleEditClick(e) {
    const [row, col] = getCellFromEvent(e);
    const { rows, cols } = appState.metadata;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (appState.currentTool === 'picker') {
      if (appState.editGridData[row][col] === -1) return; // can't pick from background
      appState.currentColorIdx = appState.editGridData[row][col];
      updateCurrentColor();
      buildPalettePanel();
      return;
    }
    if (appState.currentTool === 'brush' || appState.currentTool === 'eraser') {
      const action = applyBrush(row, col);
      appState.pendingStrokeAction = mergeStrokeAction(appState.pendingStrokeAction, action);
      renderEditCanvas();
      updateEditStats();
    }
  }
  canvas.addEventListener('mousedown', e => {
    painting = true;
    appState.pendingStrokeAction = null;
    handleEditClick(e);
  });
  canvas.addEventListener('mousemove', e => {
    if (painting && (appState.currentTool === 'brush' || appState.currentTool === 'eraser')) {
      handleEditClick(e);
    }
  });
  window.addEventListener('mouseup', () => {
    if (painting) commitPendingStroke();
    painting = false;
  });
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      painting = true;
      appState.pendingStrokeAction = null;
      const touch = e.touches[0];
      handleEditClick(touch);
    } else if (e.touches.length === 2) {
      isPinch = true;
      const rect = container.getBoundingClientRect();
      pinchDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      pinchScale = appState.editScale;
      pinchStartOffsetX = appState.editOffsetX;
      pinchStartOffsetY = appState.editOffsetY;
      pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
      pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
    }
  }, {passive:true});
  canvas.addEventListener('touchmove', e => {
    if (isPinch && e.touches.length === 2) {
      const rect = container.getBoundingClientRect();
      const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      const newScale = Math.max(0.2, Math.min(10, pinchScale * dist / Math.max(1, pinchDist)));
      const newCenterX = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
      const newCenterY = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
      const ratio = newScale / pinchScale;
      appState.editOffsetX = newCenterX - (pinchCenterX - pinchStartOffsetX) * ratio;
      appState.editOffsetY = newCenterY - (pinchCenterY - pinchStartOffsetY) * ratio;
      appState.editScale = newScale;
      canvas.style.transform = `translate(${appState.editOffsetX}px, ${appState.editOffsetY}px) scale(${appState.editScale})`;
    } else if (painting && e.touches.length === 1) {
      handleEditClick(e.touches[0]);
    }
  }, {passive:true});
  canvas.addEventListener('touchend', () => {
    if (painting) commitPendingStroke();
    painting = false; isPinch = false;
  });
  container.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const oldScale = appState.editScale;
    const newScale = Math.max(0.2, Math.min(10, oldScale * delta));
    if (newScale !== oldScale) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const ratio = newScale / oldScale;
      appState.editOffsetX = mx - (mx - appState.editOffsetX) * ratio;
      appState.editOffsetY = my - (my - appState.editOffsetY) * ratio;
      appState.editScale = newScale;
    }
    canvas.style.transform = `translate(${appState.editOffsetX}px, ${appState.editOffsetY}px) scale(${appState.editScale})`;
  }, {passive:false});
}
function updateEditStats() {
  if (!appState.editGridData) return;
  const { rows, cols } = appState.metadata;
  const used = new Set();
  let beadCount = 0;
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    if (appState.editGridData[r][c] === -1) continue;
    used.add(appState.editGridData[r][c]);
    beadCount++;
  }
  document.getElementById('editStats').innerHTML =
    `<span> ${used.size} 种颜色</span><span> ${beadCount.toLocaleString()} 颗</span>`;
}
function undo() {
  if (appState.undoStack.length === 0) { showToast('没有可撤销的操作'); return; }
  const action = appState.undoStack.pop();
  for (let i = 0; i < action.positions.length; i++) {
    const [r, c] = action.positions[i];
    appState.editGridData[r][c] = action.oldColors[i];
  }
  renderEditCanvas(); updateEditStats();
}
function resetEditCanvas() {
  if (!appState.editBaseGridData) {
    showToast('当前没有可重置的内容');
    return;
  }
  appState.editGridData = appState.editBaseGridData.map(row => [...row]);
  appState.undoStack = [];
  resetEditViewport();
  renderEditCanvas();
  updateEditStats();
  showToast('已恢复到最开始的转换图并重置视图');
}
function finishEdit() {
  if (appState.editGridData) {
    appState.gridData = appState.editGridData.map(row => [...row]);
    appState.gridVersion += 1;
    appState.editSourceVersion = appState.gridVersion;
    appState.editBaseGridData = appState.gridData.map(row => [...row]);
    appState.editGridData = appState.gridData.map(row => [...row]);
    appState.colorStats = buildColorStats(appState.gridData, appState.metadata.rows, appState.metadata.cols);
    appState.materials = buildMaterialItems();
    appState.metadata.colorCount = appState.colorStats.length;
    appState.metadata.totalBeads = countForegroundBeads(appState.gridData, appState.metadata.rows, appState.metadata.cols);
    refreshColorSimplifyIndicator();
  }
  renderFinalArtwork();
  navigateTo('page-final-art');
}
function openReplaceModal() {
  document.getElementById('replaceModal').classList.add('show');
  appState.replaceFrom = appState.currentColorIdx;
  appState.replaceTo = -1;
  const fc = MARD_PALETTE[appState.replaceFrom];
  document.getElementById('replaceFromColor').style.background = `rgb(${fc.r},${fc.g},${fc.b})`;
  document.getElementById('replaceFromName').textContent = fc.id;
  document.getElementById('replaceToColor').style.background = '#eee';
  document.getElementById('replaceToName').textContent = '点击选择';
}
function closeReplaceModal() {
  document.getElementById('replaceModal').classList.remove('show');
}
function showReplacePalette() {
  const panel = document.getElementById('replacePalettePanel');
  if (!panel) return;
  panel.style.display = 'block';
  const familyNames = {
    A: '黄橙', B: '绿', C: '蓝青', D: '紫', E: '粉', F: '红', G: '棕肤', H: '黑白灰', M: '莫兰迪'
  };
  let html = '';
  for (const f of FAMILIES) {
    const colors = MARD_PALETTE.filter(c => c.family === f);
    html += `<div style="padding:0 4px 8px"><div style="font-size:11px;font-weight:700;color:#888;margin-bottom:6px">${f} ${familyNames[f]}（${colors.length}）</div><div style="display:flex;flex-wrap:wrap;gap:4px">`;
    for (const c of colors) {
      const selected = c.index === appState.replaceTo ? 'border:2px solid #ff6b35;box-shadow:0 0 0 2px rgba(255,107,53,.18);' : 'border:1px solid rgba(0,0,0,.08);';
      html += `<div title="${c.id}" onclick="pickReplaceColor(${c.index})" style="width:24px;height:24px;border-radius:6px;background:rgb(${c.r},${c.g},${c.b});cursor:pointer;${selected}"></div>`;
    }
    html += '</div></div>';
  }
  panel.innerHTML = html;
}
function pickReplaceColor(idx) {
  appState.replaceTo = idx;
  const tc = MARD_PALETTE[idx];
  document.getElementById('replaceToColor').style.background = `rgb(${tc.r},${tc.g},${tc.b})`;
  document.getElementById('replaceToName').textContent = tc.id;
  showReplacePalette();
}
function confirmReplace() {
  if (appState.replaceTo < 0) { showToast('请先选择目标颜色'); return; }
  const { rows, cols } = appState.metadata;
  const positions = [], oldColors = [];
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    if (appState.editGridData[r][c] === -1) continue; // skip background
    if (appState.editGridData[r][c] === appState.replaceFrom) {
      positions.push([r, c]);
      oldColors.push(appState.replaceFrom);
      appState.editGridData[r][c] = appState.replaceTo;
    }
  }
  if (positions.length > 0) {
    appState.undoStack.push({ positions, oldColors, newColor: appState.replaceTo });
    if (appState.undoStack.length > 50) appState.undoStack.shift();
  }
  closeReplaceModal();
  renderEditCanvas();
  updateEditStats();
  showToast(`已替换 ${positions.length} 颗`);
}
window.addEventListener('resize', () => {
  appState.editViewportDirty = true;
  if (document.getElementById('page-result')?.classList.contains('active') && appState.workspaceMode === 'edit') {
    requestAnimationFrame(() => renderEditCanvas());
  }
  if (document.getElementById('page-final-art')?.classList.contains('active')) {
    requestAnimationFrame(() => renderFinalArtwork());
  }
});
updateSizeInfo();
syncPaletteSystemChip();
selectRenderProfile('smart', true);
notifyHostReady();

// === PerfectPixel 集成钩子：仅暴露 bridge.js 需要的纯函数 ===
if (typeof window !== 'undefined') {
  window.PerfectPixelHooks = {
    nearestColorByLabV2: nearestColorByLabV2,
    rgbToLab: rgbToLab,
    MARD_PALETTE: MARD_PALETTE,
    buildColorStats: buildColorStats
  };
}


/* ============================================================================
 * 模块: bridge.js
 * 源路径: src/perfectPixel/js/bridge.js
 * 行数: 455
 * 说明: PP↔MARD 桥接 — runPerfectPixelPipeline()；含 dejitterColors 输入去抖 + spatialClean 双门槛清噪
 * ============================================================================ */
// ============================================================================
// bridge.js — PerfectPixel ↔ douleme 工程链路衔接层
//
// 设计：
//   1. PerfectPixel 负责"像素化 + 去反锯齿"，输出紧凑 pixelMatrix（H*W*3）
//   2. 本 bridge 把 pixelMatrix 转成工程链路的 rawGrid([r][c]=[R,G,B])
//   3. 复用 app.js 的 K-Means 聚类思想简化为：直接对每格调 nearestColorByLabV2
//      做 MARD 221 色映射（或用传入子集 palette）
//
// 与 app.js 的耦合：通过 window.PerfectPixelHooks 暴露的纯函数集合，
// 不依赖 appState / DOM。
// ============================================================================
(function (root) {
  'use strict';

  function getHooks() {
    var h = root.PerfectPixelHooks;
    if (!h || !h.nearestColorByLabV2 || !h.rgbToLab || !h.MARD_PALETTE) {
      throw new Error('PerfectPixelHooks 未就绪，请先加载 app.js 或注入 stub hooks');
    }
    return h;
  }

  /**
   * Uint8Array (H*W*3) → number[rows][cols]=[R,G,B]
   */
  function pixelMatrixToRawGrid(flatMatrix, rows, cols) {
    if (!(flatMatrix && typeof flatMatrix.length === 'number')) {
      throw new Error('pixelMatrixToRawGrid: flatMatrix 无效');
    }
    var expected = rows * cols * 3;
    if (flatMatrix.length !== expected) {
      throw new Error('pixelMatrixToRawGrid: 长度不匹配 expected=' + expected + ' got=' + flatMatrix.length);
    }
    var grid = new Array(rows);
    for (var r = 0; r < rows; r++) {
      var row = new Array(cols);
      var base = r * cols * 3;
      for (var c = 0; c < cols; c++) {
        var p = base + c * 3;
        row[c] = [flatMatrix[p], flatMatrix[p + 1], flatMatrix[p + 2]];
      }
      grid[r] = row;
    }
    return grid;
  }

  /**
   * rawGrid → gridData（MARD 索引矩阵），逐格调用 nearestColorByLabV2
   * @param {number[][][]} rawGrid
   * @param {number[]|null} palette  MARD 子集索引数组；null 用全 221 色
   * @returns {number[][]}
   */
  function mapRawGridToPalette(rawGrid, palette) {
    var hooks = getHooks();
    var rgbToLab = hooks.rgbToLab;
    var nearest = hooks.nearestColorByLabV2;
    var MARD = hooks.MARD_PALETTE;

    var pal = palette;
    if (!pal || !pal.length) {
      pal = new Array(MARD.length);
      for (var i = 0; i < MARD.length; i++) pal[i] = i;
    }

    var rows = rawGrid.length;
    var cols = rows > 0 ? rawGrid[0].length : 0;
    var gridData = new Array(rows);
    for (var r = 0; r < rows; r++) {
      var outRow = new Array(cols);
      var inRow = rawGrid[r];
      for (var c = 0; c < cols; c++) {
        var rgb = inRow[c];
        if (!rgb) { outRow[c] = -1; continue; }
        var lab = rgbToLab(rgb[0], rgb[1], rgb[2]);
        outRow[c] = nearest(lab[0], lab[1], lab[2], pal, rgb);
      }
      gridData[r] = outRow;
    }
    return gridData;
  }

  /**
   * 颜色去抖：合并 LAB ΔE < threshold 的近似 RGB 到同一代表色
   * 解决 PerfectPixel 对同色块输出多个 ±RGB 微差值的问题
   *
   * 算法：贪心聚类
   *   1. 统计 rawGrid 唯一色 + 频次
   *   2. 按频次降序，频次高的优先成为代表色
   *   3. 频次低的色若与已有代表色 ΔE < threshold，并入；否则自立门户
   *   4. 用映射表回写 rawGrid（原地修改）
   *
   * 注意：本函数只动【输入端 RGB】，不碰 MARD 调色板
   *
   * @param {number[][][]} rawGrid
   * @param {number} deltaEThreshold  默认 4（肉眼"几乎一样"）
   * @returns {{rawGrid, stats: {before, after, mergedGroups, threshold}}}
   */
  function dejitterColors(rawGrid, deltaEThreshold) {
    var hooks = getHooks();
    var rgbToLab = hooks.rgbToLab;
    var threshold = (typeof deltaEThreshold === 'number' && deltaEThreshold > 0) ? deltaEThreshold : 4;
    var threshold2 = threshold * threshold;

    var rows = rawGrid.length;
    if (!rows) return { rawGrid: rawGrid, stats: { before: 0, after: 0, mergedGroups: 0, threshold: threshold } };
    var cols = rawGrid[0].length;

    // 1. 统计唯一色频次
    var freq = new Map();
    for (var r = 0; r < rows; r++) {
      var row = rawGrid[r];
      for (var c = 0; c < cols; c++) {
        var rgb = row[c];
        if (!rgb) continue;
        var k = rgb[0] + ',' + rgb[1] + ',' + rgb[2];
        var rec = freq.get(k);
        if (rec) { rec.count++; }
        else { freq.set(k, { rgb: rgb, count: 1 }); }
      }
    }
    var beforeUniq = freq.size;

    // 2. 按频次降序
    var entries = Array.from(freq.values()).sort(function (a, b) { return b.count - a.count; });

    // 3. 贪心建代表色
    var reps = []; // [{ rgb, lab }]
    var keyToRep = new Map();
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var lab = rgbToLab(e.rgb[0], e.rgb[1], e.rgb[2]);
      var matched = -1;
      for (var j = 0; j < reps.length; j++) {
        var rl = reps[j].lab;
        var dl = lab[0] - rl[0], da = lab[1] - rl[1], db = lab[2] - rl[2];
        if (dl * dl + da * da + db * db < threshold2) { matched = j; break; }
      }
      var srcKey = e.rgb[0] + ',' + e.rgb[1] + ',' + e.rgb[2];
      if (matched >= 0) {
        keyToRep.set(srcKey, reps[matched].rgb);
      } else {
        reps.push({ rgb: e.rgb, lab: lab });
        keyToRep.set(srcKey, e.rgb);
      }
    }

    // 4. 回写 rawGrid（原地修改）
    for (var r2 = 0; r2 < rows; r2++) {
      var row2 = rawGrid[r2];
      for (var c2 = 0; c2 < cols; c2++) {
        var rgb2 = row2[c2];
        if (!rgb2) continue;
        var key2 = rgb2[0] + ',' + rgb2[1] + ',' + rgb2[2];
        var rep = keyToRep.get(key2);
        if (rep && rep !== rgb2) row2[c2] = rep;
      }
    }

    return {
      rawGrid: rawGrid,
      stats: {
        before: beforeUniq,
        after: reps.length,
        mergedGroups: beforeUniq - reps.length,
        threshold: threshold
      }
    };
  }

  /**
   * 空间清噪（连通域级别）：把"杂色小簇"并入主邻色，但保留"特征色小簇"
   *
   * 算法（双门槛保护）：
   *   1. 在 gridData (MARD索引矩阵) 上做 4 邻接连通域标记
   *   2. 对每个 size <= minClusterSize 的小簇：
   *      - 算所有 4 邻接的"邻居色"（不属于本簇的格子色），按格数加权统计
   *      - 取最大邻居色 = mainNb
   *      - 算 ΔE / hueDiff / chromaDiff（本簇代表色 vs mainNb）
   *   3. 判定：
   *      - 若 hueDiff > featureHueDiff °  或  chromaDiff > featureChromaDiff
   *        → 特征色（孤立彩色点），保留
   *      - 否则若 ΔE < mergeDeltaE
   *        → 杂色（同色家族里的边缘伪色），并入 mainNb
   *      - 否则保留（不确定）
   *
   * @param {number[][]} gridData    MARD 索引矩阵（-1 表背景，会被跳过）
   * @param {Object} hooks           getHooks() 返回值
   * @param {Object} cfg             { minClusterSize=3, mergeDeltaE=6, featureHueDiff=25, featureChromaDiff=15 }
   * @returns {{gridData, stats: {clusters, smallClusters, mergedClusters, keptFeatures, threshold}}}
   */
  function spatialClean(gridData, hooks, cfg) {
    cfg = cfg || {};
    var MIN_SIZE = (typeof cfg.minClusterSize === 'number') ? cfg.minClusterSize : 3;
    var MERGE_DE = (typeof cfg.mergeDeltaE === 'number') ? cfg.mergeDeltaE : 6;
    var FEAT_HUE = (typeof cfg.featureHueDiff === 'number') ? cfg.featureHueDiff : 25;
    var FEAT_CHR = (typeof cfg.featureChromaDiff === 'number') ? cfg.featureChromaDiff : 15;
    var MERGE_DE2 = MERGE_DE * MERGE_DE;

    var MARD = hooks.MARD_PALETTE;
    var rgbToLab = hooks.rgbToLab;

    var rows = gridData.length;
    if (!rows) return { gridData: gridData, stats: { clusters: 0, smallClusters: 0, mergedClusters: 0, keptFeatures: 0 } };
    var cols = gridData[0].length;

    // ---- 1. 4 邻接连通域标记（同 MARD 色 id 视为一组）----
    var label = new Array(rows);
    for (var r0 = 0; r0 < rows; r0++) label[r0] = new Int32Array(cols).fill(-1);

    var clusters = []; // [{ id: mardIdx, cells: [[r,c],...] }]
    var qx = new Int32Array(rows * cols);
    var qy = new Int32Array(rows * cols);

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (label[r][c] !== -1) continue;
        var idx = gridData[r][c];
        if (idx < 0) { label[r][c] = -2; continue; } // 背景跳过
        var lid = clusters.length;
        var cells = [];
        var head = 0, tail = 0;
        qx[tail] = c; qy[tail] = r; tail++;
        label[r][c] = lid;
        while (head < tail) {
          var cx = qx[head], cy = qy[head]; head++;
          cells.push([cy, cx]);
          // 4 邻
          if (cy > 0 && label[cy-1][cx] === -1 && gridData[cy-1][cx] === idx) { label[cy-1][cx] = lid; qx[tail]=cx; qy[tail]=cy-1; tail++; }
          if (cy < rows-1 && label[cy+1][cx] === -1 && gridData[cy+1][cx] === idx) { label[cy+1][cx] = lid; qx[tail]=cx; qy[tail]=cy+1; tail++; }
          if (cx > 0 && label[cy][cx-1] === -1 && gridData[cy][cx-1] === idx) { label[cy][cx-1] = lid; qx[tail]=cx-1; qy[tail]=cy; tail++; }
          if (cx < cols-1 && label[cy][cx+1] === -1 && gridData[cy][cx+1] === idx) { label[cy][cx+1] = lid; qx[tail]=cx+1; qy[tail]=cy; tail++; }
        }
        clusters.push({ id: idx, cells: cells });
      }
    }

    // ---- 2/3. 对小簇做判定 ----
    var smallCount = 0, mergedCount = 0, keptFeatures = 0;
    var mardLabCache = {}; // idx -> [L,a,b]
    function getLab(i) {
      if (mardLabCache[i]) return mardLabCache[i];
      var p = MARD[i];
      var lab = rgbToLab(p.r, p.g, p.b);
      mardLabCache[i] = lab;
      return lab;
    }

    for (var ci = 0; ci < clusters.length; ci++) {
      var clu = clusters[ci];
      if (clu.cells.length > MIN_SIZE) continue;
      smallCount++;

      // 统计邻居色频次（不属于本簇的 4 邻格子，按 MARD idx 计数）
      var nbFreq = new Map();
      for (var k = 0; k < clu.cells.length; k++) {
        var rr = clu.cells[k][0], cc = clu.cells[k][1];
        var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        for (var d = 0; d < 4; d++) {
          var nr = rr + dirs[d][0], nc = cc + dirs[d][1];
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          var nIdx = gridData[nr][nc];
          if (nIdx < 0 || nIdx === clu.id) continue; // 跳过背景和自身色
          nbFreq.set(nIdx, (nbFreq.get(nIdx) || 0) + 1);
        }
      }
      if (nbFreq.size === 0) { keptFeatures++; continue; } // 没有异色邻居（可能整图就这一色），保留

      // 找最大邻居色
      var mainNbIdx = -1, mainNbCount = 0;
      nbFreq.forEach(function (cnt, nidx) {
        if (cnt > mainNbCount) { mainNbCount = cnt; mainNbIdx = nidx; }
      });

      // 双门槛判定
      var labA = getLab(clu.id);
      var labB = getLab(mainNbIdx);
      var dl = labA[0] - labB[0], da = labA[1] - labB[1], db = labA[2] - labB[2];
      var dE2 = dl * dl + da * da + db * db;

      // 色相角差（atan2(b,a) 单位是色相方向）
      var huA = Math.atan2(labA[2], labA[1]) * 180 / Math.PI;
      var huB = Math.atan2(labB[2], labB[1]) * 180 / Math.PI;
      var hueDiff = Math.abs(huA - huB);
      if (hueDiff > 180) hueDiff = 360 - hueDiff;

      // 彩度（chroma）= sqrt(a²+b²)
      var chrA = Math.sqrt(labA[1]*labA[1] + labA[2]*labA[2]);
      var chrB = Math.sqrt(labB[1]*labB[1] + labB[2]*labB[2]);
      var chrDiff = Math.abs(chrA - chrB);

      // 特征色保护：色相差大 或 彩度差大 → 不动
      if (hueDiff > FEAT_HUE || chrDiff > FEAT_CHR) {
        keptFeatures++;
        continue;
      }

      // 杂色判定：与主邻色 ΔE 小 → 并入
      if (dE2 < MERGE_DE2) {
        for (var m = 0; m < clu.cells.length; m++) {
          gridData[clu.cells[m][0]][clu.cells[m][1]] = mainNbIdx;
        }
        mergedCount++;
      }
      // else: 不确定，保留
    }

    return {
      gridData: gridData,
      stats: {
        clusters: clusters.length,
        smallClusters: smallCount,
        mergedClusters: mergedCount,
        keptFeatures: keptFeatures,
        cfg: { minClusterSize: MIN_SIZE, mergeDeltaE: MERGE_DE, featureHueDiff: FEAT_HUE, featureChromaDiff: FEAT_CHR }
      }
    };
  }

  /**
   * 总入口：PP 像素化 → rawGrid → [去抖] → MARD 映射 → colorStats
   *
   * options:
   *   ppOptions:  透传给 PerfectPixel
   *   palette:    MARD 子集索引数组（不动 MARD 调色板本身）
   *   dejitter:   { enabled: boolean=true, deltaE: number=4 } 输入端 RGB 去抖
   *
   * @returns {{ok:true, rawGrid, gridData, rows, cols, colorStats, dejitterStats, timings}} | {ok:false, reason}
   */
  function runPerfectPixelPipeline(imageData, options) {
    options = options || {};
    if (!root.PerfectPixel || typeof root.PerfectPixel.getPerfectPixel !== 'function') {
      return { ok: false, reason: 'PerfectPixel 未加载' };
    }

    var t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    var ppRes = root.PerfectPixel.getPerfectPixel(imageData, options.ppOptions || {});
    var t1 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    if (!ppRes || ppRes.ok !== true) {
      return {
        ok: false,
        reason: (ppRes && ppRes.reason) ? ppRes.reason : 'PerfectPixel 返回空或失败'
      };
    }

    var rows = ppRes.refinedH;
    var cols = ppRes.refinedW;
    var rawGrid = pixelMatrixToRawGrid(ppRes.pixelMatrix, rows, cols);
    var t2 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    var dejitterCfg = options.dejitter || {};
    var dejitterEnabled = dejitterCfg.enabled !== false; // 默认开启
    var dejitterStats = null;
    if (dejitterEnabled) {
      var dj = dejitterColors(rawGrid, dejitterCfg.deltaE);
      dejitterStats = dj.stats;
      try {
        console.log(
          '%c[Dejitter]%c 输入RGB 唯一色: ' + dejitterStats.before + ' → ' + dejitterStats.after +
          '  (合并 ' + dejitterStats.mergedGroups + ' 组, ΔE<' + dejitterStats.threshold + ')',
          'color:#fff;background:#06a;padding:2px 6px;border-radius:3px;font-weight:bold',
          'color:#06a;font-weight:bold'
        );
      } catch (_) {}
    }
    var t2b = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    var gridData = mapRawGridToPalette(rawGrid, options.palette || null);
    var t3 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    var hooks = getHooks();

    // 空间清噪（双门槛清噪：消杂色，保特征色）
    var spatialCfg = options.spatialClean || {};
    var spatialEnabled = spatialCfg.enabled !== false; // 默认开启
    var spatialStats = null;
    if (spatialEnabled) {
      var sp = spatialClean(gridData, hooks, spatialCfg);
      gridData = sp.gridData;
      spatialStats = sp.stats;
      try {
        console.log(
          '%c[SpatialClean]%c 连通域: ' + spatialStats.clusters +
          '  小簇: ' + spatialStats.smallClusters +
          '  并入: ' + spatialStats.mergedClusters +
          '  保留特征: ' + spatialStats.keptFeatures +
          '  (size≤' + spatialStats.cfg.minClusterSize +
          ', mergeΔE<' + spatialStats.cfg.mergeDeltaE +
          ', featHue>' + spatialStats.cfg.featureHueDiff +
          '°, featChr>' + spatialStats.cfg.featureChromaDiff + ')',
          'color:#fff;background:#0a6;padding:2px 6px;border-radius:3px;font-weight:bold',
          'color:#0a6;font-weight:bold'
        );
      } catch (_) {}
    }
    var t3b = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    var colorStats = hooks.buildColorStats
      ? hooks.buildColorStats(gridData, rows, cols)
      : buildColorStatsFallback(gridData, rows, cols, hooks.MARD_PALETTE);
    var t4 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    return {
      ok: true,
      rawGrid: rawGrid,
      gridData: gridData,
      rows: rows,
      cols: cols,
      colorStats: colorStats,
      dejitterStats: dejitterStats,
      spatialStats: spatialStats,
      timings: {
        perfectPixelMs: +(t1 - t0).toFixed(2),
        toRawGridMs: +(t2 - t1).toFixed(2),
        dejitterMs: +(t2b - t2).toFixed(2),
        paletteMapMs: +(t3 - t2b).toFixed(2),
        spatialCleanMs: +(t3b - t3).toFixed(2),
        colorStatsMs: +(t4 - t3b).toFixed(2),
        totalMs: +(t4 - t0).toFixed(2)
      }
    };
  }

  // 最小 fallback：供测试页未提供 buildColorStats 时使用（与 app.js 同构）
  function buildColorStatsFallback(gridData, rows, cols, MARD) {
    var freq = new Map();
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var idx = gridData[r][c];
        if (idx === -1) continue;
        freq.set(idx, (freq.get(idx) || 0) + 1);
      }
    }
    var stats = [];
    freq.forEach(function (count, idx) {
      var p = MARD[idx];
      stats.push({ idx: idx, id: p.id, r: p.r, g: p.g, b: p.b, count: count, family: p.family });
    });
    stats.sort(function (a, b) { return b.count - a.count; });
    return stats;
  }

  root.PerfectPixelBridge = {
    pixelMatrixToRawGrid: pixelMatrixToRawGrid,
    mapRawGridToPalette: mapRawGridToPalette,
    dejitterColors: dejitterColors,
    spatialClean: spatialClean,
    runPerfectPixelPipeline: runPerfectPixelPipeline
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PerfectPixelBridge;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));


/* ============================================================================
 * 模块: palette-interaction.js
 * 源路径: src/perfectPixel/js/palette-interaction.js
 * 行数: 698
 * 说明: 色板交互层 — 4 维评分 / 拉杆减色 / 三状态色块（默认/选中/已删除）/ 像素 remap
 * ============================================================================ */
/**
 * Palette Interaction (V2) — 拼豆色板交互层
 *
 * 单一真相源：state.palette[].removed
 * 派生：activeColors / removedColors / sliderValue / colorRemap / displayGridData
 *
 * 依赖：window.PerfectPixelHooks.{MARD_PALETTE, rgbToLab, buildColorStats}
 *      （rgbToLab 仅 fallback；MARD_PALETTE[i].{L,a,b_lab} 已预计算）
 *      内部实现 deltaE2000FromLab（与 app.js 同公式）
 *
 * 暴露：window.PaletteInteraction
 *   - init(ctx, onDisplayChange, onHighlightChange)
 *       onDisplayChange(displayGridData)  色板改动后回调（拉杆/删/恢复）
 *       onHighlightChange(idx|null)       高亮变化回调（点 tile 本体）
 *   - toggleColor(idx, action)            action: 'remove' | 'restore'
 *   - setHighlight(idx|null)              外部主动设/清高亮（idx=null 清空）
 *   - getHighlight()                       读当前高亮 idx
 *   - destroy()
 *   - getDisplayGridData()
 *   - getState()
 *
 * 高亮行为（与老版 colorList 一致）:
 *   - 点 tile 本体（除 × 角标外）→ 切换高亮该色
 *   - 点已删除色块的本体 → 仍可高亮（不真的恢复 removed）
 *   - 点 × → 删除/恢复，与高亮无关
 *   - 高亮渲染交给宿主页（app.js）：宿主在有高亮时切回原始 gridData 显示
 */
(function (global) {
  'use strict';

  // ============================================================
  // 1. 工具：CIEDE2000（不依赖 app.js，避免顺序耦合）
  // ============================================================
  function deltaE2000(L1, a1, b1, L2, a2, b2) {
    const C1 = Math.hypot(a1, b1);
    const C2 = Math.hypot(a2, b2);
    const avgC = (C1 + C2) * 0.5;
    const pow25_7 = 6103515625;
    const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + pow25_7)));
    const a1p = (1 + G) * a1;
    const a2p = (1 + G) * a2;
    const C1p = Math.hypot(a1p, b1);
    const C2p = Math.hypot(a2p, b2);
    const avgCp = (C1p + C2p) * 0.5;
    const h1pDeg = (Math.atan2(b1, a1p) * 180 / Math.PI + 360) % 360;
    const h2pDeg = (Math.atan2(b2, a2p) * 180 / Math.PI + 360) % 360;
    let dHpDeg = h2pDeg - h1pDeg;
    if (Math.abs(dHpDeg) > 180) dHpDeg -= Math.sign(dHpDeg) * 360;
    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dHpDeg * Math.PI / 360);
    const avgLp = (L1 + L2) * 0.5;
    const avgHpDeg = (C1p === 0 || C2p === 0)
      ? (h1pDeg + h2pDeg)
      : (Math.abs(h1pDeg - h2pDeg) > 180 ? (h1pDeg + h2pDeg + 360) * 0.5 : (h1pDeg + h2pDeg) * 0.5);
    const T = 1
      - 0.17 * Math.cos((avgHpDeg - 30) * Math.PI / 180)
      + 0.24 * Math.cos((2 * avgHpDeg) * Math.PI / 180)
      + 0.32 * Math.cos((3 * avgHpDeg + 6) * Math.PI / 180)
      - 0.20 * Math.cos((4 * avgHpDeg - 63) * Math.PI / 180);
    const dTheta = 30 * Math.exp(-Math.pow((avgHpDeg - 275) / 25, 2));
    const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + pow25_7));
    const Sl = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
    const Sc = 1 + 0.045 * avgCp;
    const Sh = 1 + 0.015 * avgCp * T;
    const Rt = -Math.sin(2 * dTheta * Math.PI / 180) * Rc;
    return Math.sqrt(
      Math.pow(dLp / Sl, 2) +
      Math.pow(dCp / Sc, 2) +
      Math.pow(dHp / Sh, 2) +
      Rt * (dCp / Sc) * (dHp / Sh)
    );
  }

  function getMardPalette() {
    return (global.PerfectPixelHooks && global.PerfectPixelHooks.MARD_PALETTE) || global.MARD_PALETTE || [];
  }

  // ============================================================
  // 2. scoring：4 维评分
  // ============================================================

  /**
   * 计算每色的最大连通域大小（4-邻接 BFS，按色单次扫描）
   * @returns {Map<number, number>}  idx → maxComponentSize
   */
  function computeMaxComponents(gridData, rows, cols) {
    const result = new Map();
    const visited = new Uint8Array(rows * cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = r * cols + c;
        if (visited[k]) continue;
        const v = gridData[r][c];
        if (v === -1) { visited[k] = 1; continue; }
        // BFS
        const stack = [k];
        visited[k] = 1;
        let size = 0;
        while (stack.length) {
          const p = stack.pop();
          size++;
          const pr = (p / cols) | 0, pc = p - pr * cols;
          if (pr > 0) { const nk = p - cols; if (!visited[nk] && gridData[pr - 1][pc] === v) { visited[nk] = 1; stack.push(nk); } }
          if (pr < rows - 1) { const nk = p + cols; if (!visited[nk] && gridData[pr + 1][pc] === v) { visited[nk] = 1; stack.push(nk); } }
          if (pc > 0) { const nk = p - 1; if (!visited[nk] && gridData[pr][pc - 1] === v) { visited[nk] = 1; stack.push(nk); } }
          if (pc < cols - 1) { const nk = p + 1; if (!visited[nk] && gridData[pr][pc + 1] === v) { visited[nk] = 1; stack.push(nk); } }
        }
        const cur = result.get(v) || 0;
        if (size > cur) result.set(v, size);
      }
    }
    return result;
  }

  /**
   * 计算每色像素质心（用于 S4 位置分）
   */
  function computeCentroids(gridData, rows, cols) {
    const sumX = new Map(), sumY = new Map(), cnt = new Map();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = gridData[r][c];
        if (v === -1) continue;
        sumX.set(v, (sumX.get(v) || 0) + c);
        sumY.set(v, (sumY.get(v) || 0) + r);
        cnt.set(v, (cnt.get(v) || 0) + 1);
      }
    }
    const out = new Map();
    for (const [v, n] of cnt) out.set(v, [sumX.get(v) / n, sumY.get(v) / n]);
    return out;
  }

  /**
   * computeColorScores：为每个 idx 输出 {score, s1, s2, s3, s4}
   */
  function computeColorScores(colorStats, gridData, mardPalette, imgWidth, imgHeight) {
    const W1 = 0.20, W2 = 0.35, W3 = 0.35, W4 = 0.10;
    const totalBeads = colorStats.reduce((s, c) => s + c.count, 0);
    const logTotal = Math.log(totalBeads + 1);
    const maxComps = computeMaxComponents(gridData, imgHeight, imgWidth);
    const centroids = computeCentroids(gridData, imgHeight, imgWidth);
    const cx = imgWidth / 2, cy = imgHeight / 2;
    const maxDist = Math.hypot(cx, cy);

    // S2 预计算：单次 N(N-1)/2 扫描，复用对称性，缓存每色到其他色最小 ΔE
    const minDeMap = new Map();
    for (const s of colorStats) minDeMap.set(s.idx, Infinity);
    if (colorStats.length > 50) console.warn('[PaletteInteraction] N0=' + colorStats.length + ' >50，S2 计算 O(N²) 可能 >50ms');
    for (let i = 0; i < colorStats.length; i++) {
      const a = mardPalette[colorStats[i].idx];
      for (let j = i + 1; j < colorStats.length; j++) {
        const b = mardPalette[colorStats[j].idx];
        const de = deltaE2000(a.L, a.a, a.b_lab, b.L, b.a, b.b_lab);
        const ia = colorStats[i].idx, ib = colorStats[j].idx;
        if (de < minDeMap.get(ia)) minDeMap.set(ia, de);
        if (de < minDeMap.get(ib)) minDeMap.set(ib, de);
      }
    }

    const scores = new Map();
    for (const s of colorStats) {
      // S1 数量分（log 归一）
      const s1 = (Math.log(s.count + 1) / logTotal) * 10;

      // S2 独特分：到最近其他色的 ΔE（CIEDE2000）
      const minDe = minDeMap.get(s.idx);
      const s2 = colorStats.length <= 1 ? 10 : Math.min(10, (minDe / 20) * 10);

      // S3 聚集分：最大连通域 / 总颗数 × 颗数饱和因子（避免聚集型小噪点拿满分）
      const maxComp = maxComps.get(s.idx) || 1;
      const sizeFactor = Math.min(1, s.count / 10);
      const s3 = Math.min(10, (maxComp / Math.max(1, s.count)) * 10 * sizeFactor);

      // S4 位置分：质心到中心距离归一（越近越高）
      const cen = centroids.get(s.idx);
      const dist = cen ? Math.hypot(cen[0] - cx, cen[1] - cy) : maxDist;
      const s4 = (1 - dist / Math.max(1, maxDist)) * 10;

      const score = W1 * s1 + W2 * s2 + W3 * s3 + W4 * s4;
      scores.set(s.idx, { score, s1, s2, s3, s4 });
    }
    return scores;
  }

  // ============================================================
  // 3. mergeSeq：拉杆动态范围 + 预计算合并序列
  // ============================================================

  function computeSliderRange(palette) {
    const N0 = palette.length;
    const Nfeatures = palette.filter(c => c.score >= 7).length;
    let Nmin = Math.max(Math.ceil(N0 / 3), Nfeatures + 1, 2);
    Nmin = Math.min(8, Math.max(2, Nmin));
    Nmin = Math.min(N0, Nmin);
    if (N0 <= 2) Nmin = N0;
    return { N0, Nmin, Nfeatures };
  }

  /**
   * computeMergeSequence：按"非锁定 + 评分升序"累积砍色
   * step[0] = 不删
   */
  function computeMergeSequence(palette, gridData) {
    const range = computeSliderRange(palette);
    const N0 = range.N0, Nmin = range.Nmin;
    // 候选删除色：未锁定，按评分升序（最差先砍）
    const removable = palette
      .filter(c => !c.locked)
      .slice()
      .sort((a, b) => a.score - b.score);
    const seq = [{ step: 0, removedIdxList: [], activeCount: N0 }];
    const acc = [];
    const maxK = N0 - Nmin;
    for (let k = 0; k < maxK && k < removable.length; k++) {
      acc.push(removable[k].idx);
      seq.push({ step: k + 1, removedIdxList: acc.slice(), activeCount: N0 - acc.length });
    }
    return seq;
  }

  // ============================================================
  // 4. remap：删除 → 最近活跃色
  // ============================================================

  function findNearestActiveColor(removedIdx, activePalette, mardPalette) {
    if (activePalette.length === 0) {
      console.warn('[PaletteInteraction] active set empty, fallback to original idx', removedIdx);
      return removedIdx;
    }
    const r = mardPalette[removedIdx];
    let bestIdx = activePalette[0].idx, bestDe = Infinity;
    for (const a of activePalette) {
      const t = mardPalette[a.idx];
      const de = deltaE2000(r.L, r.a, r.b_lab, t.L, t.a, t.b_lab);
      if (de < bestDe) { bestDe = de; bestIdx = a.idx; }
    }
    return bestIdx;
  }

  function computeRemap(palette) {
    const mard = getMardPalette();
    const active = palette.filter(c => !c.removed);
    const remap = new Map();
    for (const c of palette) {
      if (!c.removed) {
        remap.set(c.idx, c.idx);
      } else {
        remap.set(c.idx, findNearestActiveColor(c.idx, active, mard));
      }
    }
    return remap;
  }

  function applyRemap(gridData, remap) {
    if (!gridData || !remap) return gridData;
    const rows = gridData.length;
    const out = new Array(rows);
    for (let r = 0; r < rows; r++) {
      const src = gridData[r];
      const cols = src.length;
      const dst = new Array(cols);
      for (let c = 0; c < cols; c++) {
        const v = src[c];
        if (v === -1) { dst[c] = -1; continue; }
        const m = remap.get(v);
        dst[c] = (m === undefined ? v : m);
      }
      out[r] = dst;
    }
    return out;
  }

  // ============================================================
  // 5. state：单一真相源 + 派生
  // ============================================================

  const state = {
    palette: [],
    baseGridData: null,
    rows: 0, cols: 0,
    mergeSequence: [],
    N0: 0, Nmin: 2, Nfeatures: 0,
    initialized: false,
    container: null,
    sliderEl: null,
    sliderValEl: null,
    onDisplayChange: null,
    displayGridData: null,
    activeRemap: null,
    lastToggleAt: new Map(),
    tileNodes: new Map()
  };

  function getActiveColors(palette) {
    return palette.filter(c => !c.removed).slice().sort((a, b) => b.initialCount - a.initialCount);
  }
  function getRemovedColors(palette) {
    return palette.filter(c => c.removed).slice().sort((a, b) => a.removedAt - b.removedAt);
  }
  function getSliderValue(palette) {
    return palette.filter(c => !c.removed).length;
  }

  // ============================================================
  // 6. UI：渲染 + 事件
  // ============================================================

  function buildTileNode(c) {
    const tile = document.createElement('div');
    tile.className = 'color-item';
    tile.dataset.idx = String(c.idx);
    const dot = document.createElement('div');
    dot.className = 'color-dot';
    dot.style.background = `rgb(${c.rgb[0]},${c.rgb[1]},${c.rgb[2]})`;
    const meta = document.createElement('div');
    meta.className = 'color-meta';
    const idEl = document.createElement('span');
    idEl.className = 'color-id';
    idEl.textContent = c.id;
    const countEl = document.createElement('span');
    countEl.className = 'color-count';
    meta.appendChild(idEl);
    meta.appendChild(countEl);
    const badge = document.createElement('span');
    badge.className = 'chip-badge';
    badge.addEventListener('click', (e) => {
      // 防止冒泡到 tile 触发高亮切换
      e.stopPropagation();
      const action = badge.dataset.action;
      if (action === 'remove' || action === 'restore') {
        window.PaletteInteraction.toggleColor(c.idx, action);
      }
    });
    tile.appendChild(dot);
    tile.appendChild(meta);
    tile.appendChild(badge);
    tile._countEl = countEl;
    tile._badgeEl = badge;

    // 点 tile 本体（任意非 × 区域）= 切换高亮
    // 已删除色块也可高亮，宿主自行决定渲染源（不会真的恢复 removed）
    tile.addEventListener('click', (e) => {
      // badge 已 stopPropagation，但兜底再判一次防御
      if (e.target === badge || badge.contains(e.target)) return;
      const cur = state.highlightedIdx;
      const next = (cur === c.idx) ? null : c.idx;
      setHighlight(next);
    });
    return tile;
  }

  function renderPalettePanel(palette, container) {
    if (!container) return;
    const tilesEl = container.querySelector('#colorTiles');
    if (!tilesEl) return;
    const mard = getMardPalette();

    // 首次：批量创建 N0 个稳定 DOM 节点
    if (state.tileNodes.size === 0) {
      tilesEl.innerHTML = '';
      const frag = document.createDocumentFragment();
      palette.forEach(c => {
        const node = buildTileNode(c);
        state.tileNodes.set(c.idx, node);
        frag.appendChild(node);
      });
      tilesEl.appendChild(frag);
    }

    // 当前活跃 displayGridData 上的实际颗数（合并后）
    const liveCounts = new Map();
    if (state.displayGridData) {
      for (let r = 0; r < state.rows; r++) {
        const row = state.displayGridData[r];
        for (let c = 0; c < state.cols; c++) {
          const v = row[c];
          if (v === -1) continue;
          liveCounts.set(v, (liveCounts.get(v) || 0) + 1);
        }
      }
    }

    // 顺序：active(按 initialCount 降序) + removed(按 removedAt 升序)
    const active = getActiveColors(palette);
    const removed = getRemovedColors(palette);
    const ordered = active.concat(removed);

    // 差分更新：仅切换 class / 文本 / order
    ordered.forEach((c, i) => {
      const node = state.tileNodes.get(c.idx);
      if (!node) return;
      node.style.order = String(i);
      // class
      const cls = ['color-item'];
      if (c.locked) cls.push('locked');
      if (c.removed) cls.push('removed');
      else if (!c.locked) cls.push('selectable');
      // 高亮态（点 tile 本体触发，与 removed 独立）
      if (state.highlightedIdx === c.idx) cls.push('highlighted');
      // 保留 is-shake 临时态
      if (node.classList.contains('is-shake')) cls.push('is-shake');
      node.className = cls.join(' ');
      // count text
      let countText;
      if (c.removed) {
        const target = mard[c.mergedTo];
        countText = target ? `\u2192 ${target.id}` : `\u2192 ?`;
      } else {
        const live = liveCounts.has(c.idx) ? liveCounts.get(c.idx) : c.initialCount;
        countText = `${live}颗`;
      }
      if (node._countEl.textContent !== countText) node._countEl.textContent = countText;
      // badge
      const badge = node._badgeEl;
      if (c.locked) {
        badge.className = 'chip-badge chip-badge--lock';
        badge.dataset.action = '';
        badge.title = '主色锁定';
        badge.textContent = '\uD83D\uDD12';
      } else if (c.removed) {
        badge.className = 'chip-badge chip-badge--restore';
        badge.dataset.action = 'restore';
        badge.title = '恢复';
        badge.textContent = '\u21BA';
      } else {
        badge.className = 'chip-badge chip-badge--del';
        badge.dataset.action = 'remove';
        badge.title = '删除';
        badge.textContent = '\u2715';
      }
    });

    // 同步拉杆显示
    const sliderEl = state.sliderEl;
    const sliderValEl = state.sliderValEl;
    if (sliderEl) {
      const cur = getSliderValue(palette);
      if (Number(sliderEl.value) !== cur) sliderEl.value = String(cur);
      if (sliderValEl) sliderValEl.textContent = `${cur} / ${state.N0} \u8272`;
    }
  }

  function setupSliderInteraction(sliderEl, palette, onUpdate) {
    if (!sliderEl) return;
    let raf = 0;
    let pending = null;
    const handler = (e) => {
      const target = Math.max(state.Nmin, Math.min(state.N0, Number(e.target.value)));
      pending = target;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        applySliderToTarget(pending);
        if (typeof onUpdate === 'function') onUpdate(state.palette);
      });
    };
    sliderEl.addEventListener('input', handler);
    sliderEl._piHandler = handler;
  }

  /**
   * 拉杆 → 目标活跃数：在当前 palette 上做增量调整（不重置手动恢复）。
   * 锁定色始终算"活跃"，且不动；增删都在非锁定色集合上发生。
   */
  function applySliderToTarget(targetActive) {
    const palette = state.palette;
    const lockedActiveCount = palette.filter(c => c.locked && !c.removed).length;
    const currentActive = palette.filter(c => !c.removed).length;
    const now = Date.now();
    if (targetActive < currentActive) {
      // 砍掉 (currentActive - targetActive) 个：从当前非锁定且未删除中按 score 升序砍
      const toCut = currentActive - targetActive;
      const candidates = palette
        .filter(c => !c.locked && !c.removed)
        .sort((a, b) => a.score - b.score)
        .slice(0, toCut);
      candidates.forEach((c, i) => {
        c.removed = true;
        c.removedAt = now + i;
      });
    } else if (targetActive > currentActive) {
      // 恢复 (targetActive - currentActive) 个：从已删除中按 removedAt 降序（最近被删的先回来）
      const toRestore = targetActive - currentActive;
      const candidates = palette
        .filter(c => c.removed)
        .sort((a, b) => b.removedAt - a.removedAt)
        .slice(0, toRestore);
      candidates.forEach(c => {
        c.removed = false;
        c.removedAt = 0;
        c.mergedTo = -1;
      });
    }
    // 安全兜底：保证锁定色始终活跃
    palette.forEach(c => { if (c.locked && c.removed) { c.removed = false; c.removedAt = 0; c.mergedTo = -1; } });
    void lockedActiveCount;
    refreshDerived();
  }

  function refreshDerived() {
    state.activeRemap = computeRemap(state.palette);
    // 缓存 mergedTo 用于 UI 显示
    state.palette.forEach(c => {
      c.mergedTo = c.removed ? state.activeRemap.get(c.idx) : -1;
    });
    state.displayGridData = applyRemap(state.baseGridData, state.activeRemap);
  }

  // ============================================================
  // 7. 控制器：init / toggleColor / destroy
  // ============================================================

  function init(ctx, onDisplayChange, onHighlightChange) {
    if (!ctx || !ctx.gridData || !ctx.colorStats) {
      console.warn('[PaletteInteraction] init missing ctx');
      return;
    }
    destroy();
    const mard = getMardPalette();
    const { gridData, colorStats, rows, cols } = ctx;
    const scoreMap = computeColorScores(colorStats, gridData, mard, cols, rows);

    // 锁定：按初始颗数降序前 4
    const sortedByCount = colorStats.slice().sort((a, b) => b.count - a.count);
    const lockedSet = new Set(sortedByCount.slice(0, Math.min(4, sortedByCount.length)).map(s => s.idx));

    const palette = colorStats.map(s => {
      const sm = scoreMap.get(s.idx) || { score: 0, s1: 0, s2: 0, s3: 0, s4: 0 };
      return {
        idx: s.idx,
        id: s.id,
        rgb: [s.r, s.g, s.b],
        initialCount: s.count,
        score: sm.score,
        scoreParts: { s1: sm.s1, s2: sm.s2, s3: sm.s3, s4: sm.s4 },
        locked: lockedSet.has(s.idx),
        removed: false,
        removedAt: 0,
        mergedTo: -1
      };
    });

    const range = computeSliderRange(palette);
    state.palette = palette;
    state.baseGridData = gridData;
    state.rows = rows; state.cols = cols;
    state.N0 = range.N0; state.Nmin = range.Nmin; state.Nfeatures = range.Nfeatures;
    state.mergeSequence = computeMergeSequence(palette, gridData);
    state.onDisplayChange = onDisplayChange || null;
    state.onHighlightChange = onHighlightChange || null;
    state.highlightedIdx = null;
    state.initialized = true;
    state.lastToggleAt = new Map();
    state.tileNodes = new Map();

    // DOM
    state.container = document.getElementById('colorPanelV2');
    state.sliderEl = document.getElementById('colorSlider');
    state.sliderValEl = document.getElementById('colorSliderVal');
    if (state.container) {
      state.container.style.display = '';
      // 拉杆动态范围：Nmin >= N0 时整个拉杆没意义，隐藏
      if (state.sliderEl) {
        const sliderWrap = state.sliderEl.closest('.color-slider-wrap') || state.sliderEl.parentElement;
        if (state.N0 <= 2 || state.Nmin >= state.N0) {
          state.sliderEl.disabled = true;
          state.sliderEl.min = String(state.N0); state.sliderEl.max = String(state.N0);
          state.sliderEl.value = String(state.N0);
          if (sliderWrap) sliderWrap.style.display = 'none';
        } else {
          state.sliderEl.disabled = false;
          state.sliderEl.min = String(state.Nmin);
          state.sliderEl.max = String(state.N0);
          state.sliderEl.value = String(state.N0);
          if (sliderWrap) sliderWrap.style.display = '';
        }
        setupSliderInteraction(state.sliderEl, palette, (p) => {
          renderPalettePanel(p, state.container);
          if (typeof state.onDisplayChange === 'function') state.onDisplayChange(state.displayGridData);
        });
      }
    }

    refreshDerived();
    if (state.container) renderPalettePanel(palette, state.container);
    if (typeof state.onDisplayChange === 'function') state.onDisplayChange(state.displayGridData);
  }

  function toggleColor(idx, action) {
    if (!state.initialized) return;
    // 节流 200ms（按 idx 维度，避免连点不同色块被吃）
    const now = Date.now();
    const last = state.lastToggleAt.get(idx) || 0;
    if (now - last < 200) return;
    state.lastToggleAt.set(idx, now);

    const c = state.palette.find(x => x.idx === idx);
    if (!c) return;
    if (c.locked) {
      // Minor-5：锁定色给出 shake UI 反馈
      const node = state.tileNodes.get(idx);
      if (node) {
        node.classList.remove('is-shake');
        void node.offsetWidth;
        node.classList.add('is-shake');
        setTimeout(() => node && node.classList.remove('is-shake'), 420);
      }
      return;
    }

    if (action === 'remove') {
      if (c.removed) return;
      // 不允许删到 < Nmin（下限保护）
      if (getSliderValue(state.palette) <= state.Nmin) return;
      c.removed = true;
      c.removedAt = now;
    } else if (action === 'restore') {
      if (!c.removed) return;
      c.removed = false;
      c.removedAt = 0;
      c.mergedTo = -1;
    } else {
      return;
    }
    refreshDerived();
    if (state.container) renderPalettePanel(state.palette, state.container);
    if (typeof state.onDisplayChange === 'function') state.onDisplayChange(state.displayGridData);
  }

  // 设置/清除高亮（idx=null 清空）
  // 仅维护状态 + 触发回调，不影响 removed 状态；
  // 已删除色块也允许被高亮，宿主自行决定渲染时切换数据源
  function setHighlight(idx) {
    if (!state.initialized) return;
    const next = (idx == null) ? null : idx;
    if (state.highlightedIdx === next) return;
    state.highlightedIdx = next;
    // 更新 DOM class（仅切被影响的 2 个 node，避免全量重渲）
    state.tileNodes.forEach((node, nodeIdx) => {
      const shouldHi = (nodeIdx === next);
      if (shouldHi !== node.classList.contains('highlighted')) {
        node.classList.toggle('highlighted', shouldHi);
      }
    });
    if (typeof state.onHighlightChange === 'function') state.onHighlightChange(next);
  }

  function getHighlight() {
    return state.highlightedIdx;
  }

  function destroy() {
    if (state.sliderEl && state.sliderEl._piHandler) {
      state.sliderEl.removeEventListener('input', state.sliderEl._piHandler);
      state.sliderEl._piHandler = null;
    }
    state.palette = [];
    state.baseGridData = null;
    state.mergeSequence = [];
    state.displayGridData = null;
    state.activeRemap = null;
    state.highlightedIdx = null;
    state.onHighlightChange = null;
    state.initialized = false;
    state.tileNodes = new Map();
    state.lastToggleAt = new Map();
    if (state.container) {
      const tilesEl = state.container.querySelector('#colorTiles');
      if (tilesEl) tilesEl.innerHTML = '';
    }
  }

  function getDisplayGridData() {
    return state.displayGridData;
  }
  function getState() { return state; }

  global.PaletteInteraction = {
    init: init,
    toggleColor: toggleColor,
    setHighlight: setHighlight,
    getHighlight: getHighlight,
    destroy: destroy,
    getDisplayGridData: getDisplayGridData,
    getState: getState,
    // 暴露纯函数供调试 / 测试
    _internal: {
      computeColorScores: computeColorScores,
      computeMergeSequence: computeMergeSequence,
      computeSliderRange: computeSliderRange,
      computeRemap: computeRemap,
      applyRemap: applyRemap,
      deltaE2000: deltaE2000
    }
  };
})(window);


/* ============================================================================
 * Bundle 尾部 — 兜底：把 app.js 中的顶级 const 挂到 window
 * 浏览器里顶级 const 自动是 window 属性，但某些受限环境（vm.createContext）不会
 * ============================================================================ */
if (typeof window !== 'undefined') {
  if (typeof MARD_PALETTE !== 'undefined' && !window.MARD_PALETTE) window.MARD_PALETTE = MARD_PALETTE;
}

/* ============================================================================
 * pindou-bundle.js — 文件结束
 * 总源码行数: 9915
 * 生成时间: 2026-04-21 14:53:33
 * ============================================================================ */
