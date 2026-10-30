'use client';

import * as THREE from 'three';
import { useRef, useEffect, forwardRef, type ReactNode, type CSSProperties, useImperativeHandle, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

export interface HorizonBloomHandle {
  bloom: (x?: number, strength?: number) => void;
  replay: () => void;
}

export interface HorizonBloomProps {
  colors?: [string, string];
  backgroundColor?: string;
  horizon?: number;
  curvature?: number;
  tilt?: number;
  sunPosition?: number;
  sunrise?: number;
  spread?: number;
  atmosphere?: number;
  thickness?: number;
  rim?: number;
  flare?: number;
  airglow?: number;
  clouds?: number;
  stars?: number;
  aurora?: number;
  autoAurora?: boolean;
  speed?: number;
  drift?: number;
  parallax?: number;
  bloom?: number;
  grain?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface Settings {
  colors: [string, string];
  horizon: number;
  curvature: number;
  tilt: number;
  sunPosition: number;
  sunrise: number;
  spread: number;
  atmosphere: number;
  thickness: number;
  rim: number;
  flare: number;
  airglow: number;
  clouds: number;
  stars: number;
  aurora: number;
  autoAurora: boolean;
  speed: number;
  drift: number;
  parallax: number;
  bloom: number;
  grain: number;
  interactive: boolean;
  intro: boolean;
  paused: boolean;
  dpr: number;
  reduced: boolean;
}

interface Controller {
  sync: () => void;
  bloom: (x?: number, strength?: number) => void;
  replay: () => void;
  destroy: () => void;
}

interface Aurora {
  arc: number;
  born: number;
  strength: number;
  seed: number;
  dying: number;
}

const MAX_AURORAS = 8;
const LIVE_AURORAS = 5;
const AURORA_LIFE = 6.7;
const AURORA_FADE = 0.7;
const BASE_RADIUS = 2.4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const finite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);

let colorProbe: CanvasRenderingContext2D | null = null;

const parseColor = (value: string): [number, number, number] | null => {
  colorProbe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!colorProbe) return null;
  colorProbe.clearRect(0, 0, 1, 1);
  // Canvas ignores values it can't parse, so anything invalid draws transparent and returns null.
  colorProbe.fillStyle = 'transparent';
  colorProbe.fillStyle = value.trim();
  colorProbe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorProbe.getImageData(0, 0, 1, 1).data;
  return a / 255 > 0.05 ? [r / 255, g / 255, b / 255] : null;
};

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toGamma = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

const toOklab = ([r, g, b]: [number, number, number]) => {
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

const fromOklab = ([L, A, B]: number[]): [number, number, number] => {
  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return [
    clamp(toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), 0, 1),
    clamp(toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), 0, 1),
    clamp(toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s), 0, 1),
  ];
};

const mixLab = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const subscribeToMotion = (notify: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};

const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const passVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const sceneFragment = `
uniform vec2 uRes;
uniform float uTime;
uniform float uRoll;
uniform float uApex;
uniform float uRadius;
uniform float uSunArc;
uniform float uSpread;
uniform float uSunUp;
uniform float uAtmo;
uniform float uThick;
uniform float uRimGain;
uniform float uFlare;
uniform float uAirglow;
uniform float uClouds;
uniform float uStars;
uniform float uAuroraGain;
uniform vec4 uAuroras[${MAX_AURORAS}];
uniform float uInk;
uniform vec3 uRimColor;
uniform vec3 uInner;
uniform vec3 uMid;
uniform vec3 uOuter;
uniform vec3 uGlowColor;
uniform vec3 uSunColor;
uniform vec3 uStarColor;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 starField(vec2 p) {
  vec3 c = vec3(0.0);
  for (int k = 0; k < 2; k++) {
    float scale = k == 0 ? 70.0 : 130.0;
    vec2 g = p * scale + float(k) * 17.3;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(id);
    vec2 offset = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float twinkle = 0.6 + 0.4 * sin(uTime * (1.0 + 3.0 * hash(id + 1.3)) + h * 50.0);
    float b = pow(h, 30.0) * twinkle;
    float d = length(f - offset * 0.7);
    c += uStarColor * b * exp(-d * d * 300.0) * (k == 0 ? 0.9 : 0.45);
  }
  return c;
}

void main() {
  vec2 frag = vUv * uRes;
  vec2 screen = (frag - 0.5 * uRes) / uRes.y;
  float cr = cos(uRoll);
  float sr = sin(uRoll);
  vec2 p = mat2(cr, -sr, sr, cr) * screen;
  float px = 1.0 / uRes.y;
  vec2 center = vec2(0.0, uApex - uRadius);
  vec2 q = p - center;
  float h = length(q) - uRadius;
  float arc = atan(q.x, q.y) * uRadius;
  float d = arc - uSunArc;
  float lit = exp(-d * d / (2.0 * uSpread * uSpread));
  float wide = exp(-d * d / (10.0 * uSpread * uSpread));
  float hot = exp(-d * d / (2.0 * 0.034 * 0.034));
  float halo = exp(-d * d / (2.0 * 0.17 * 0.17));
  float thick = uThick;
  float sunk = 1.0 - 0.8 * uInk;
  vec3 col = vec3(0.0);
  if (h > 0.0) {
    float rim = exp(-h / max(0.0012, px * 0.9));
    float inner = exp(-h / (0.007 * thick));
    float mid = exp(-h / (0.024 * thick));
    float outer = exp(-h / (0.07 * thick));
    col += lit * (rim * uRimColor * 2.2 * uRimGain + inner * uInner * 0.7 * uAtmo);
    col += wide * (mid * uMid * 0.2 + outer * uOuter * 0.055) * uAtmo;
    float layer = h - 0.042 * thick;
    float band = exp(-layer * layer / (0.00005 * thick * thick));
    if (uAirglow > 0.0 && band > 0.0001) {
      band *= 0.35 + 0.65 * fbm(vec2(arc * 9.0 - uTime * 0.04, uTime * 0.02));
      col += band * uGlowColor * 0.05 * (0.2 + 0.8 * wide) * uAirglow;
    }
    col += sunk * hot * uSunUp * (exp(-h / 0.003) * uSunColor * 4.0 + exp(-h / (0.016 * thick)) * uInner * 0.7);
    col += halo * uSunUp * (exp(-h / (0.045 * thick)) * uInner * 0.2 + exp(-h / (0.12 * thick)) * uMid * 0.06) * uAtmo;
    if (uStars > 0.0 && uInk < 0.5) col += starField(p) * smoothstep(0.04, 0.2, h) * (1.0 - 0.8 * wide) * uStars;
  } else {
    col += lit * exp(h / max(0.0008, px * 0.6)) * uRimColor * 1.1 * uRimGain;
    col += sunk * hot * uSunUp * exp(h / 0.005) * uMid * 0.3;
    if (uClouds > 0.0 && h > -0.12) {
      float tops = fbm(vec2(arc * 22.0 + uTime * 0.01, h * 160.0 + arc * 6.0));
      float catchLight = smoothstep(0.52, 0.78, tops) * exp(h / 0.018) * smoothstep(-0.12, -0.07, h) * lit;
      col += catchLight * mix(uMid, uInner, halo) * 0.14 * uClouds * uSunUp;
    }
  }
  vec2 sun = center + uRadius * vec2(sin(uSunArc / uRadius), cos(uSunArc / uRadius));
  float rs = length(p - sun);
  float crest = smoothstep(-0.0015, 0.0015, h);
  col += uSunUp * uSunUp * uFlare * sunk * (exp(-rs / 0.005) * uSunColor * 2.0 * crest + exp(-rs / 0.05) * uInner * 0.07);
  if (h > 0.0 && h < 0.42) {
    for (int i = 0; i < ${MAX_AURORAS}; i++) {
      vec4 aurora = uAuroras[i];
      if (aurora.z <= 0.0) continue;
      float age = aurora.y;
      float width = 0.09 + 0.12 * smoothstep(0.0, 2.5, age);
      float dc = arc - aurora.x;
      if (abs(dc) > width * 3.0) continue;
      float span = max(exp(-dc * dc / (2.0 * width * width)) - 0.0111, 0.0) / 0.9889;
      float envelope = smoothstep(0.0, 1.4, age) * (1.0 - smoothstep(2.6, 6.6, age)) * aurora.z;
      float drift = uTime * 0.03 + aurora.w;
      float fine = noise(vec2(arc * 140.0 + drift * 5.0, aurora.w + age * 0.15));
      float fold = noise(vec2(arc * 30.0 - drift * 2.0, aurora.w + 4.0));
      float rays = (0.2 + 0.8 * fine * fine) * (0.45 + 0.55 * fold);
      float reach = (0.04 + 0.08 * noise(vec2(arc * 46.0 + aurora.w * 3.0, drift * 0.5))) * (0.5 + 0.5 * smoothstep(0.0, 2.2, age));
      float base = 0.007 + 0.004 * fold;
      float lower = smoothstep(base * 0.4, base + 0.006, h);
      float y = max(h - base, 0.0);
      float body = exp(-y / reach) * (1.0 - smoothstep(0.12, 0.38, h));
      float glow = exp(-y / 0.02) * 0.2;
      vec3 tint = mix(uInner, uMid, smoothstep(0.0, 0.05, y));
      tint = mix(tint, uOuter, smoothstep(0.05, 0.16, y));
      col += span * lower * (body * rays + glow * (0.5 + 0.5 * fold)) * envelope * tint * 0.9 * uAuroraGain;
    }
  }
  if (uInk > 0.5) {
    float peak = max(col.r, max(col.g, col.b));
    float alpha = 1.0 - exp(-peak * 1.5);
    gl_FragColor = vec4(col / max(peak, 0.0001) * alpha, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

const downFragment = `
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uThreshold;
varying vec2 vUv;
vec3 tap(vec2 d) {
  vec3 c = texture2D(uSource, vUv + d * uTexel).rgb;
  float peak = max(c.r, max(c.g, c.b));
  return c * (max(peak - uThreshold, 0.0) / max(peak, 0.0001));
}
void main() {
  vec3 a = tap(vec2(-2.0, 2.0));
  vec3 b = tap(vec2(0.0, 2.0));
  vec3 c = tap(vec2(2.0, 2.0));
  vec3 d = tap(vec2(-2.0, 0.0));
  vec3 e = tap(vec2(0.0, 0.0));
  vec3 f = tap(vec2(2.0, 0.0));
  vec3 g = tap(vec2(-2.0, -2.0));
  vec3 h = tap(vec2(0.0, -2.0));
  vec3 i = tap(vec2(2.0, -2.0));
  vec3 j = tap(vec2(-1.0, 1.0));
  vec3 k = tap(vec2(1.0, 1.0));
  vec3 l = tap(vec2(-1.0, -1.0));
  vec3 m = tap(vec2(1.0, -1.0));
  vec3 color = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(color, 1.0);
}
`;

const upFragment = `
uniform sampler2D uSource;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 tap(vec2 d) { return texture2D(uSource, vUv + d * uTexel).rgb; }
void main() {
  vec3 color = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  gl_FragColor = vec4(color / 16.0, 1.0);
}
`;

const compositeFragment = `
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform vec2 uResolution;
uniform float uBloomStrength;
uniform float uGrain;
uniform float uTime;
uniform float uInk;
varying vec2 vUv;

vec3 neutral(vec3 color) {
  const float start = 0.76;
  const float desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < start) return color;
  const float d = 1.0 - start;
  float next = 1.0 - d * d / (peak + d - start);
  color *= next / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - next) + 1.0);
  return mix(color, vec3(next), g);
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float n = hash(gl_FragCoord.xy + fract(uTime * 13.0) * 911.0) - 0.5;
  if (uInk > 0.5) {
    vec4 scene = texture2D(uScene, vUv);
    float cover = clamp(scene.a, 0.0, 1.0);
    vec3 ink = scene.rgb / max(scene.a, 0.0001);
    vec3 color = mix(uBackground, ink, cover);
    color += n * uGrain * 0.05 * smoothstep(0.0, 0.05, cover);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    return;
  }
  vec2 c = vUv - 0.5;
  vec2 shift = c * 1.2 / uResolution.y;
  vec3 emission;
  emission.r = texture2D(uScene, vUv + shift).r;
  emission.g = texture2D(uScene, vUv).g;
  emission.b = texture2D(uScene, vUv - shift).b;
  emission += texture2D(uBloom, vUv).rgb * uBloomStrength;
  vec3 light = neutral(max(emission, 0.0));
  light = pow(light, vec3(1.0 / 2.2));
  vec3 color = 1.0 - (1.0 - uBackground) * (1.0 - light);
  float l = max(light.r, max(light.g, light.b));
  float mask = smoothstep(0.0, 0.04, l);
  color += n * uGrain * 0.1 * mask;
  color += (hash(gl_FragCoord.xy * 1.7) - 0.5) / 255.0 * mask;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function createHorizon(root: HTMLDivElement, stage: HTMLDivElement, settingsRef: { current: Settings }): Controller | null {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const canvas = doc.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }
  stage.appendChild(canvas);
  renderer.autoClear = false;

  const settings = () => settingsRef.current;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(quadGeometry);
  quad.frustumCulled = false;
  quadScene.add(quad);

  const colorUniform = () => ({ value: new THREE.Vector3(1, 1, 1) });
  const auroraSlots = Array.from({ length: MAX_AURORAS }, () => new THREE.Vector4(0, 0, 0, 0));
  const sceneMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uRoll: { value: 0 },
      uApex: { value: -0.22 },
      uRadius: { value: BASE_RADIUS },
      uSunArc: { value: 0.2 },
      uSpread: { value: 0.6 },
      uSunUp: { value: 1 },
      uAtmo: { value: 1 },
      uThick: { value: 1 },
      uRimGain: { value: 1 },
      uFlare: { value: 1 },
      uAirglow: { value: 0.5 },
      uClouds: { value: 0.5 },
      uStars: { value: 0.5 },
      uAuroraGain: { value: 1 },
      uAuroras: { value: auroraSlots },
      uInk: { value: 0 },
      uRimColor: colorUniform(),
      uInner: colorUniform(),
      uMid: colorUniform(),
      uOuter: colorUniform(),
      uGlowColor: colorUniform(),
      uSunColor: colorUniform(),
      uStarColor: colorUniform(),
    },
    vertexShader: passVertex,
    fragmentShader: sceneFragment,
    depthTest: false,
    depthWrite: false,
  });

  const target = () =>
    new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
    });
  const sceneTarget = target();
  const bloomTargets = Array.from({ length: 5 }, target);
  const background = new THREE.Vector3(0.04, 0.04, 0.04);
  const downMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uSource: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uThreshold: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: downFragment,
    depthTest: false,
    depthWrite: false,
  });
  const upMaterial = new THREE.ShaderMaterial({
    uniforms: { uSource: { value: null }, uTexel: { value: new THREE.Vector2() } },
    vertexShader: passVertex,
    fragmentShader: upFragment,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const compositeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: sceneTarget.texture },
      uBloom: { value: bloomTargets[0].texture },
      uBackground: { value: background },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBloomStrength: { value: 0.5 },
      uGrain: { value: 0.25 },
      uTime: { value: 0 },
      uInk: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: compositeFragment,
    depthTest: false,
    depthWrite: false,
  });

  let width = 0;
  let height = 0;
  let dpr = 1;
  let sized = false;
  let colorKey = '';
  let ink = false;
  let page: [number, number, number] = [0.04, 0.04, 0.04];
  let backgroundAt = -10;
  let time = 0;
  let clock = 0;
  let introStart = -1;
  let rise = 1;
  let roll = 0;
  let lift = 0;
  let rollTarget = 0;
  let liftTarget = 0;
  let nextAuto = 4;
  let seed = 11;
  let raf = 0;
  let last = 0;
  let visible = false;
  let destroyed = false;
  let lost = false;
  const auroras: Aurora[] = [];

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const readPage = (): [number, number, number] => {
    for (let node: HTMLElement | null = root; node; node = node.parentElement) {
      const fill = parseColor(view.getComputedStyle(node).backgroundColor);
      if (fill) return fill;
    }
    const text = parseColor(view.getComputedStyle(root).color);
    if (text) return text[0] + text[1] + text[2] > 1.5 ? [0.04, 0.04, 0.04] : [1, 1, 1];
    return [0.04, 0.04, 0.04];
  };

  const setColor = (name: string, rgb: [number, number, number]) => {
    const value = sceneMaterial.uniforms[name].value as THREE.Vector3;
    if (ink) value.set(rgb[0], rgb[1], rgb[2]);
    else value.set(toLinear(rgb[0]), toLinear(rgb[1]), toLinear(rgb[2]));
  };

  const syncColors = () => {
    const s = settings();
    page = readPage();
    const key = [page.join(','), s.colors[0], s.colors[1]].join('|');
    if (key === colorKey) return;
    colorKey = key;
    ink = 0.2126 * page[0] + 0.7152 * page[1] + 0.0722 * page[2] > 0.55;
    background.set(page[0], page[1], page[2]);
    const warm = toOklab(parseColor(s.colors[0]) ?? [1, 0.62, 0.99]);
    const cool = toOklab(parseColor(s.colors[1]) ?? [0.32, 0.15, 1]);
    const chromaOf = (lab: number[]) => Math.hypot(lab[1], lab[2]);
    const inkOf = (lab: number[], lightness: number) => {
      const chroma = chromaOf(lab);
      if (chroma < 0.02) return [lightness * 0.8, 0, 0];
      const scale = Math.max(1, 0.15 / chroma);
      return [lightness, lab[1] * scale, lab[2] * scale];
    };
    const mid = mixLab(warm, cool, 0.55);
    const glow = mixLab(warm, cool, 0.35);
    const lighten = (lab: number[], lightness: number, keep: number) => [Math.max(lab[0], lightness), lab[1] * keep, lab[2] * keep];
    if (ink) {
      setColor('uRimColor', fromOklab(inkOf(mixLab(warm, cool, 0.7), 0.42)));
      setColor('uInner', fromOklab(inkOf(warm, 0.62)));
      setColor('uMid', fromOklab(inkOf(mid, 0.55)));
      setColor('uOuter', fromOklab(inkOf(cool, 0.5)));
      setColor('uGlowColor', fromOklab(inkOf(glow, 0.58)));
      setColor('uSunColor', fromOklab(inkOf(mixLab(warm, cool, 0.5), 0.48)));
      setColor('uStarColor', fromOklab(inkOf(cool, 0.5)));
    } else {
      setColor('uRimColor', fromOklab(lighten(warm, 0.96, 0.22)));
      setColor('uInner', fromOklab(warm));
      setColor('uMid', fromOklab(mid));
      setColor('uOuter', fromOklab(cool));
      setColor('uGlowColor', fromOklab(lighten(glow, 0.78, 0.7)));
      setColor('uSunColor', fromOklab(lighten(warm, 0.98, 0.12)));
      setColor('uStarColor', fromOklab(lighten(cool, 0.93, 0.15)));
    }
    sceneMaterial.uniforms.uInk.value = ink ? 1 : 0;
    compositeMaterial.uniforms.uInk.value = ink ? 1 : 0;
  };

  const readSize = () => {
    const s = settings();
    const nextWidth = Math.round(root.clientWidth);
    const nextHeight = Math.round(root.clientHeight);
    if (nextWidth < 2 || nextHeight < 2) {
      sized = false;
      return false;
    }
    const nextDpr = Math.min(view.devicePixelRatio || 1, clamp(finite(s.dpr, 2), 0.5, 3));
    if (sized && nextWidth === width && nextHeight === height && nextDpr === dpr) return false;
    sized = true;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    const deviceW = Math.round(width * dpr);
    const deviceH = Math.round(height * dpr);
    sceneTarget.setSize(deviceW, deviceH);
    let w = deviceW;
    let h = deviceH;
    for (const bloomTarget of bloomTargets) {
      w = Math.max(1, Math.round(w / 2));
      h = Math.max(1, Math.round(h / 2));
      bloomTarget.setSize(w, h);
    }
    sceneMaterial.uniforms.uRes.value.set(deviceW, deviceH);
    compositeMaterial.uniforms.uResolution.value.set(deviceW, deviceH);
    return true;
  };

  const radius = () => (BASE_RADIUS / clamp(finite(settings().curvature, 1), 0.08, 6)) * clamp(width / Math.max(height, 1) / 1.6, 0.42, 1);
  const apex = () => 0.5 - clamp(finite(settings().horizon, 0.72), 0.15, 1.1);

  const sunArc = () => {
    const s = settings();
    const aspect = width / Math.max(height, 1);
    const x = clamp(finite(s.sunPosition, 0.15), -1.2, 1.2) * aspect * 0.42;
    const r = radius();
    const wander = s.reduced ? 0 : clamp(finite(s.drift, 0.5), 0, 2) * 0.03 * Math.sin(time * 0.05);
    return Math.asin(clamp(x / r, -0.99, 0.99)) * r + wander;
  };

  const applyUniforms = () => {
    const s = settings();
    const u = sceneMaterial.uniforms;
    const tiltRad = (clamp(finite(s.tilt, 0), -180, 180) * Math.PI) / 180;
    u.uTime.value = time;
    u.uRoll.value = tiltRad + roll;
    u.uApex.value = apex() + lift;
    u.uRadius.value = radius();
    u.uSunArc.value = sunArc();
    const spread = 0.08 + clamp(finite(s.spread, 0.4), 0, 3) * 1.1;
    u.uSpread.value = 0.05 + (spread - 0.05) * (0.15 + 0.85 * rise);
    u.uSunUp.value = clamp(finite(s.sunrise, 1), 0, 1.5) * (0.12 + 0.88 * rise);
    u.uAtmo.value = clamp(finite(s.atmosphere, 1), 0, 3);
    u.uThick.value = clamp(finite(s.thickness, 1), 0.3, 3);
    u.uRimGain.value = clamp(finite(s.rim, 1), 0, 3);
    u.uFlare.value = clamp(finite(s.flare, 1), 0, 3);
    u.uAirglow.value = clamp(finite(s.airglow, 0.5), 0, 2);
    u.uClouds.value = clamp(finite(s.clouds, 0.5), 0, 2);
    u.uStars.value = clamp(finite(s.stars, 0.5), 0, 2);
    u.uAuroraGain.value = clamp(finite(s.aurora, 1), 0, 3);
    for (let i = 0; i < MAX_AURORAS; i++) {
      const aurora = auroras[i];
      if (aurora) {
        const fade = aurora.dying < 0 ? 1 : clamp(1 - (clock - aurora.dying) / AURORA_FADE, 0, 1);
        auroraSlots[i].set(aurora.arc, clock - aurora.born, aurora.strength * fade * fade, aurora.seed);
      } else auroraSlots[i].set(0, 0, 0, 0);
    }
    compositeMaterial.uniforms.uGrain.value = clamp(finite(s.grain, 0.25), 0, 1);
    compositeMaterial.uniforms.uTime.value = time;
  };

  const render = () => {
    if (!sized) return;
    const s = settings();
    if (performance.now() - backgroundAt > 1000) {
      backgroundAt = performance.now();
      syncColors();
    }
    applyUniforms();
    if (ink) {
      sceneMaterial.blending = THREE.NoBlending;
    }
    quad.material = sceneMaterial;
    renderer.setRenderTarget(sceneTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(quadScene, camera);
    const bloom = ink ? 0 : clamp(finite(s.bloom, 0.5), 0, 3);
    if (bloom > 0.001) {
      let source: THREE.WebGLRenderTarget = sceneTarget;
      quad.material = downMaterial;
      for (const bloomTarget of bloomTargets) {
        downMaterial.uniforms.uThreshold.value = source === sceneTarget ? 0.45 : 0;
        downMaterial.uniforms.uSource.value = source.texture;
        downMaterial.uniforms.uTexel.value.set(1 / source.width, 1 / source.height);
        renderer.setRenderTarget(bloomTarget);
        renderer.render(quadScene, camera);
        source = bloomTarget;
      }
      quad.material = upMaterial;
      for (let i = bloomTargets.length - 1; i > 0; i--) {
        upMaterial.uniforms.uSource.value = bloomTargets[i].texture;
        upMaterial.uniforms.uTexel.value.set(1 / bloomTargets[i].width, 1 / bloomTargets[i].height);
        renderer.setRenderTarget(bloomTargets[i - 1]);
        renderer.render(quadScene, camera);
      }
    }
    compositeMaterial.uniforms.uBloomStrength.value = bloom;
    quad.material = compositeMaterial;
    renderer.setRenderTarget(null);
    renderer.render(quadScene, camera);
  };

  const arcAt = (clientX: number, clientY: number) => {
    const box = root.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return null;
    const s = settings();
    const sx = ((clientX - box.left) / box.width - 0.5) * (box.width / box.height);
    const sy = 0.5 - (clientY - box.top) / box.height;
    const angle = (clamp(finite(s.tilt, 0), -180, 180) * Math.PI) / 180 + roll;
    const px = Math.cos(angle) * sx - Math.sin(angle) * sy;
    const py = Math.sin(angle) * sx + Math.cos(angle) * sy;
    const r = radius();
    const cy = apex() + lift - r;
    return Math.atan2(px, py - cy) * r;
  };

  const addAurora = (arc: number, strength: number) => {
    const live = auroras.filter((aurora) => aurora.dying < 0);
    if (live.length >= LIVE_AURORAS) live[0].dying = clock;
    if (auroras.length >= MAX_AURORAS) return;
    auroras.push({ arc, born: clock, strength, seed: random() * 40, dying: -1 });
  };

  const schedule = () => {
    if (destroyed || lost || !visible || raf) return;
    raf = requestAnimationFrame(frame);
  };

  const frame = (now: number) => {
    raf = 0;
    if (destroyed || lost) return;
    const s = settings();
    const dt = last && now - last < 100 ? Math.min(Math.max((now - last) / 1000, 0), 0.05) : 1 / 60;
    last = now;
    const moving = !s.reduced && !s.paused;
    if (moving) {
      clock += dt;
      time += dt * clamp(finite(s.speed, 0.5), 0, 3);
    }
    if (s.intro && !s.reduced) {
      if (introStart < 0) introStart = now;
      const progress = clamp((now - introStart) / 6500, 0, 1);
      rise = progress * progress * (3 - 2 * progress);
    } else rise = 1;
    const follow = s.reduced ? 1 : 1 - Math.exp(-dt / 0.55);
    roll += (rollTarget - roll) * follow;
    lift += (liftTarget - lift) * follow;
    for (let i = auroras.length - 1; i >= 0; i--)
      if (clock - auroras[i].born > AURORA_LIFE || (auroras[i].dying >= 0 && clock - auroras[i].dying > AURORA_FADE)) auroras.splice(i, 1);
    if (moving && s.autoAurora && clamp(finite(s.aurora, 1), 0, 3) > 0 && clock >= nextAuto) {
      const spread = 0.08 + clamp(finite(s.spread, 0.4), 0, 3) * 1.1;
      addAurora(sunArc() + (random() - 0.5) * spread * 2.4, 0.6 + random() * 0.5);
      nextAuto = clock + 5 + random() * 6;
    }
    render();
    const settling = Math.abs(rollTarget - roll) > 0.00005 || Math.abs(liftTarget - lift) > 0.00005;
    const animating = moving || settling || rise < 1;
    if (animating && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const isControl = (target: EventTarget | null) => {
    const element = target as Element | null;
    return (
      !!element &&
      typeof element.closest === 'function' &&
      !!element.closest('a,button,input,textarea,select,label,summary,[role=button],[contenteditable=true]')
    );
  };

  const onPointerMove = (event: PointerEvent) => {
    const s = settings();
    if (!s.interactive || s.reduced || event.pointerType === 'touch') return;
    const box = root.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return;
    const amount = clamp(finite(s.parallax, 0.5), 0, 2);
    const nx = clamp((event.clientX - box.left) / box.width, 0, 1) - 0.5;
    const ny = clamp((event.clientY - box.top) / box.height, 0, 1) - 0.5;
    rollTarget = -nx * 0.07 * amount;
    liftTarget = -ny * 0.05 * amount;
    schedule();
  };

  const onPointerLeave = () => {
    rollTarget = 0;
    liftTarget = 0;
    schedule();
  };

  let press: { id: number; x: number; y: number; time: number } | null = null;

  const onPointerDown = (event: PointerEvent) => {
    press = null;
    const s = settings();
    if (!s.interactive || s.reduced || s.paused || !event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (isControl(event.target)) return;
    press = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  };

  const onPointerUp = (event: PointerEvent) => {
    const tap = press;
    press = null;
    if (!tap || tap.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 10) return;
    if (performance.now() - tap.time > 500) return;
    const s = settings();
    if (clamp(finite(s.aurora, 1), 0, 3) <= 0) return;
    const arc = arcAt(event.clientX, event.clientY);
    if (arc === null) return;
    addAurora(arc, 1);
    schedule();
  };

  const onPointerCancel = () => {
    press = null;
  };

  const onVisibility = () => {
    last = 0;
    schedule();
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onRestored = () => {
    lost = false;
    colorKey = '';
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (readSize()) {
      render();
      schedule();
    }
  });

  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
      schedule();
    },
    { rootMargin: '120px' },
  );

  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerleave', onPointerLeave);
  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerCancel);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  resizeObserver.observe(root);
  intersection.observe(root);
  readSize();
  syncColors();

  return {
    sync: () => {
      backgroundAt = -10;
      readSize();
      last = 0;
      if (!raf && visible) {
        render();
        schedule();
      }
    },
    bloom: (x, strength) => {
      const s = settings();
      if (s.reduced) return;
      const box = root.getBoundingClientRect();
      const arc = arcAt(box.left + clamp(x ?? 0.5, 0, 1) * box.width, box.top + box.height * 0.5);
      if (arc === null) return;
      addAurora(arc, clamp(finite(strength ?? 1, 1), 0, 3));
      schedule();
    },
    replay: () => {
      introStart = -1;
      rise = 0;
      last = 0;
      schedule();
    },
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      quadGeometry.dispose();
      sceneMaterial.dispose();
      downMaterial.dispose();
      upMaterial.dispose();
      compositeMaterial.dispose();
      sceneTarget.dispose();
      for (const bloomTarget of bloomTargets) bloomTarget.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export const HorizonBloom = forwardRef<HorizonBloomHandle, HorizonBloomProps>(function HorizonBloom(
  {
    colors = ['#FF9FFC', '#5227FF'],
    backgroundColor = 'transparent',
    horizon = 0.72,
    curvature = 1,
    tilt = 0,
    sunPosition = 0.15,
    sunrise = 1,
    spread = 0.4,
    atmosphere = 1,
    thickness = 1,
    rim = 1,
    flare = 1,
    airglow = 0.5,
    clouds = 0.5,
    stars = 0.5,
    aurora = 1,
    autoAurora = false,
    speed = 0.5,
    drift = 0.5,
    parallax = 0.5,
    bloom = 0.5,
    grain = 0.25,
    interactive = true,
    intro = true,
    paused = false,
    dpr = 2,
    children,
    className,
    style,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);

  const settings: Settings = {
    colors,
    horizon,
    curvature,
    tilt,
    sunPosition,
    sunrise,
    spread,
    atmosphere,
    thickness,
    rim,
    flare,
    airglow,
    clouds,
    stars,
    aurora,
    autoAurora,
    speed,
    drift,
    parallax,
    bloom,
    grain,
    interactive,
    intro,
    paused,
    dpr,
    reduced,
  };
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const controller = createHorizon(root, stage, settingsRef);
    controllerRef.current = controller;
    return () => {
      controller?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      bloom: (x?: number, strength?: number) => controllerRef.current?.bloom(x, strength),
      replay: () => controllerRef.current?.replay(),
    }),
    [],
  );

  const backgroundValue = backgroundColor.trim().toLowerCase();
  const transparent = backgroundValue === 'transparent' || backgroundValue === '';

  return (
    <div
      ref={ rootRef }
      className={ cn('relative isolate h-full min-h-[320px] w-full overflow-hidden', className) }
      style={ {
        backgroundColor: transparent ? undefined : backgroundColor,
        touchAction: 'pan-y',
        ...style,
      } }
    >
      <div ref={ stageRef } aria-hidden="true" style={ { position: 'absolute', inset: 0, pointerEvents: 'none' } } />
      { children ?
        <div style={ { position: 'relative', zIndex: 1, height: '100%' } }>{ children }</div>
      : null }
    </div>
  );
});

HorizonBloom.displayName = 'HorizonBloom';

export default HorizonBloom;

