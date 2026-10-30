'use client';

import * as THREE from 'three';
import { useRef, useEffect, forwardRef, type ReactNode, type CSSProperties, useImperativeHandle, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

export type TerminalRainMode = 'auto' | 'glow' | 'ink';

export interface TerminalRainHandle {
  burst: (x?: number, y?: number) => void;
}

export interface TerminalRainProps {
  colors?: [string, string];
  backgroundColor?: string;
  mode?: TerminalRainMode;
  glyphs?: string;
  fontFamily?: string;
  glyphSize?: number;
  spacing?: number;
  density?: number;
  trail?: number;
  speed?: number;
  variance?: number;
  angle?: number;
  shuffle?: number;
  mirror?: boolean;
  depth?: number;
  glow?: number;
  intensity?: number;
  interactive?: boolean;
  bulletTime?: boolean;
  slowRadius?: number;
  slowStrength?: number;
  clickBurst?: boolean;
  burstSize?: number;
  paused?: boolean;
  quality?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface Settings {
  colors: [string, string];
  backgroundColor: string;
  mode: TerminalRainMode;
  glyphs: string;
  fontFamily: string;
  glyphSize: number;
  spacing: number;
  density: number;
  trail: number;
  speed: number;
  variance: number;
  angle: number;
  shuffle: number;
  mirror: boolean;
  depth: number;
  glow: number;
  intensity: number;
  interactive: boolean;
  bulletTime: boolean;
  slowRadius: number;
  slowStrength: number;
  clickBurst: boolean;
  burstSize: number;
  paused: boolean;
  quality: number;
  reduced: boolean;
}

interface Controller {
  sync: () => void;
  destroy: () => void;
  burst: (x: number, y: number) => void;
}

interface Grid {
  cellW: number;
  cellH: number;
  cols: number;
  rows: number;
  originX: number;
  originY: number;
  speedScale: number;
  gain: number;
  bias: number;
  columnSpeed: Float32Array;
  heads: Float32Array;
  respawn: Float32Array;
  headTexture: THREE.DataTexture;
  targets: THREE.WebGLRenderTarget[];
  index: number;
}

const HEADS = 3;
const BURST = HEADS - 1;
const ATLAS_COLUMNS = 16;
const DEFAULT_GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF';
const DEFAULT_FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, "Hiragino Sans", "Noto Sans JP", "Yu Gothic", monospace';

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};

const readMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

let colorContext: CanvasRenderingContext2D | null = null;

const parseColor = (value: string, fallback: [number, number, number]): [number, number, number] => {
  if (!colorContext) colorContext = document.createElement('canvas').getContext('2d');
  if (!colorContext) return fallback;
  colorContext.fillStyle = '#010203';
  colorContext.fillStyle = value;
  const read = String(colorContext.fillStyle);
  if (read === '#010203' && value.trim().toLowerCase() !== '#010203') return fallback;
  if (read.startsWith('#')) {
    const hex = read.slice(1);
    return [Number.parseInt(hex.slice(0, 2), 16) / 255, Number.parseInt(hex.slice(2, 4), 16) / 255, Number.parseInt(hex.slice(4, 6), 16) / 255];
  }
  const parts = read.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return fallback;
  return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
};

const toLinear = (value: number) => (value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));

const toOklab = ([r, g, b]: [number, number, number]): [number, number, number] => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fieldChunk = `
uniform vec4 uHover;
uniform float uSlow;

float rateAt(vec2 s) {
  vec2 gap = s - uHover.xy;
  float slow = uSlow * uHover.z * exp(-dot(gap, gap) / (uHover.w * uHover.w));
  return max(1.0 - slow, 0.02);
}
`;

const gridChunk = `
uniform vec2 uCenter;
uniform float uAngle;

vec2 toGrid(vec2 s, vec2 origin, vec2 cell) {
  vec2 d = s - uCenter;
  float c = cos(uAngle);
  float n = sin(uAngle);
  vec2 r = vec2(c * d.x + n * d.y, -n * d.x + c * d.y) + uCenter;
  return (r - origin) / cell;
}

vec2 toScreen(vec2 g, vec2 origin, vec2 cell) {
  vec2 r = origin + g * cell - uCenter;
  float c = cos(uAngle);
  float n = sin(uAngle);
  return vec2(c * r.x - n * r.y, n * r.x + c * r.y) + uCenter;
}
`;

const stateFragment = `
precision highp float;
uniform sampler2D uPrevious;
uniform sampler2D uHeads;
uniform vec2 uOrigin;
uniform vec2 uCell;
uniform float uDt;
uniform float uTrail;
uniform float uShuffle;
uniform float uGlyphCount;
uniform float uSeed;
${gridChunk}
${fieldChunk}
out vec4 fragColor;

float hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  vec4 previous = texelFetch(uPrevious, cell, 0);
  float speed = texelFetch(uHeads, ivec2(0, cell.x), 0).x;
  vec2 screen = toScreen(vec2(cell) + 0.5, uOrigin, uCell);
  float rate = rateAt(screen);
  float tau = uTrail / max(speed, 0.5) / 2.2;
  float light = previous.x * exp(-uDt * rate / tau);
  float glyph = previous.y;
  float row = float(cell.y) + 0.5;
  for (int k = 1; k <= ${HEADS}; k++) {
    vec4 head = texelFetch(uHeads, ivec2(k, cell.x), 0);
    if (head.z > 0.5 && head.x < row && row <= head.y) {
      light = max(light, clamp(head.z - 0.5, 0.0, 1.0));
      glyph = floor(hash(vec3(vec2(cell), head.w * 97.0 + row)) * uGlyphCount);
    }
  }
  float churn = uShuffle * 2.5 * rate * uDt;
  if (hash(vec3(vec2(cell), uSeed)) < churn) glyph = floor(hash(vec3(vec2(cell) + 17.0, uSeed * 1.7)) * uGlyphCount);
  fragColor = vec4(light, glyph, 0.0, 1.0);
}
`;

const passVertex = `
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const rainFragment = `
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uAtlasGrid;
uniform vec2 uResolution;
uniform float uMirror;
uniform float uGlyphScale;
uniform vec3 uLabTrail;
uniform vec3 uLabHead;
uniform float uInk;
uniform sampler2D uState0;
uniform sampler2D uHeads0;
uniform vec2 uOrigin0;
uniform vec4 uGrid0;
uniform sampler2D uState1;
uniform sampler2D uHeads1;
uniform vec2 uOrigin1;
uniform vec4 uGrid1;
uniform float uFar;
${gridChunk}
in vec2 vUv;
out vec4 fragColor;

vec3 labToLinear(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0);
}

float hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

vec4 layer(sampler2D state, sampler2D heads, vec2 origin, vec4 grid, float bias) {
  vec2 screen = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 g = toGrid(screen, origin, grid.xy);
  ivec2 cell = ivec2(floor(g));
  if (cell.x < 0 || cell.y < 0 || float(cell.x) >= grid.z || float(cell.y) >= grid.w) return vec4(0.0);
  vec4 data = texelFetch(state, cell, 0);
  float light = data.x;
  float glyph = data.y;
  float head = 0.0;
  for (int k = 1; k <= ${HEADS}; k++) {
    vec4 h = texelFetch(heads, ivec2(k, cell.x), 0);
    if (h.z > 0.5 && floor(h.y) == float(cell.y)) {
      head = clamp(h.z - 0.5, 0.0, 1.0);
      glyph = floor(hash(vec3(vec2(cell), h.w * 31.0 + floor(h.y * 3.0))) * max(uAtlasGrid.x * uAtlasGrid.y, 1.0));
    }
  }
  if (light < 0.004 && head < 0.5) return vec4(0.0);
  vec2 f = fract(g);
  vec2 local = vec2(f.x - 0.5, f.y - 0.5);
  if (uMirror > 0.5) local.x = -local.x;
  vec2 span = vec2(grid.x / grid.y, 1.0) * 0.84 * uGlyphScale;
  vec2 texel = 0.5 + local * span;
  float inside = step(0.02, texel.x) * step(texel.x, 0.98) * step(0.02, texel.y) * step(texel.y, 0.98);
  float index = mod(glyph, uAtlasGrid.x * uAtlasGrid.y);
  vec2 slot = vec2(mod(index, uAtlasGrid.x), floor(index / uAtlasGrid.x));
  vec2 uv = (slot + texel) / uAtlasGrid;
  vec2 scale = span / uAtlasGrid;
  float coverage = textureGrad(uAtlas, uv, dFdx(g) * scale * exp2(bias), dFdy(g) * scale * exp2(bias)).r * inside;
  float flicker = 0.82 + 0.18 * hash(vec3(vec2(cell), glyph));
  float fresh = smoothstep(0.55, 1.0, light);
  vec3 trailTone = labToLinear(mix(vec3(uLabTrail.x * 0.55, uLabTrail.yz * 0.9), uLabTrail, smoothstep(0.0, 0.6, light)));
  vec3 tone = mix(trailTone, labToLinear(uLabHead), fresh * 0.35);
  vec3 headTone = labToLinear(uLabHead);
  vec3 inkHead = labToLinear(vec3(uLabTrail.x * 0.55, uLabTrail.yz * 1.1));
  headTone = mix(headTone, inkHead, uInk);
  float fade = light * (0.35 + 0.65 * light);
  float energy = coverage * (fade * flicker * 0.8 + head * 0.9);
  vec3 color = mix(tone, headTone, head) * energy;
  return vec4(color, energy);
}

void main() {
  vec4 near = layer(uState0, uHeads0, uOrigin0, uGrid0, 0.0);
  vec4 far = uFar > 0.0 ? layer(uState1, uHeads1, uOrigin1, uGrid1, 1.2) * uFar : vec4(0.0);
  fragColor = near + far;
}
`;

const downFragment = `
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 a = texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  vec4 b = texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  vec4 c = texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  vec4 d = texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = (a + b + c + d) * 0.125 + texture(uSource, vUv) * 0.5;
}
`;

const upFragment = `
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 sum = texture(uSource, vUv) * 4.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, -1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, 1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = texture(uBase, vUv) + sum / 16.0;
}
`;

const compositeFragment = `
precision highp float;
uniform sampler2D uLines;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform float uGlow;
uniform float uExposure;
uniform float uMode;
uniform float uGrain;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

void main() {
  vec4 lines = texture(uLines, vUv);
  vec4 bloom = texture(uBloom, vUv);
  vec3 color;
  if (uMode < 0.5) {
    vec3 light = (lines.rgb + bloom.rgb * uGlow) * uExposure;
    vec3 exposed = 1.0 - exp(-light);
    float peak = max(exposed.r, max(exposed.g, exposed.b));
    exposed = mix(exposed, vec3(peak), smoothstep(0.75, 1.0, peak) * 0.35);
    color = uBackground + (1.0 - uBackground) * exposed;
  } else {
    float energy = lines.a + bloom.a * uGlow * 0.2;
    vec3 hue = (lines.rgb + bloom.rgb * uGlow * 0.2) / max(energy, 1e-4);
    float cover = clamp(1.0 - exp(-energy * uExposure * 1.4), 0.0, 0.95);
    color = mix(uBackground, clamp(hue * 0.85, 0.0, 1.0), cover);
  }
  float grain = hash(gl_FragCoord.xy + uGrain * 311.0) - 0.5;
  fragColor = vec4(encode(color) + grain * (1.2 / 255.0), 1.0);
}
`;

const buildAtlas = (glyphs: string, fontFamily: string, cell: number) => {
  const list = Array.from(new Set(Array.from(glyphs.replace(/\s/g, '')))).slice(0, 512);
  if (list.length === 0) list.push('0', '1');
  const rows = Math.ceil(list.length / ATLAS_COLUMNS);
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_COLUMNS * cell;
  canvas.height = rows * cell;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `500 ${Math.round(cell * 0.78)}px ${fontFamily}`;
    for (const [index, character] of list.entries()) {
      const x = (index % ATLAS_COLUMNS) * cell + cell / 2;
      const y = Math.floor(index / ATLAS_COLUMNS) * cell + cell / 2 + cell * 0.04;
      context.fillText(character, x, y);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.NoColorSpace;
  texture.flipY = false;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return { texture, count: list.length, rows };
};

const createRain = (root: HTMLDivElement, settingsRef: { current: Settings }): Controller | null => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.pointerEvents = 'none';
  root.prepend(canvas);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: 'high-performance' });
  } catch {
    canvas.remove();
    return null;
  }
  if (!renderer.capabilities.isWebGL2) {
    renderer.dispose();
    canvas.remove();
    return null;
  }
  renderer.autoClear = false;
  const floatTargets = renderer.extensions.has('EXT_color_buffer_float');
  const texelType = floatTargets || renderer.extensions.has('EXT_color_buffer_half_float') ? THREE.HalfFloatType : THREE.UnsignedByteType;
  const stateType = floatTargets ? THREE.FloatType : THREE.HalfFloatType;

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const plane = new THREE.PlaneGeometry(2, 2);
  const hover = { x: 0, y: 0, vx: 0, vy: 0, goalX: 0, goalY: 0, amount: 0, inside: false, placed: false };

  const fieldUniforms = {
    uHover: { value: new THREE.Vector4(0, 0, 0, 100) },
    uSlow: { value: 0.9 },
  };
  const gridUniforms = {
    uCenter: { value: new THREE.Vector2() },
    uAngle: { value: 0 },
  };

  const pass = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
    new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms,
      vertexShader: passVertex,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    });

  const stateMaterial = pass(stateFragment, {
    ...fieldUniforms,
    ...gridUniforms,
    uPrevious: { value: null },
    uHeads: { value: null },
    uOrigin: { value: new THREE.Vector2() },
    uCell: { value: new THREE.Vector2(1, 1) },
    uDt: { value: 0 },
    uTrail: { value: 16 },
    uShuffle: { value: 0.4 },
    uGlyphCount: { value: 1 },
    uSeed: { value: 0 },
  });
  const rainMaterial = pass(rainFragment, {
    ...gridUniforms,
    uAtlas: { value: null },
    uAtlasGrid: { value: new THREE.Vector2(ATLAS_COLUMNS, 1) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMirror: { value: 0 },
    uGlyphScale: { value: 1 },
    uLabTrail: { value: new THREE.Vector3() },
    uLabHead: { value: new THREE.Vector3() },
    uInk: { value: 0 },
    uState0: { value: null },
    uHeads0: { value: null },
    uOrigin0: { value: new THREE.Vector2() },
    uGrid0: { value: new THREE.Vector4(1, 1, 1, 1) },
    uState1: { value: null },
    uHeads1: { value: null },
    uOrigin1: { value: new THREE.Vector2() },
    uGrid1: { value: new THREE.Vector4(1, 1, 1, 1) },
    uFar: { value: 0 },
  });
  const downMaterial = pass(downFragment, { uSource: { value: null }, uTexel: { value: new THREE.Vector2() } });
  const upMaterial = pass(upFragment, {
    uSource: { value: null },
    uBase: { value: null },
    uTexel: { value: new THREE.Vector2() },
  });
  const compositeMaterial = pass(compositeFragment, {
    uLines: { value: null },
    uBloom: { value: null },
    uBackground: { value: new THREE.Vector3() },
    uGlow: { value: 0.5 },
    uExposure: { value: 1.4 },
    uMode: { value: 0 },
    uGrain: { value: 0 },
  });

  const quad = new THREE.Mesh(plane, compositeMaterial);
  quad.frustumCulled = false;
  const quadScene = new THREE.Scene();
  quadScene.add(quad);

  const target = (w: number, h: number, type: THREE.TextureDataType, filter: THREE.MagnificationTextureFilter) =>
    new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
      type,
      format: THREE.RGBAFormat,
      minFilter: filter,
      magFilter: filter,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    });

  let lineTarget: THREE.WebGLRenderTarget | null = null;
  let downTargets: THREE.WebGLRenderTarget[] = [];
  let upTargets: THREE.WebGLRenderTarget[] = [];
  let grids: Grid[] = [];
  let gridKey = '';
  let atlas: ReturnType<typeof buildAtlas> | null = null;
  let atlasKey = '';

  let destroyed = false;
  let raf = 0;
  let last = 0;
  let visible = true;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let grain = 0;
  let seedState = 97;
  const random = () => {
    seedState = (seedState * 16807) % 2147483647;
    return seedState / 2147483647;
  };

  const release = () => {
    lineTarget?.dispose();
    for (const item of downTargets) item.dispose();
    for (const item of upTargets) item.dispose();
    lineTarget = null;
    downTargets = [];
    upTargets = [];
  };

  const releaseGrids = () => {
    for (const grid of grids) {
      for (const item of grid.targets) item.dispose();
      grid.headTexture.dispose();
    }
    grids = [];
  };

  const draw = (material: THREE.ShaderMaterial, output: THREE.WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(output);
    renderer.render(quadScene, camera);
  };

  const ensureAtlas = () => {
    const settings = settingsRef.current;
    const glyphs = String(settings.glyphs ?? '') || DEFAULT_GLYPHS;
    const font = String(settings.fontFamily ?? '') || DEFAULT_FONT;
    const cell = Math.round(clamp(clamp(settings.glyphSize, 6, 64) * pixelRatio * 1.25, 16, 128));
    const key = `${glyphs}|${font}|${cell}`;
    if (key === atlasKey && atlas) return;
    atlasKey = key;
    atlas?.texture.dispose();
    atlas = buildAtlas(glyphs, font, cell);
    rainMaterial.uniforms.uAtlas.value = atlas.texture;
    rainMaterial.uniforms.uAtlasGrid.value.set(ATLAS_COLUMNS, atlas.rows);
    stateMaterial.uniforms.uGlyphCount.value = atlas.count;
  };

  const rateAt = (x: number, y: number) => {
    const gapX = x - hover.x;
    const gapY = y - hover.y;
    const radius = fieldUniforms.uHover.value.w;
    const slow = clamp(settingsRef.current.slowStrength, 0, 1) * hover.amount * Math.exp(-(gapX * gapX + gapY * gapY) / (radius * radius));
    return Math.max(1 - slow, 0.02);
  };

  const idleTime = (travel: number, k: number) => {
    const duty = clamp(settingsRef.current.density, 0.02, 1) * (k === 0 ? 1 : 0.3);
    return travel * (1 / duty - 1) * (0.4 + 1.2 * random());
  };

  const buildGrid = (scale: number, speedScale: number, gain: number, bias: number): Grid => {
    const settings = settingsRef.current;
    const w = width * pixelRatio;
    const h = height * pixelRatio;
    const size = clamp(settings.glyphSize, 6, 64) * pixelRatio * scale;
    const cellW = size * 0.68 * clamp(settings.spacing, 0.6, 3);
    const cellH = size * 1.05;
    const angle = (clamp(settings.angle, -80, 80) * Math.PI) / 180;
    const boxW = w * Math.abs(Math.cos(angle)) + h * Math.abs(Math.sin(angle));
    const boxH = w * Math.abs(Math.sin(angle)) + h * Math.abs(Math.cos(angle));
    const cols = Math.ceil(boxW / cellW) + 2;
    const rows = Math.ceil(boxH / cellH) + 2;
    const originX = w / 2 - (cols * cellW) / 2;
    const originY = h / 2 - (rows * cellH) / 2;
    const columnSpeed = new Float32Array(cols);
    const heads = new Float32Array(cols * (HEADS + 1) * 4);
    const respawn = new Float32Array(cols * HEADS);
    const variance = clamp(settings.variance, 0, 1);
    const base = Math.max(9 * clamp(settings.speed, 0, 5) * speedScale, 0.5);
    for (let c = 0; c < cols; c++) {
      columnSpeed[c] = Math.max(0.3, 1 + (random() * 2 - 1) * variance * 0.75);
      const speed = base * columnSpeed[c];
      const travel = (rows + 3) / speed;
      for (let k = 0; k < HEADS; k++) {
        const at = (c * (HEADS + 1) + k + 1) * 4;
        if (k === BURST) {
          heads.set([0, 0, 0, random()], at);
          respawn[c * HEADS + k] = Infinity;
          continue;
        }
        const wait = idleTime(travel, k);
        const moment = random() * (travel + wait);
        if (moment < travel) {
          const y = -2 + moment * speed;
          heads.set([y, y, 1.5, random()], at);
        } else {
          heads.set([0, 0, 0, random()], at);
          respawn[c * HEADS + k] = moment - travel;
        }
      }
    }
    const headTexture = new THREE.DataTexture(heads, HEADS + 1, cols, THREE.RGBAFormat, THREE.FloatType);
    headTexture.minFilter = THREE.NearestFilter;
    headTexture.magFilter = THREE.NearestFilter;
    headTexture.needsUpdate = true;
    const targets = [0, 1].map(() => target(cols, rows, stateType, THREE.NearestFilter));
    for (const item of targets) {
      renderer.setRenderTarget(item);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
    }
    return {
      cellW,
      cellH,
      cols,
      rows,
      originX,
      originY,
      speedScale,
      gain,
      bias,
      columnSpeed,
      heads,
      respawn,
      headTexture,
      targets,
      index: 0,
    };
  };

  const toScreen = (grid: Grid, gx: number, gy: number) => {
    const angle = gridUniforms.uAngle.value;
    const cx = (width * pixelRatio) / 2;
    const cy = (height * pixelRatio) / 2;
    const rx = grid.originX + gx * grid.cellW - cx;
    const ry = grid.originY + gy * grid.cellH - cy;
    const c = Math.cos(angle);
    const n = Math.sin(angle);
    return [c * rx - n * ry + cx, n * rx + c * ry + cy];
  };

  const advanceHeads = (grid: Grid, dt: number) => {
    const settings = settingsRef.current;
    const base = 9 * clamp(settings.speed, 0, 5) * grid.speedScale;
    for (let c = 0; c < grid.cols; c++) {
      const speed = base * grid.columnSpeed[c];
      grid.heads[c * (HEADS + 1) * 4] = speed;
      for (let k = 0; k < HEADS; k++) {
        const at = (c * (HEADS + 1) + k + 1) * 4;
        const slot = c * HEADS + k;
        if (grid.heads[at + 2] > 0.5) {
          if (grid.heads[at + 2] < 1.5) grid.heads[at + 2] = Math.min(1.5, grid.heads[at + 2] + dt / 0.3);
          const y = grid.heads[at + 1];
          const [sx, sy] = toScreen(grid, c + 0.5, y);
          grid.heads[at] = y;
          grid.heads[at + 1] = y + speed * rateAt(sx, sy) * dt;
          if (grid.heads[at + 1] > grid.rows + 1) {
            grid.heads[at + 2] = 0;
            grid.respawn[slot] = k === BURST ? Infinity : idleTime((grid.rows + 3) / Math.max(speed, 0.5), k);
          }
        } else if (grid.respawn[slot] !== Infinity) {
          grid.respawn[slot] -= dt;
          if (grid.respawn[slot] <= 0) {
            const start = k === BURST ? grid.heads[at + 1] : -2 - random() * 2;
            grid.heads.set([start, start, k === BURST ? 0.52 : 1.5, random()], at);
          }
        }
      }
    }
    grid.headTexture.needsUpdate = true;
  };

  const stepGrid = (grid: Grid, dt: number) => {
    const settings = settingsRef.current;
    const {uniforms} = stateMaterial;
    uniforms.uPrevious.value = grid.targets[grid.index].texture;
    uniforms.uHeads.value = grid.headTexture;
    uniforms.uOrigin.value.set(grid.originX, grid.originY);
    uniforms.uCell.value.set(grid.cellW, grid.cellH);
    uniforms.uDt.value = dt;
    uniforms.uTrail.value = clamp(settings.trail, 2, 80);
    uniforms.uShuffle.value = clamp(settings.shuffle, 0, 1);
    uniforms.uSeed.value = random() * 1000;
    draw(stateMaterial, grid.targets[1 - grid.index]);
    grid.index = 1 - grid.index;
  };

  const ensureGrids = () => {
    const settings = settingsRef.current;
    const depth = clamp(settings.depth, 0, 1);
    const key = [width, height, pixelRatio, settings.glyphSize, settings.spacing, settings.angle, depth > 0, settings.variance].join('|');
    if (key === gridKey && grids.length > 0) return;
    gridKey = key;
    releaseGrids();
    gridUniforms.uAngle.value = (clamp(settings.angle, -80, 80) * Math.PI) / 180;
    gridUniforms.uCenter.value.set((width * pixelRatio) / 2, (height * pixelRatio) / 2);
    grids = [buildGrid(1, 1, 1, 0)];
    if (depth > 0) grids.push(buildGrid(0.62, 0.58, 1, 1.2));
    const warm = 3;
    const step = 1 / 30;
    for (let t = 0; t < warm; t += step) {
      for (const grid of grids) {
        advanceHeads(grid, step);
        stepGrid(grid, step);
      }
    }
  };

  const apply = () => {
    const settings = settingsRef.current;
    const w = width * pixelRatio;
    const h = height * pixelRatio;
    const background = parseColor(settings.backgroundColor, [0.04, 0.04, 0.04]);
    const luminance = 0.2126 * background[0] + 0.7152 * background[1] + 0.0722 * background[2];
    const ink = settings.mode === 'ink' || (settings.mode === 'auto' && luminance > 0.5);
    const labTrail = toOklab(parseColor(settings.colors[0], [0.6, 0.48, 1]));
    const labHead = toOklab(parseColor(settings.colors[1], [1, 0.84, 0.96]));
    const {uniforms} = rainMaterial;
    uniforms.uResolution.value.set(w, h);
    uniforms.uMirror.value = settings.mirror ? 1 : 0;
    uniforms.uLabTrail.value.set(labTrail[0], labTrail[1], labTrail[2]);
    uniforms.uLabHead.value.set(labHead[0], labHead[1], labHead[2]);
    uniforms.uInk.value = ink ? 1 : 0;
    const near = grids[0];
    if (near) {
      uniforms.uState0.value = near.targets[near.index].texture;
      uniforms.uHeads0.value = near.headTexture;
      uniforms.uOrigin0.value.set(near.originX, near.originY);
      uniforms.uGrid0.value.set(near.cellW, near.cellH, near.cols, near.rows);
    }
    const far = grids[1];
    uniforms.uFar.value = far ? 0.32 * clamp(settings.depth, 0, 1) : 0;
    if (far) {
      uniforms.uState1.value = far.targets[far.index].texture;
      uniforms.uHeads1.value = far.headTexture;
      uniforms.uOrigin1.value.set(far.originX, far.originY);
      uniforms.uGrid1.value.set(far.cellW, far.cellH, far.cols, far.rows);
    }
    fieldUniforms.uSlow.value = clamp(settings.slowStrength, 0, 1);
    fieldUniforms.uHover.value.set(hover.x, hover.y, hover.amount, clamp(settings.slowRadius, 20, 800) * pixelRatio);
    const composite = compositeMaterial.uniforms;
    composite.uBackground.value.set(toLinear(background[0]), toLinear(background[1]), toLinear(background[2]));
    composite.uGlow.value = clamp(settings.glow, 0, 3);
    composite.uExposure.value = (ink ? 5 : 1.25) * clamp(settings.intensity, 0, 4);
    composite.uMode.value = ink ? 1 : 0;
    composite.uGrain.value = grain;
  };

  const render = () => {
    if (!lineTarget || downTargets.length === 0) return;
    ensureAtlas();
    ensureGrids();
    apply();
    draw(rainMaterial, lineTarget);
    let source = lineTarget;
    for (const item of downTargets) {
      downMaterial.uniforms.uSource.value = source.texture;
      downMaterial.uniforms.uTexel.value.set(1 / source.width, 1 / source.height);
      draw(downMaterial, item);
      source = item;
    }
    let accumulated = downTargets[downTargets.length - 1];
    for (let k = downTargets.length - 2; k >= 0; k--) {
      upMaterial.uniforms.uSource.value = accumulated.texture;
      upMaterial.uniforms.uBase.value = downTargets[k].texture;
      upMaterial.uniforms.uTexel.value.set(1 / accumulated.width, 1 / accumulated.height);
      draw(upMaterial, upTargets[k]);
      accumulated = upTargets[k];
    }
    compositeMaterial.uniforms.uLines.value = lineTarget.texture;
    compositeMaterial.uniforms.uBloom.value = accumulated.texture;
    draw(compositeMaterial, null);
  };

  const step = (dt: number) => {
    const settings = settingsRef.current;
    const goal = hover.inside && settings.interactive && settings.bulletTime && !settings.reduced ? 1 : 0;
    hover.amount += (goal - hover.amount) * (1 - Math.exp(-dt / 0.35));
    const omega = 9;
    hover.vx += (omega * omega * (hover.goalX - hover.x) - 2 * omega * hover.vx) * dt;
    hover.vy += (omega * omega * (hover.goalY - hover.y) - 2 * omega * hover.vy) * dt;
    hover.x += hover.vx * dt;
    hover.y += hover.vy * dt;
    if (settings.paused || settings.reduced) return;
    ensureAtlas();
    ensureGrids();
    apply();
    for (const grid of grids) {
      advanceHeads(grid, dt);
      stepGrid(grid, dt);
    }
    grain = (grain + 0.618034) % 1;
  };

  const tick = (now: number) => {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    step(dt);
    render();
    const settings = settingsRef.current;
    const animating = !settings.paused && !settings.reduced;
    const settling = Math.abs(hover.amount - (hover.inside && settings.bulletTime ? 1 : 0)) > 0.002;
    if (visible && !document.hidden && (animating || settling)) raf = requestAnimationFrame(tick);
  };

  function wake() {
    if (destroyed || raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  const resize = () => {
    const rect = root.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * clamp(settingsRef.current.quality, 0.25, 1);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const w = Math.round(width * pixelRatio);
    const h = Math.round(height * pixelRatio);
    release();
    lineTarget = target(w, h, texelType, THREE.LinearFilter);
    const levels = clamp(Math.floor(Math.log2(Math.min(w, h) / 8)), 3, 7);
    for (let k = 1; k <= levels; k++) {
      downTargets.push(target(w >> k, h >> k, texelType, THREE.LinearFilter));
      upTargets.push(target(w >> k, h >> k, texelType, THREE.LinearFilter));
    }
    render();
    wake();
  };

  const locate = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    return [(event.clientX - rect.left) * pixelRatio, (event.clientY - rect.top) * pixelRatio] as const;
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !settingsRef.current.interactive) return;
    const [x, y] = locate(event);
    hover.goalX = x;
    hover.goalY = y;
    if (!hover.placed) {
      hover.x = x;
      hover.y = y;
      hover.placed = true;
    }
    if (!hover.inside) {
      hover.inside = true;
      wake();
    }
  };

  const onLeave = () => {
    hover.inside = false;
    hover.placed = hover.amount > 0.01;
    wake();
  };

  const toGrid = (grid: Grid, x: number, y: number) => {
    const angle = gridUniforms.uAngle.value;
    const cx = (width * pixelRatio) / 2;
    const cy = (height * pixelRatio) / 2;
    const dx = x - cx;
    const dy = y - cy;
    const c = Math.cos(angle);
    const n = Math.sin(angle);
    return [(c * dx + n * dy + cx - grid.originX) / grid.cellW, (-n * dx + c * dy + cy - grid.originY) / grid.cellH];
  };

  const burst = (x: number, y: number) => {
    const settings = settingsRef.current;
    if (settings.reduced || settings.paused) return;
    const reach = clamp(settings.burstSize, 0, 3);
    if (reach <= 0) return;
    for (const [layer, grid] of grids.entries()) {
      const [gx, gy] = toGrid(grid, x, y);
      const spread = Math.max(1, Math.round((layer === 0 ? 6 : 8) * reach));
      const center = Math.floor(gx);
      for (let c = center - spread; c <= center + spread; c++) {
        if (c < 0 || c >= grid.cols) continue;
        const offset = Math.abs(c - center) / spread;
        if (random() > Math.exp(-offset * offset * 2.2) * (layer === 0 ? 0.95 : 0.6)) continue;
        const at = (c * (HEADS + 1) + BURST + 1) * 4;
        const slot = c * HEADS + BURST;
        if (grid.heads[at + 2] > 0.5) continue;
        const start = gy - 0.5 - random() * 1.5;
        grid.heads.set([start, start, 0, random()], at);
        grid.respawn[slot] = offset * spread * 0.045 + random() * 0.06;
      }
    }
    wake();
  };

  const onDown = (event: PointerEvent) => {
    const settings = settingsRef.current;
    if (event.button !== 0 || !settings.interactive || !settings.clickBurst) return;
    const [x, y] = locate(event);
    burst(x, y);
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointercancel', onLeave);
  root.addEventListener('pointerdown', onDown);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) wake();
    },
    { rootMargin: '80px' },
  );
  intersection.observe(root);
  const onVisibility = () => {
    if (!document.hidden) wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const onLost = (event: Event) => event.preventDefault();
  canvas.addEventListener('webglcontextlost', onLost);
  resize();

  return {
    sync: () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2) * clamp(settingsRef.current.quality, 0.25, 1);
      if (Math.abs(ratio - pixelRatio) > 1e-3) resize();
      else render();
      wake();
    },
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointercancel', onLeave);
      root.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      resizeObserver.disconnect();
      intersection.disconnect();
      release();
      releaseGrids();
      atlas?.texture.dispose();
      plane.dispose();
      for (const item of [stateMaterial, rainMaterial, downMaterial, upMaterial, compositeMaterial]) item.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
    burst: (x: number, y: number) => burst(clamp(x, 0, 1) * width * pixelRatio, clamp(y, 0, 1) * height * pixelRatio),
  };
};

const TerminalRain = forwardRef<TerminalRainHandle, TerminalRainProps>(function TerminalRain(
  {
    colors = ['#9D7BFF', '#FFD6F5'],
    backgroundColor = '#0A0A0A',
    mode = 'auto',
    glyphs = DEFAULT_GLYPHS,
    fontFamily = DEFAULT_FONT,
    glyphSize = 18,
    spacing = 1,
    density = 0.45,
    trail = 16,
    speed = 1,
    variance = 0.5,
    angle = 0,
    shuffle = 0.35,
    mirror = false,
    depth = 0.6,
    glow = 0.22,
    intensity = 1,
    interactive = true,
    bulletTime = true,
    slowRadius = 170,
    slowStrength = 0.6,
    clickBurst = true,
    burstSize = 1,
    paused = false,
    quality = 1,
    className,
    style,
    children,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);
  const settingsRef = useRef<Settings>({
    colors,
    backgroundColor,
    mode,
    glyphs,
    fontFamily,
    glyphSize,
    spacing,
    density,
    trail,
    speed,
    variance,
    angle,
    shuffle,
    mirror,
    depth,
    glow,
    intensity,
    interactive,
    bulletTime,
    slowRadius,
    slowStrength,
    clickBurst,
    burstSize,
    paused,
    quality,
    reduced,
  });

  useEffect(() => {
    settingsRef.current = {
      colors,
      backgroundColor,
      mode,
      glyphs,
      fontFamily,
      glyphSize,
      spacing,
      density,
      trail,
      speed,
      variance,
      angle,
      shuffle,
      mirror,
      depth,
      glow,
      intensity,
      interactive,
      bulletTime,
      slowRadius,
      slowStrength,
      clickBurst,
      burstSize,
      paused,
      quality,
      reduced,
    };
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const controller = createRain(root, settingsRef);
    controllerRef.current = controller;
    return () => {
      controller?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      burst: (x = 0.5, y = 0.3) => controllerRef.current?.burst(x, y),
    }),
    [],
  );

  return (
    <div
      ref={ rootRef }
      className={ cn('relative isolate h-full min-h-[240px] w-full overflow-hidden', className) }
      style={ { backgroundColor, ...style } }
    >
      { children ? <div className="relative z-10 h-full w-full">{ children }</div> : null }
    </div>
  );
});

TerminalRain.displayName = 'TerminalRain';

export { TerminalRain };
export default TerminalRain;

