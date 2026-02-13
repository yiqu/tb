'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';

import { cn } from '@/lib/utils';

export interface PerspectiveGridProps {
  /** Width of the component in pixels or CSS value */
  width?: number | string;
  /** Height of the component in pixels or CSS value */
  height?: number | string;
  /** Animation speed multiplier */
  speed?: number;
  /** Grid color in hex format */
  color?: string;
  /** Grid scale factor */
  gridScale?: number;
  /** Line thickness */
  lineThickness?: number;
  /** Anti-aliasing quality (higher = better quality) */
  antialiasQuality?: number;
  /** Whether to automatically play the animation */
  autoPlay?: boolean;
  /** Opacity of the grid (0-1) */
  opacity?: number;
  /** Fade smoothness - controls how gradually the alpha transitions (higher = smoother blend) */
  fadeSmoothness?: number;
  /** Perspective rotation angle in degrees (0 = flat, positive = tilted back) */
  perspective?: number;
  /** How far into the distance the grid extends (higher = longer) */
  gridLength?: number;
  /** Curve intensity - bends the grid upward at edges (0 = flat, higher = more curved) */
  curve?: number;
  /** Bottom fade color - adds a gradient fade at the bottom (e.g., "#000000" for black fade, empty/undefined for no fade) */
  bottomFade?: string;
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top of the grid */
  children?: React.ReactNode;
}

const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  width = '100%',
  height = 400,
  speed = 0.5,
  color = '#FF9FFC',
  gridScale = 1.0,
  lineThickness = 1,
  antialiasQuality = 64.0,
  autoPlay = true,
  opacity = 1.0,
  fadeSmoothness = 1,
  perspective = 0.0,
  gridLength = 10.0,
  curve = 0.0,
  bottomFade = '#0a0a0a',
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(!autoPlay);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ?
          {
            r: Number.parseInt(result[1], 16) / 255,
            g: Number.parseInt(result[2], 16) / 255,
            b: Number.parseInt(result[3], 16) / 255,
          }
        : { r: 0, g: 1, b: 1 };
    };

    const rgb = hexToRgb(color);

    const rect = container.getBoundingClientRect();
    const actualWidth = rect.width;
    const actualHeight = rect.height;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(actualWidth, actualHeight, false);
    renderer.setPixelRatio(pixelRatio);

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const bufferWidth = actualWidth * pixelRatio;
    const bufferHeight = actualHeight * pixelRatio;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(bufferWidth, bufferHeight, 1.0) },
      uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
      uGridScale: { value: gridScale },
      uLineThickness: { value: lineThickness },
      uAntialiasQuality: { value: antialiasQuality },
      uOpacity: { value: opacity },
      uFadeSmoothness: { value: fadeSmoothness },
      uPerspective: { value: perspective },
      uGridLength: { value: gridLength },
      uCurve: { value: curve },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec3 uColor;
      uniform float uGridScale;
      uniform float uLineThickness;
      uniform float uAntialiasQuality;
      uniform float uOpacity;
      uniform float uFadeSmoothness;
      uniform float uPerspective;
      uniform float uGridLength;
      uniform float uCurve;

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

        if (uv.y > 0.0) {
          fragColor = vec4(0.0);
          return;
        }

        uv.y = -uv.y;

        float perspectiveRad = radians(uPerspective);
        float cosP = cos(perspectiveRad);
        float sinP = sin(perspectiveRad);

        float uvYRotated = uv.y * cosP;
        float depthAdjust = uv.y * sinP;

        uvYRotated = max(uvYRotated, 0.001);

        float d = 1.0 / abs(uvYRotated);
        d = d * (1.0 + depthAdjust);

        d = min(d, uGridLength);

        vec2 pv = vec2(uv.x * d, d);

        if (uCurve > 0.0) {
          float curveAmount = uCurve * (1.0 - uvYRotated / 1.0);
          pv.x = pv.x + sign(pv.x) * pow(abs(pv.x), 1.0 + curveAmount * 0.3) * curveAmount * 0.2;
        }

        pv.y += iTime;
        pv *= uGridScale;

        vec2 grid = fract(pv);

        vec2 derivative = fwidth(pv);

        vec2 gridDist = min(grid, 1.0 - grid);

        vec2 aa = derivative * (1.0 + uLineThickness * 2.0);
        vec2 gridAA = smoothstep(aa, vec2(0.0), gridDist);

        float gridPattern = max(gridAA.x, gridAA.y);

        float fadeFactor = smoothstep(0.0, 0.4, uv.y) * smoothstep(uGridLength, 2.0, d);

        float alpha = gridPattern * fadeFactor * uOpacity;

        float cutoffMin = 0.15;
        float cutoffMax = 0.15 + (uFadeSmoothness);
        alpha = smoothstep(cutoffMin, cutoffMax, alpha);

        alpha = alpha * alpha;

        vec3 col = uColor * alpha;

        if (alpha < 0.05) {
          fragColor = vec4(0.0, 0.0, 0.0, 0.0);
        } else {
          fragColor = vec4(col, alpha);
        }
      }

      void main() {
        vec4 color = vec4(0.0);
        mainImage(color, gl_FragCoord.xy);
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
      premultipliedAlpha: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    startTimeRef.current = performance.now();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      if (!isPausedRef.current) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        uniforms.iTime.value = elapsed * speed;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      const newWidth = newRect.width;
      const newHeight = newRect.height;

      renderer.setSize(newWidth, newHeight, false);

      const newBufferWidth = newWidth * pixelRatio;
      const newBufferHeight = newHeight * pixelRatio;
      uniforms.iResolution.value.set(newBufferWidth, newBufferHeight, 1.0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed, color, gridScale, lineThickness, antialiasQuality, autoPlay, opacity, fadeSmoothness, perspective, gridLength, curve]);

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={ cn('relative overflow-hidden', className) }
      style={ {
        width: widthStyle,
        height: heightStyle,
      } }
    >
      <div ref={ containerRef } className="absolute inset-0" />
      { bottomFade ? <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-5 h-[30%]"
          style={ {
            background: `linear-gradient(to top, ${bottomFade}, transparent)`,
          } }
        /> : null }
      { children ? <div className="pointer-events-none relative z-10 h-full w-full">{ children }</div> : null }
    </div>
  );
};

PerspectiveGrid.displayName = 'PerspectiveGrid';

export default PerspectiveGrid;

