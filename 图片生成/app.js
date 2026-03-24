const MARD_PALETTE = [
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
const DARK_WARM_INDICES = ALL_INDICES.filter(i => {
  const c = MARD_PALETTE[i];
  const warm = c.hue <= 85 || c.hue >= 320;
  return c.L < 58 && c.chroma >= 6 && warm;
});
const DARK_CHROMATIC_INDICES = ALL_INDICES.filter(i => {
  const c = MARD_PALETTE[i];
  return c.L < 58 && c.chroma >= 6;
});
const LOW_GRID_PREFERRED_IDS = ['H2', 'H5', 'H7', 'H8', 'A21', 'A22', 'F10', 'F21', 'F25', 'E8', 'E18', 'C6', 'G7', 'G8'];
const LOW_GRID_PREFERRED_INDICES = LOW_GRID_PREFERRED_IDS
  .map(id => PALETTE_ID_TO_INDEX.get(id))
  .filter(idx => Number.isInteger(idx));
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
    const score = de00 + chromaPenalty + huePenalty + neutralDarkPenalty + warmToNeutralPenalty + darkWarmSpecklePenalty + darkLiftPenalty + darkTintPenalty + warmDarkToNeutralPenalty - warmDarkAffinityBonus;
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
    const idx = nearestColorByLab(L, a, bVal, ALL_INDICES);
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
function firstPassMatchRgb(rawGrid, rows, cols, allowedIndices) {
  const gridData = [];
  const allowed = Array.isArray(allowedIndices) && allowedIndices.length > 0 ? allowedIndices : null;
  for (let r = 0; r < rows; r++) {
    gridData[r] = [];
    for (let c = 0; c < cols; c++) {
      if (rawGrid[r][c] === null) { gridData[r][c] = -1; continue; }
      const [R, G, B] = rawGrid[r][c];
      gridData[r][c] = findNearestColor(R, G, B, allowed);
    }
  }
  return gridData;
}
function preferLowGridPopularAnchor(rgb, baseIdx) {
  if (!Array.isArray(rgb) || rgb.length < 3 || !Number.isInteger(baseIdx)) return baseIdx;
  if (LOW_GRID_PREFERRED_INDICES.includes(baseIdx)) return baseIdx;
  const [L, a, b] = rgbToLab(rgb[0], rgb[1], rgb[2]);
  const base = MARD_PALETTE[baseIdx];
  if (!base) return baseIdx;
  const baseDist = deltaE2000FromLab(L, a, b, base.L, base.a, base.b_lab);
  let bestIdx = baseIdx;
  let bestDist = baseDist;
  for (const idx of LOW_GRID_PREFERRED_INDICES) {
    const c = MARD_PALETTE[idx];
    if (!c) continue;
    const dist = deltaE2000FromLab(L, a, b, c.L, c.a, c.b_lab);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = idx;
    }
  }
  return bestDist <= baseDist + 0.9 ? bestIdx : baseIdx;
}
function buildLowGridAllowedPalette(rawGrid, rows, cols, colorBudget) {
  if (!rawGrid || rows <= 0 || cols <= 0) return null;
  const budget = Math.max(6, Math.min(18, Number(colorBudget) || 10));
  const buckets = new Map();
  const brightNeutral = [0, 0, 0, 0];
  const darkNeutral = [0, 0, 0, 0];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rgb = rawGrid[r][c];
      if (!rgb) continue;
      const qR = Math.round(rgb[0] / 24);
      const qG = Math.round(rgb[1] / 24);
      const qB = Math.round(rgb[2] / 24);
      const key = `${qR}|${qG}|${qB}`;
      const item = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
      item.count += 1;
      item.r += rgb[0];
      item.g += rgb[1];
      item.b += rgb[2];
      buckets.set(key, item);
      const [L, a, b] = rgbToLab(rgb[0], rgb[1], rgb[2]);
      const chroma = Math.hypot(a, b);
      if (L > 82 && chroma < 10) {
        brightNeutral[0] += rgb[0];
        brightNeutral[1] += rgb[1];
        brightNeutral[2] += rgb[2];
        brightNeutral[3] += 1;
      }
      if (L < 42 && chroma < 16) {
        darkNeutral[0] += rgb[0];
        darkNeutral[1] += rgb[1];
        darkNeutral[2] += rgb[2];
        darkNeutral[3] += 1;
      }
    }
  }
  const chosen = [];
  const sortedBuckets = [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, budget * 4);
  for (const bucket of sortedBuckets) {
    const avg = [bucket.r / bucket.count, bucket.g / bucket.count, bucket.b / bucket.count];
    let idx = findNearestColor(avg[0], avg[1], avg[2], null);
    idx = preferLowGridPopularAnchor(avg, idx);
    if (Number.isInteger(idx) && !chosen.includes(idx)) {
      chosen.push(idx);
    }
    if (chosen.length >= budget) break;
  }
  if (brightNeutral[3] > 0) {
    const avg = [brightNeutral[0] / brightNeutral[3], brightNeutral[1] / brightNeutral[3], brightNeutral[2] / brightNeutral[3]];
    const idx = preferLowGridPopularAnchor(
      avg,
      findNearestColor(avg[0], avg[1], avg[2], [PALETTE_ID_TO_INDEX.get('H2'), PALETTE_ID_TO_INDEX.get('H5')].filter(Number.isInteger))
    );
    if (Number.isInteger(idx) && !chosen.includes(idx)) chosen.unshift(idx);
  }
  if (darkNeutral[3] > 0) {
    const avg = [darkNeutral[0] / darkNeutral[3], darkNeutral[1] / darkNeutral[3], darkNeutral[2] / darkNeutral[3]];
    const idx = preferLowGridPopularAnchor(
      avg,
      findNearestColor(avg[0], avg[1], avg[2], [PALETTE_ID_TO_INDEX.get('H7'), PALETTE_ID_TO_INDEX.get('H8')].filter(Number.isInteger))
    );
    if (Number.isInteger(idx) && !chosen.includes(idx)) chosen.unshift(idx);
  }
  return chosen.slice(0, budget).sort((a, b) => a - b);
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
function detectSemanticFeatureMask(baseGridData, rawGrid, rows, cols, strength) {
  const t = Math.max(0, Math.min(1, Number(strength) || 0));
  const mask = Array.from({ length: rows }, () => new Uint8Array(cols));
  if (!baseGridData || !rawGrid || t <= 0 || rows < 3 || cols < 3) return mask;
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));
  const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const borderPad = t >= 0.75 ? 1 : 2;
  const maxComponentSize = Math.max(2, Math.round(2 + t * 10));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c]) continue;
      const idx = baseGridData[r][c];
      if (idx < 0) continue;
      const cur = MARD_PALETTE[idx];
      visited[r][c] = 1;
      if (cur.chroma < (6 + (1 - t) * 4)) continue;
      const queue = [[r, c]];
      const component = [];
      let touchesBorder = false;
      while (queue.length > 0) {
        const [cr, cc] = queue.shift();
        component.push([cr, cc]);
        if (cr <= borderPad || cc <= borderPad || cr >= rows - 1 - borderPad || cc >= cols - 1 - borderPad) {
          touchesBorder = true;
        }
        for (const [dr, dc] of dirs4) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) continue;
          if (baseGridData[nr][nc] !== idx) continue;
          visited[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
      if (component.length === 0 || component.length > maxComponentSize || touchesBorder) continue;
      let rawChromaSum = 0;
      let boundaryContrast = 0;
      let boundaryEdges = 0;
      let darkNeighborCount = 0;
      let neutralNeighborCount = 0;
      let neighborCount = 0;
      const outsideFreq = new Map();
      const componentSet = new Set(component.map(([rr, cc]) => `${rr},${cc}`));
      for (const [rr, cc] of component) {
        const src = rawGrid[rr][cc];
        if (src) {
          const [, a, b] = rgbToLab(src[0], src[1], src[2]);
          rawChromaSum += Math.hypot(a, b);
        }
        for (const [dr, dc] of dirs8) {
          const nr = rr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (componentSet.has(`${nr},${nc}`)) continue;
          const nIdx = baseGridData[nr][nc];
          if (nIdx < 0) continue;
          neighborCount++;
          outsideFreq.set(nIdx, (outsideFreq.get(nIdx) || 0) + 1);
          const nPal = MARD_PALETTE[nIdx];
          if (nPal.L < 38 && nPal.chroma < 16) darkNeighborCount++;
          if (nPal.chroma < 12 || nPal.L > 78) neutralNeighborCount++;
          const src = rawGrid[rr][cc];
          const nSrc = rawGrid[nr][nc];
          if (src && nSrc) {
            boundaryContrast += Math.abs(src[0] - nSrc[0]) + Math.abs(src[1] - nSrc[1]) + Math.abs(src[2] - nSrc[2]);
            boundaryEdges++;
          }
        }
      }
      if (neighborCount < 4) continue;
      let domIdx = -1;
      let domCount = 0;
      for (const [nIdx, count] of outsideFreq) {
        if (count > domCount) {
          domIdx = nIdx;
          domCount = count;
        }
      }
      if (domIdx < 0) continue;
      const dom = MARD_PALETTE[domIdx];
      const avgRawChroma = rawChromaSum / Math.max(1, component.length);
      const avgBoundaryContrast = boundaryContrast / Math.max(1, boundaryEdges);
      const surroundNeutralRatio = neutralNeighborCount / Math.max(1, neighborCount);
      const colorGap = deltaE2000FromLab(cur.L, cur.a, cur.b_lab, dom.L, dom.a, dom.b_lab);
      if (avgRawChroma < (7 + (1 - t) * 5)) continue;
      if (colorGap < (7 + (1 - t) * 4)) continue;
      const structuredFeature = (
        component.length >= 2 ||
        darkNeighborCount >= 1 ||
        avgBoundaryContrast > (64 - t * 14)
      );
      if (!structuredFeature) continue;
      const tooNoisy = component.length === 1 && darkNeighborCount === 0 && surroundNeutralRatio < 0.32 && avgBoundaryContrast < 34;
      if (tooNoisy) continue;
      for (const [rr, cc] of component) {
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
function getCompatColorBudget(similarMergeLevel) {
  const level = Math.max(0, Math.min(100, similarMergeLevel || 0));
  return Math.max(14, Math.min(36, 34 - Math.round(level * 0.14)));
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
function resolveLowGridIconicMode(imageData, pixN, preset) {
  const n = Math.max(10, Math.min(200, Number(pixN) || 39));
  if (n > 58 || !imageData) {
    return {
      enabled: false,
      colorBudget: null,
      outlineBias: 0,
      planeClean: 0,
      mergeBoost: 0
    };
  }
  const f = analyzeImageFeatures(imageData);
  const force = !!(preset && preset.iconicPreferred);
  const skinHeavy = f.skinLikeRatio > 0.18 && f.paletteComplexity > 240;
  const graphicLike = f.edgeDensity > 0.16 && f.paletteComplexity < 340;
  const cuteFlatLike = f.paletteComplexity < 220 && f.satMean > 0.16 && f.lumStd < 0.24;
  const enabled = force || (!skinHeavy && (graphicLike || cuteFlatLike));
  const baseBudget = n <= 29 ? 8 : (n <= 40 ? 10 : 12);
  return {
    enabled,
    colorBudget: Math.max(6, Math.min(16, baseBudget + (f.paletteComplexity > 210 ? 1 : 0))),
    outlineBias: enabled ? 0.94 : 0,
    planeClean: enabled ? 0.88 : 0,
    mergeBoost: enabled ? 0.82 : 0
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
      while (queue.length > 0) {
        const [cr, cc] = queue.shift();
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
      while (queue.length > 0) {
        const [cr, cc] = queue.shift();
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
      if (sL > (34 + (1 - t) * 14)) continue;
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
          if (nLum > (0.299 * src[0] + 0.587 * src[1] + 0.114 * src[2]) + 16) brighterNeighbors++;
        }
        if (nIdx >= 0 && MARD_PALETTE[nIdx].L < 46) darkNeighbors++;
      }
      const avgContrast = contrastSum / Math.max(1, contrastCount);
      const looksLikeStroke = brighterNeighbors >= 2 && avgContrast > (46 - t * 8);
      if (!looksLikeStroke && darkNeighbors < 2) continue;
      const currentTooLight = cur.L > sL + (8 - t * 2) || (cur.chroma < 7 && srcChroma > 6);
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
function cleanupLowGridIconicNoise(gridData, rawGrid, rows, cols, featureMask, level) {
  const t = Math.max(0, Math.min(1, Number(level) || 0));
  if (!gridData || !rawGrid || rows < 3 || cols < 3 || t <= 0) return gridData;
  let out = gridData.map(row => [...row]);
  const dirs8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let pass = 0; pass < 2; pass++) {
    const next = out.map(row => [...row]);
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (featureMask && featureMask[r] && featureMask[r][c]) continue;
        const src = rawGrid[r][c];
        const curIdx = out[r][c];
        if (!src || curIdx < 0) continue;
        const freq = new Map();
        let same = 0;
        let valid = 0;
        let contrastSum = 0;
        for (const [dr, dc] of dirs8) {
          const nr = r + dr, nc = c + dc;
          const nIdx = out[nr][nc];
          const nRaw = rawGrid[nr][nc];
          if (nIdx < 0 || !nRaw) continue;
          valid++;
          if (nIdx === curIdx) same++;
          freq.set(nIdx, (freq.get(nIdx) || 0) + 1);
          contrastSum += Math.abs(src[0] - nRaw[0]) + Math.abs(src[1] - nRaw[1]) + Math.abs(src[2] - nRaw[2]);
        }
        if (valid < 6 || same >= 4) continue;
        const avgContrast = contrastSum / valid;
        if (avgContrast > (66 - t * 8)) continue;
        let domIdx = curIdx;
        let domCnt = 0;
        for (const [idx, cnt] of freq.entries()) {
          if (idx !== curIdx && cnt > domCnt) {
            domIdx = idx;
            domCnt = cnt;
          }
        }
        if (domIdx === curIdx || domCnt < 4) continue;
        const cur = MARD_PALETTE[curIdx];
        const dom = MARD_PALETTE[domIdx];
        const [sL, sA, sB] = rgbToLab(src[0], src[1], src[2]);
        const curDist = deltaE2000FromLab(sL, sA, sB, cur.L, cur.a, cur.b_lab);
        const domDist = deltaE2000FromLab(sL, sA, sB, dom.L, dom.a, dom.b_lab);
        if (domDist <= curDist * (1.08 + t * 0.1) + 0.8) {
          next[r][c] = domIdx;
        }
      }
    }
    out = next;
  }
  return out;
}
function remapGridToAllowedPalette(gridData, rawGrid, rows, cols, featureMask, allowedIndices) {
  if (!gridData || !rawGrid || !Array.isArray(allowedIndices) || allowedIndices.length === 0) return gridData;
  const out = gridData.map(row => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (featureMask && featureMask[r] && featureMask[r][c]) continue;
      const src = rawGrid[r][c];
      const curIdx = out[r][c];
      if (!src || curIdx < 0) continue;
      const mapped = findNearestColor(src[0], src[1], src[2], allowedIndices);
      if (mapped >= 0) out[r][c] = mapped;
    }
  }
  return out;
}
function generateGridCompat(imageData, pixN, targetRows, targetCols) {
  const preset = PROFILE_PRESETS[appState.activePresetId] || PROFILE_PRESETS.detail_keep;
  const tuning = getResolutionTuning(pixN);
  const lowGridIconic = resolveLowGridIconicMode(imageData, pixN, preset);
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
  const allowedIndices = lowGridIconic.enabled ? buildLowGridAllowedPalette(workRaw, rows, cols, lowGridIconic.colorBudget) : null;
  const sourceFeatureGrid = firstPassMatchRgb(workRaw, rows, cols, allowedIndices);
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
  return { rawGrid: workRaw, gridData, rows, cols, featureMask: semanticFeatureMask, featureSourceGrid: sourceFeatureGrid, lowGridIconic, allowedIndices };
}
function buildBeadDesign(imageData, pixN, targetRows, targetCols) {
  const { rawGrid, gridData: compatGridData, rows, cols, featureMask: compatFeatureMask, featureSourceGrid, lowGridIconic, allowedIndices } = generateGridCompat(imageData, pixN, targetRows, targetCols);
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
  if (lowGridIconic && lowGridIconic.enabled) {
    gridData = remapGridToAllowedPalette(gridData, rawGrid, rows, cols, featureMask, allowedIndices);
    gridData = cleanupLowGridIconicNoise(gridData, rawGrid, rows, cols, featureMask, lowGridIconic.planeClean);
    if (lowGridIconic.mergeBoost > 0) {
      const boostedMerge = Math.max(postMergeLevel, Math.round(Math.max(appState.internalMergeLevel, 14) * lowGridIconic.mergeBoost));
      gridData = applySimilarMergeByPaletteTop(gridData, rawGrid, rows, cols, boostedMerge);
    }
    gridData = cleanupGrayFringeAroundDark(gridData, rawGrid, rows, cols, Math.max(fringeStrength, lowGridIconic.outlineBias), featureMask);
    gridData = preserveThinDarkStrokes(gridData, rawGrid, rows, cols, Math.max(fringeStrength, lowGridIconic.outlineBias), featureMask);
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
  source: 'god-dou-image-convert'
};

function postHostMessage(type, payload) {
  if (!HOST_BRIDGE.embedded || !window.parent || window.parent === window) return false;
  window.parent.postMessage({ source: HOST_BRIDGE.source, type, payload }, '*');
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

function applyImportedAiCandidate(payload) {
  const dataUrl = payload?.imageDataUrl;
  if (!dataUrl || typeof dataUrl !== 'string') {
    showToast('AI 候选图无效，请重新选择');
    return;
  }
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
  navigateTo('page-convert');
  triggerLiveConvert(true);
  postHostMessage('god-dou:image-convert:imported', {
    candidateId: payload?.candidateId || '',
    actualPresetId: payload?.actualPresetId || appState.activePresetId
  });
  showToast(`已导入「${payload?.candidateTitle || 'AI 拼豆方案'}」`);
}

async function buildConvertedPreviewForCandidate(payload) {
  const dataUrl = payload?.imageDataUrl;
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('候选图数据无效');
  }
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
    profileId: payload?.profileId || appState.profileId,
    actualPresetId: payload?.actualPresetId || appState.activePresetId
  };
}

function handleHostImportMessage(event) {
  const data = event.data || {};
  if (data.source !== 'god-dou-home') return;
  if (data.type === 'god-dou:image-convert:import-ai-candidate') {
    applyImportedAiCandidate(data.payload || {});
    return;
  }
  if (data.type === 'god-dou:image-convert:convert-preview') {
    buildConvertedPreviewForCandidate(data.payload || {})
      .then(result => {
        postHostMessage('god-dou:image-convert:preview-result', {
          candidateId: data.payload?.candidateId || '',
          ...result
        });
      })
      .catch(error => {
        postHostMessage('god-dou:image-convert:toast', {
          message: `候选预览生成失败：${error?.message || '未知错误'}`
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
}
function renderFinalLegend() {
  const container = document.getElementById('finalCanvasLegend');
  if (!container) return;
  const chips = [...(appState.colorStats || [])].sort((a, b) => a.idx - b.idx);
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
  } else if (!skipRender) {
    renderResult(true);
  }
}
function invalidateEditState() {
  appState.gridVersion += 1;
  appState.editGridData = null;
  appState.editBaseGridData = null;
  appState.editSourceVersion = -1;
  appState.undoStack = [];
  appState.pendingStrokeAction = null;
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
  if (quality === 'standard') return { label: '标准', exportMultiplier: 1 };
  if (quality === 'ultra') return { label: '4K', exportMultiplier: 4 };
  if (quality === '8k') return { label: '8K', exportMultiplier: 8 };
  if (quality === '16k') return { label: '16K', exportMultiplier: 16 };
  return { label: '2K', exportMultiplier: 2 };
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
  var chips = (appState.colorStats || []).slice().sort(function(a, b) { return a.idx - b.idx; }).map(function(item) {
    return { label: item.id, rgb: [item.r, item.g, item.b], count: item.count, text: String(item.id) };
  });
  var legendOriginX = gridOriginX;
  var legendWidth = gridWidth;
  var legendColumns = 6;
  var chipWidth = 18 * uiScale;
  var chipRowsCount = Math.max(1, Math.ceil(chips.length / legendColumns));
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
  drawGrid(ctx, appState.gridData, rows, cols, cellSize, true, appState.finalShowLabels !== false, false);
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
      ctx.roundRect(x, chipY, chipWidth, 12 * uiScale, 3 * uiScale);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.08)';
      ctx.lineWidth = Math.max(0.6, uiScale * 0.5);
      ctx.stroke();
      var lum = (chip.rgb[0] * 0.299 + chip.rgb[1] * 0.587 + chip.rgb[2] * 0.114) / 255;
      ctx.fillStyle = lum < 0.58 ? '#fff' : '#333';
      ctx.textAlign = 'center';
      ctx.font = 'bold ' + Math.max(6, 6 * uiScale) + 'px "SFMono-Regular", Consolas, monospace';
      ctx.fillText(chip.text, x + chipWidth / 2, chipY + 7.2 * uiScale);
      ctx.fillStyle = '#666';
      ctx.font = Math.max(6, 6 * uiScale) + 'px "SFMono-Regular", Consolas, monospace';
      ctx.fillText(String(chip.count), x + chipWidth / 2, chipY + 18 * uiScale);
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
  smart_iconic: {
    label: '智能推荐',
    dither: 0,
    similarMerge: 26,
    refine: 96,
    centerBias: 0.84,
    quantizeMode: 'strong',
    darkLineBoost: 1,
    warmSpeckleGuard: 1,
    postMergeFactor: 0.92,
    featureProtect: 0.86,
    darkFringeClean: 1,
    hairRegionDetectStrength: 0,
    hairPaletteLevels: 0,
    hairNeutralReject: 0,
    hairInteriorSmooth: 0,
    hairBoundaryProtect: 0,
    figureBoundaryClean: 0,
    clothNoiseClean: 0,
    removeBg: true,
    iconicPreferred: true,
    hint: '检测到低格数常见拼豆场景，优先做图标化块面、禁灰和轮廓识别'
  },
  portrait_opt: {
    label: '人像优化',
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
  const n = Math.max(10, Math.min(200, Number(appState && appState.pixN) || 39));
  if (n <= 58 && f.skinLikeRatio < 0.2 && ((f.edgeDensity > 0.12 && f.paletteComplexity < 360) || (f.paletteComplexity < 250 && f.satMean > 0.14))) {
    return { id: 'smart_iconic', reason: '检测到低格数 Q版/图标化场景，已优先使用块面化和线条禁灰方案' };
  }
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
  while (queue.length > 0) {
    const [cr, cc] = queue.shift();
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
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW, y = r * cellH;
      if (appState.gridData[r][c] === -1) {
        const cs = Math.max(2, Math.floor(Math.min(cellW, cellH) / 2));
        for (let cy = 0; cy < cellH; cy += cs) {
          for (let cx = 0; cx < cellW; cx += cs) {
            const isLight = ((Math.floor(cx/cs) + Math.floor(cy/cs)) % 2 === 0);
            beadsCtx.fillStyle = isLight ? '#f0f0f0' : '#dcdcdc';
            beadsCtx.fillRect(x + cx, y + cy, cs, cs);
          }
        }
      } else {
        const mc = MARD_PALETTE[appState.gridData[r][c]];
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
  document.getElementById('previewStats').innerHTML =
    `<span class="preview-summary">${m.totalBeads.toLocaleString()}颗 · ${m.colorCount}种颜色</span>`;
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
      appState.previewScale = Math.max(0.75, Math.min(6, appState.previewScale * delta));
      applyPreviewTransform();
    }, { passive: false });
    viewport.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        dragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        isPinch = true;
        pinchDist = getDistance(e.touches);
        pinchScale = appState.previewScale;
      }
    }, { passive: true });
    viewport.addEventListener('touchmove', e => {
      if (isPinch && e.touches.length === 2) {
        const dist = getDistance(e.touches);
        appState.previewScale = Math.max(0.75, Math.min(6, pinchScale * dist / Math.max(1, pinchDist)));
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
function buildRegressionSnapshot() {
  if (!appState.gridData || !appState.metadata) return null;
  const prevShowGrid = appState.showGrid;
  const prevShowLabels = appState.showLabels;
  const prevShowMirror = appState.showMirror;
  appState.showGrid = false;
  appState.showLabels = false;
  appState.showMirror = false;
  renderResult();
  const resultCanvas = document.getElementById('resultCanvas');
  const snapshot = {
    metadata: { ...(appState.metadata || {}) },
    profileId: appState.profileId,
    activePresetId: appState.activePresetId,
    colorStats: (appState.colorStats || []).map(item => ({
      id: item.id,
      idx: item.idx,
      count: item.count,
      r: item.r,
      g: item.g,
      b: item.b
    })),
    gridData: appState.gridData.map(row => [...row]),
    resultDataUrl: resultCanvas ? resultCanvas.toDataURL('image/png') : '',
    sourceName: appState.file?.name || ''
  };
  appState.showGrid = prevShowGrid;
  appState.showLabels = prevShowLabels;
  appState.showMirror = prevShowMirror;
  renderResult();
  return snapshot;
}
async function runRegressionCase(payload) {
  applyImportedAiCandidate({
    ...(payload || {}),
    targetPage: 'page-result'
  });
  const jobId = appState.liveJobId;
  const startedAt = Date.now();
  while (Date.now() - startedAt < 60000) {
    const proc = document.getElementById('previewProcessing');
    const done = !!appState.gridData && !!appState.metadata && appState.liveJobId === jobId && !(proc && proc.classList.contains('show'));
    if (done) {
      if (!document.getElementById('page-result')?.classList.contains('active')) {
        navigateTo('page-result');
        await sleep(60);
      }
      return buildRegressionSnapshot();
    }
    await sleep(120);
  }
  throw new Error('回归测试超时：60 秒内未完成生成');
}
window.GodDouRegressionApi = {
  runRegressionCase,
  buildRegressionSnapshot
};
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
  drawGrid(ctx, appState.gridData, rows, cols, cellSize, appState.showGrid, appState.showLabels, appState.showMirror);
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
  list.innerHTML = appState.colorStats.map(s =>
    `<div class="color-item${appState.highlightedResultColor === s.idx ? ' active' : ''}" onclick="toggleResultColorHighlight(${s.idx})">` +
    `<div class="color-dot" style="background:rgb(${s.r},${s.g},${s.b})"></div>` +
    `<div class="color-meta"><span class="color-id">${s.id}</span><span class="color-count">${s.count}颗</span></div></div>`
  ).join('');
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
function saveImage(target) {
  const activeTarget = target || (document.getElementById('page-final-art')?.classList.contains('active') ? 'final' : 'result');
  let canvas = activeTarget === 'final' ? document.getElementById('finalCanvas') : document.getElementById('resultCanvas');
  if (!canvas) {
    showToast('当前没有可保存的图片');
    return;
  }
  if (activeTarget === 'final') {
    const scale = Math.max(1, Number(getFinalQualityConfig().exportMultiplier || 1));
    const pageCanvas = document.getElementById('finalCanvas');
    const legend = document.getElementById('finalCanvasLegend');
    const pageCanvasRect = pageCanvas.getBoundingClientRect();
    const legendRect = legend ? legend.getBoundingClientRect() : { width: 0, height: 0 };
    const exportCanvas = document.createElement('canvas');
    const scaleX = (pageCanvas.width * scale) / Math.max(1, pageCanvasRect.width);
    const pageCanvasExportHeight = Math.round(pageCanvas.height * scale);
    const legendExportHeight = Math.round((legendRect.height || 0) * scaleX);
    exportCanvas.width = Math.round(pageCanvas.width * scale);
    exportCanvas.height = pageCanvasExportHeight + legendExportHeight;
    const ectx = exportCanvas.getContext('2d');
    ectx.imageSmoothingEnabled = false;
    ectx.fillStyle = '#fff';
    ectx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ectx.drawImage(pageCanvas, 0, 0, exportCanvas.width, pageCanvasExportHeight);

    if (legend && legend.children.length) {
      const itemNodes = Array.from(legend.querySelectorAll('.final-legend-item'));
      const legendScale = scaleX;
      const baseX = 0;
      const baseY = pageCanvasExportHeight;
      const usableWidth = Math.round((legendRect.width || pageCanvasRect.width) * legendScale);
      ectx.fillStyle = '#eef0f5';
      ectx.fillRect(baseX, baseY, usableWidth, legendExportHeight);
      ectx.strokeStyle = 'rgba(0,0,0,.06)';
      ectx.lineWidth = Math.max(1, scale);
      ectx.beginPath();
      ectx.moveTo(baseX, baseY + 0.5 * scale);
      ectx.lineTo(baseX + usableWidth, baseY + 0.5 * scale);
      ectx.stroke();

      let flowX = 0;
      let flowY = baseY + Math.max(2, Math.round(2 * legendScale));
      itemNodes.forEach((node) => {
        const swatch = node.querySelector('.final-legend-swatch');
        const count = node.querySelector('.final-legend-count');
        if (!swatch || !count) return;
        const swatchRect = swatch.getBoundingClientRect();
        const scaleBoost = 0.625;
        const swatchW = Math.max(5, Math.round(swatchRect.width * legendScale * scaleBoost));
        const swatchH = Math.max(5, Math.round(swatchRect.height * legendScale * scaleBoost));
        const codeFont = Math.max(4, Math.round(parseFloat(getComputedStyle(swatch).fontSize || '6') * legendScale * scaleBoost));
        const countFont = Math.max(4, Math.round(parseFloat(getComputedStyle(count).fontSize || '6') * legendScale * scaleBoost));
        const itemWidth = swatchW + Math.max(2, Math.round(2 * legendScale));
        const itemHeight = swatchH + countFont + Math.max(3, Math.round(2 * legendScale));
        if (flowX + itemWidth > usableWidth && flowX > 0) {
          flowX = 0;
          flowY += itemHeight + Math.max(2, Math.round(2 * legendScale));
        }
        const swatchX = flowX + Math.round((itemWidth - swatchW) / 2);
        const swatchY = flowY;
        const bg = bgFromComputed(getComputedStyle(swatch).backgroundColor);
        const fg = getComputedStyle(swatch).color || '#333';
        ectx.fillStyle = bg;
        ectx.beginPath();
        ectx.roundRect(swatchX, swatchY, swatchW, swatchH, Math.max(2, Math.round(2 * legendScale)));
        ectx.fill();
        ectx.strokeStyle = 'rgba(0,0,0,.08)';
        ectx.lineWidth = Math.max(0.6, legendScale * 0.4);
        ectx.stroke();
        ectx.fillStyle = fg;
        ectx.font = `900 ${codeFont}px monospace`;
        ectx.textAlign = 'center';
        ectx.textBaseline = 'middle';
        ectx.fillText(swatch.textContent || '', swatchX + swatchW / 2, swatchY + swatchH / 2);
        ectx.fillStyle = '#666';
        ectx.font = `700 ${countFont}px monospace`;
        const countX = flowX + itemWidth / 2;
        const countY = swatchY + swatchH + Math.max(3, Math.round(2 * legendScale));
        ectx.fillText(count.textContent || '', countX, countY);
        flowX += itemWidth + Math.max(1, Math.round(1 * legendScale));
      });
    }

    canvas = exportCanvas;
  }
  const link = document.createElement('a');
  const suffix = activeTarget === 'final' ? 'final' : 'preview';
  link.download = `pindou_${appState.metadata.cols}x${appState.metadata.rows}_${suffix}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('图片已保存');
}
(function() {
  const container = document.getElementById('resultCanvasContainer');
  const canvas = document.getElementById('resultCanvas');
  let isPinching = false, startDist = 0, startScale = 1;
  container.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    appState.scale = Math.max(0.2, Math.min(10, appState.scale * delta));
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
      startDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      startScale = appState.scale;
    } else if (e.touches.length === 1) {
      appState.dragging = true;
      appState.lastX = e.touches[0].clientX; appState.lastY = e.touches[0].clientY;
    }
  }, {passive:true});
  container.addEventListener('touchmove', e => {
    if (isPinching && e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      appState.scale = Math.max(0.2, Math.min(10, startScale * dist / startDist));
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
      pinchDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      pinchScale = appState.editScale;
    }
  }, {passive:true});
  canvas.addEventListener('touchmove', e => {
    if (isPinch && e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      appState.editScale = Math.max(0.2, Math.min(10, pinchScale * dist / pinchDist));
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
    appState.editScale = Math.max(0.2, Math.min(10, appState.editScale * delta));
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
