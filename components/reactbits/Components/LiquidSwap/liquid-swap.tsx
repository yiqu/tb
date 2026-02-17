'use client';

import gsap from 'gsap';
import * as THREE from 'three';
import { useRef, useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

export interface LiquidSwapProps {
  images: string[];
  transitionDuration?: number;
  glassRefractionStrength?: number;
  glassChromaticAberration?: number;
  glassBubbleClarity?: number;
  glassEdgeGlow?: number;
  glassLiquidFlow?: number;
  startAtCursor?: boolean;
  autoCycle?: boolean;
  autoCycleDelay?: number;
  className?: string;
}

const VS = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FS = `
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform float uMix;
  uniform vec2 uSize;
  uniform vec2 uTex1Dims;
  uniform vec2 uTex2Dims;
  uniform vec2 uOrigin;
  uniform float uRefract;
  uniform float uChroma;
  uniform float uClarity;
  uniform float uGlow;
  uniform float uFlow;

  varying vec2 vUv;

  vec2 fitCover(vec2 coord, vec2 texDims) {
    vec2 ratio = uSize / texDims;
    float scale = max(ratio.x, ratio.y);
    vec2 scaled = texDims * scale;
    vec2 delta = (uSize - scaled) * 0.5;
    return (coord * uSize - delta) / scaled;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float interpolatedNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  vec4 transition(vec2 coord, float t) {
    float intensity = 0.08 * uRefract;
    float chromaOffset = 0.02 * uChroma;
    float waveAmount = 0.025;
    float centerClear = 0.3 * uClarity;
    float rippleSize = 0.004;
    float flowSpeed = 0.015 * uFlow;
    float edgeWidth = 0.05;
    float borderWidth = 0.025;

    float fadePhase = smoothstep(0.8, 1.0, t);
    float edgeIntensity = 0.08 * (1.0 - fadePhase) * uGlow;
    float borderAlpha = 0.06 * (1.0 - fadePhase) * uGlow;

    vec2 pixelPos = coord * uSize;
    vec2 baseCoord1 = fitCover(coord, uTex1Dims);
    vec2 baseCoord2 = fitCover(coord, uTex2Dims);

    vec2 centerPixel = uOrigin * uSize;

    vec2 cornerA = vec2(0.0, 0.0) - centerPixel;
    vec2 cornerB = vec2(uSize.x, 0.0) - centerPixel;
    vec2 cornerC = vec2(0.0, uSize.y) - centerPixel;
    vec2 cornerD = vec2(uSize.x, uSize.y) - centerPixel;

    float maxDist = max(
      max(length(cornerA), length(cornerB)),
      max(length(cornerC), length(cornerD))
    );

    float radius = t * maxDist;
    float dist = length(pixelPos - centerPixel);
    float norm = dist / max(radius, 0.001);
    vec2 dir = (dist > 0.0) ? (pixelPos - centerPixel) / dist : vec2(0.0);
    float mask = smoothstep(radius + 3.0, radius - 3.0, dist);

    float distFactor = smoothstep(centerClear, 1.0, norm);
    float elapsed = t * 5.0;

    vec2 surface = vec2(
      interpolatedNoise(coord * 100.0 + elapsed * 0.3),
      interpolatedNoise(coord * 100.0 + elapsed * 0.2 + 50.0)
    ) - 0.5;
    surface *= rippleSize * distFactor;

    vec2 distorted = baseCoord2;
    if (mask > 0.0) {
      float bend = intensity * pow(distFactor, 1.5);
      vec2 flowDir = normalize(dir + vec2(sin(elapsed), cos(elapsed * 0.7)) * 0.3);
      distorted -= flowDir * bend;

      float w1 = sin(norm * 22.0 - elapsed * 3.5);
      float w2 = sin(norm * 35.0 + elapsed * 2.8) * 0.7;
      float w3 = sin(norm * 50.0 - elapsed * 4.2) * 0.5;
      float combined = (w1 + w2 + w3) / 3.0;

      float shift = combined * waveAmount * distFactor;
      distorted -= dir * shift + surface;

      vec2 motion = vec2(
        sin(elapsed + norm * 10.0),
        cos(elapsed * 0.8 + norm * 8.0)
      ) * flowSpeed * distFactor * mask;
      distorted += motion;
    }

    vec4 result;
    if (mask > 0.0) {
      float aberration = chromaOffset * pow(distFactor, 1.2);

      vec2 rCoord = distorted + dir * aberration * 1.2;
      vec2 gCoord = distorted + dir * aberration * 0.2;
      vec2 bCoord = distorted - dir * aberration * 0.8;

      float r = texture2D(uTex2, rCoord).r;
      float g = texture2D(uTex2, gCoord).g;
      float b = texture2D(uTex2, bCoord).b;
      result = vec4(r, g, b, 1.0);
    } else {
      result = texture2D(uTex2, baseCoord2);
    }

    if (mask > 0.0 && edgeIntensity > 0.0) {
      float rim = smoothstep(1.0 - edgeWidth, 1.0, norm) *
                  (1.0 - smoothstep(1.0, 1.01, norm));
      result.rgb += rim * edgeIntensity;

      float edge = smoothstep(1.0 - borderWidth, 1.0, norm) *
                   (1.0 - smoothstep(1.0, 1.01, norm));
      result.rgb = mix(result.rgb, vec3(1.0), edge * borderAlpha);
    }

    vec4 prevImg = texture2D(uTex1, baseCoord1);

    if (t > 0.95) {
      vec4 cleanResult = texture2D(uTex2, baseCoord2);
      float endFade = (t - 0.95) / 0.05;
      result = mix(result, cleanResult, endFade);
    }

    return mix(prevImg, result, mask);
  }

  void main() {
    if (uMix <= 0.0) {
      vec2 uv = fitCover(vUv, uTex1Dims);
      gl_FragColor = texture2D(uTex1, uv);
      return;
    }
    gl_FragColor = transition(vUv, uMix);
  }
`;

export const LiquidSwap: React.FC<LiquidSwapProps> = ({
  images,
  transitionDuration = 2.5,
  glassRefractionStrength = 1.0,
  glassChromaticAberration = 0,
  glassBubbleClarity = 1.0,
  glassEdgeGlow = 1.0,
  glassLiquidFlow = 1.0,
  startAtCursor = false,
  autoCycle = false,
  autoCycleDelay = 3000,
  className = '',
}) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const sceneObj = useRef<THREE.Scene | null>(null);
  const cam = useRef<THREE.OrthographicCamera | null>(null);
  const webgl = useRef<THREE.WebGLRenderer | null>(null);
  const shader = useRef<THREE.ShaderMaterial | null>(null);
  const textures = useRef<THREE.Texture[]>([]);
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      const loader = new THREE.TextureLoader();
      const result: THREE.Texture[] = [];

      for (const url of images) {
        try {
          const tex = await new Promise<THREE.Texture>((resolve, reject) => {
            loader.load(
              url,
              (t) => {
                t.minFilter = t.magFilter = THREE.LinearFilter;
                t.userData = {
                  dims: new THREE.Vector2(t.image.width, t.image.height),
                };
                resolve(t);
              },
              undefined,
              reject,
            );
          });
          result.push(tex);
        } catch {
          console.warn(`Failed to load: ${url}`);
        }
      }

      textures.current = result;
      if (result.length >= 2) {
        setLoaded(true);
      }
    };

    loadAll();
  }, [images]);

  useEffect(() => {
    if (!canvasEl.current || textures.current.length < 2) return;

    const canvas = canvasEl.current;
    const container = canvas.parentElement;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    });

    const resize = () => {
      if (!container || !renderer || !shader.current) return;
      const box = container.getBoundingClientRect();
      const w = box.width;
      const h = box.height;

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      shader.current.uniforms.uSize.value.set(w, h);
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex1: { value: textures.current[0] },
        uTex2: { value: textures.current[1] },
        uMix: { value: 0.0 },
        uSize: { value: new THREE.Vector2(1, 1) },
        uTex1Dims: { value: textures.current[0].userData.dims },
        uTex2Dims: { value: textures.current[1].userData.dims },
        uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
        uRefract: { value: glassRefractionStrength },
        uChroma: { value: glassChromaticAberration },
        uClarity: { value: glassBubbleClarity },
        uGlow: { value: glassEdgeGlow },
        uFlow: { value: glassLiquidFlow },
      },
      vertexShader: VS,
      fragmentShader: FS,
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geo, mat);
    scene.add(plane);

    sceneObj.current = scene;
    cam.current = camera;
    webgl.current = renderer;
    shader.current = mat;

    resize();

    const tick = () => {
      if (webgl.current && sceneObj.current && cam.current) {
        webgl.current.render(sceneObj.current, cam.current);
      }
      requestAnimationFrame(tick);
    };
    tick();

    const observer = new ResizeObserver(() => {
      resize();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, [loaded]);

  useEffect(() => {
    if (!shader.current) return;
    shader.current.uniforms.uRefract.value = glassRefractionStrength;
    shader.current.uniforms.uChroma.value = glassChromaticAberration;
    shader.current.uniforms.uClarity.value = glassBubbleClarity;
    shader.current.uniforms.uGlow.value = glassEdgeGlow;
    shader.current.uniforms.uFlow.value = glassLiquidFlow;
  }, [glassRefractionStrength, glassChromaticAberration, glassBubbleClarity, glassEdgeGlow, glassLiquidFlow]);

  const advance = useCallback(
    (evt?: React.MouseEvent<HTMLDivElement>) => {
      if (animating || !shader.current || textures.current.length < 2 || !canvasEl.current) return;

      if (startAtCursor && evt) {
        const box = canvasEl.current.getBoundingClientRect();
        const nx = (evt.clientX - box.left) / box.width;
        const ny = (evt.clientY - box.top) / box.height;
        const cx = Math.max(0, Math.min(1, nx));
        const cy = Math.max(0, Math.min(1, 1.0 - ny));
        shader.current.uniforms.uOrigin.value.set(cx, cy);
      } else {
        shader.current.uniforms.uOrigin.value.set(0.5, 0.5);
      }

      const next = (idx + 1) % textures.current.length;
      const prev = textures.current[idx];
      const curr = textures.current[next];

      setAnimating(true);

      shader.current.uniforms.uTex1.value = prev;
      shader.current.uniforms.uTex2.value = curr;
      shader.current.uniforms.uTex1Dims.value = prev.userData.dims;
      shader.current.uniforms.uTex2Dims.value = curr.userData.dims;

      gsap.fromTo(
        shader.current.uniforms.uMix,
        { value: 0 },
        {
          value: 1,
          duration: transitionDuration,
          ease: 'power2.inOut',
          onComplete: () => {
            if (shader.current) {
              shader.current.uniforms.uMix.value = 0;
              shader.current.uniforms.uTex1.value = curr;
              shader.current.uniforms.uTex1Dims.value = curr.userData.dims;
            }
            setIdx(next);
            setAnimating(false);
          },
        },
      );
    },
    [idx, animating, transitionDuration, startAtCursor],
  );

  useEffect(() => {
    if (!autoCycle || !loaded || animating) return;

    const timer = setTimeout(() => {
      advance();
    }, autoCycleDelay);

    return () => clearTimeout(timer);
  }, [autoCycle, autoCycleDelay, loaded, animating, advance]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        advance();
      }
    },
    [advance],
  );

  return (
    <div
      className={ cn('relative h-full w-full cursor-pointer overflow-hidden', className) }
      onClick={ advance }
      role="button"
      tabIndex={ 0 }
      onKeyDown={ handleKeyDown }
    >
      <canvas ref={ canvasEl } className="block h-full w-full" style={ { opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' } } />
      { !loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-sm text-white">Loading...</div>
        </div>
      ) }
    </div>
  );
};

export default LiquidSwap;

