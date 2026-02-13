'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';

import { cn } from '@/lib/utils';

export interface LightDropletsProps {
  /** Width of the component in pixels or CSS value */
  width?: number | string;
  /** Height of the component in pixels or CSS value */
  height?: number | string;
  /** Animation speed multiplier */
  speed?: number;
  /** Droplet color in hex format */
  color?: string;
  /** Number of droplet columns */
  columnCount?: number;
  /** Vertical stretch factor */
  stretch?: number;
  /** Droplet trail length */
  trailLength?: number;
  /** Rotation speed multiplier */
  rotationSpeed?: number;
  /** Manual rotation angle in degrees (when autoRotate is false) */
  rotation?: number;
  /** Droplet intensity/brightness */
  intensity?: number;
  /** Droplet thickness/width */
  thickness?: number;
  /** Enable automatic rotation */
  enableRotation?: boolean;
  /** Transparent background */
  transparent?: boolean;
  /** Quality preset for performance */
  quality?: 'low' | 'medium' | 'high';
  /** Maximum frames per second */
  maxFPS?: number;
  /** Pause when component is off-screen */
  pauseWhenOffscreen?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top */
  children?: React.ReactNode;
}

const LightDroplets: React.FC<LightDropletsProps> = ({
  width = '100%',
  height = '100%',
  speed = 0.3,
  color = '#5227FF',
  columnCount = 64,
  stretch = 0.25,
  trailLength = 50.0,
  rotationSpeed = 1.0,
  rotation = 90,
  intensity = 1.0,
  thickness = 0.25,
  enableRotation = false,
  transparent = true,
  quality = 'medium',
  maxFPS = 120,
  pauseWhenOffscreen = true,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

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
        : { r: 0.33, g: 0.95, b: 0.43 };
    };

    const dropletColor = hexToRgb(color);

    const rect = container.getBoundingClientRect();
    const actualWidth = rect.width;
    const actualHeight = rect.height;

    const qualitySettings = {
      low: { pixelRatio: 1, antialias: false },
      medium: {
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
      },
      high: {
        pixelRatio: Math.min(window.devicePixelRatio, 3),
        antialias: true,
      },
    };
    const settings = qualitySettings[quality];

    const renderer = new THREE.WebGLRenderer({
      antialias: settings.antialias,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    });
    renderer.setClearColor(0x000000, 0);

    const {pixelRatio} = settings;
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
      iResolution: { value: new THREE.Vector2(bufferWidth, bufferHeight) },
      uColor: {
        value: new THREE.Vector3(dropletColor.r, dropletColor.g, dropletColor.b),
      },
      uColumnCount: { value: columnCount },
      uStretch: { value: stretch },
      uTrailLength: { value: trailLength },
      uRotationSpeed: { value: rotationSpeed },
      uRotation: { value: (rotation * Math.PI) / 180 },
      uIntensity: { value: intensity },
      uThickness: { value: thickness },
      uEnableRotation: { value: enableRotation ? 1.0 : 0.0 },
      uTransparent: { value: transparent ? 1.0 : 0.0 },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uColor;
      uniform float uColumnCount;
      uniform float uStretch;
      uniform float uTrailLength;
      uniform float uRotationSpeed;
      uniform float uRotation;
      uniform float uIntensity;
      uniform float uThickness;
      uniform float uEnableRotation;
      uniform float uTransparent;

      const float TWO_PI = 6.28318530718;
      const float HALF_PI = 1.57079632679;

      mat2 createRotationMatrix(float angle) {
        float cosA = cos(angle);
        float sinA = sin(angle);
        return mat2(cosA, sinA, -sinA, cosA);
      }

      void main() {
        vec2 coord = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

        float distanceFromCenter = length(coord * 0.2);

        if (uEnableRotation > 0.5) {
          float rotationAngle = distanceFromCenter + fract(iTime * 0.025 * uRotationSpeed) * TWO_PI;
          coord *= createRotationMatrix(rotationAngle);
        } else if (abs(uRotation) > 0.001) {
          float rotationAngle = distanceFromCenter + uRotation;
          coord *= createRotationMatrix(rotationAngle);
        } else {
          coord *= createRotationMatrix(distanceFromCenter);
        }

        coord.x *= uColumnCount;
        float columnFraction = fract(coord.x);
        float columnIndex = floor(coord.x);

        float animTime = iTime * 0.4;

        coord.y *= uStretch;

        float randomOffset = sin(columnIndex * 215.4);

        float speedVariation = cos(columnIndex * 33.1) * 0.3 + 0.7;

        float dynamicTrail = mix(uTrailLength * 1.5, uTrailLength * 0.5, speedVariation);

        float verticalPos = fract(coord.y + animTime * speedVariation + randomOffset) * dynamicTrail;

        verticalPos = 1.0 / verticalPos;

        verticalPos = smoothstep(0.0, 1.0, verticalPos * verticalPos);

        verticalPos = sin(verticalPos * HALF_PI * 2.0) * (speedVariation * 5.0);

        float horizontalFade = sin(columnFraction * HALF_PI * 2.0);
        horizontalFade = pow(horizontalFade, 1.0 / max(uThickness, 0.1));
        verticalPos *= horizontalFade * horizontalFade;

        vec3 finalColor = uColor * verticalPos * uIntensity;

        if (uTransparent > 0.5) {
          float alpha = max(max(finalColor.r, finalColor.g), finalColor.b);
          gl_FragColor = vec4(finalColor, alpha);
        } else {
          gl_FragColor = vec4(finalColor, 1.0);
        }
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let observer: IntersectionObserver | null = null;
    if (pauseWhenOffscreen) {
      observer = new IntersectionObserver(
        (entries) => {
          isVisibleRef.current = entries[0].isIntersecting;
        },
        { threshold: 0 },
      );
      observer.observe(container);
    }

    startTimeRef.current = performance.now();
    lastFrameTimeRef.current = performance.now();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      if (pauseWhenOffscreen && !isVisibleRef.current) {
        return;
      }

      const now = performance.now();
      const frameDuration = 1000 / maxFPS;
      if (now - lastFrameTimeRef.current < frameDuration) {
        return;
      }
      lastFrameTimeRef.current = now;

      const elapsed = (now - startTimeRef.current) / 1000;
      uniforms.iTime.value = elapsed * speed;

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
      uniforms.iResolution.value.set(newBufferWidth, newBufferHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) {
        observer.disconnect();
      }
      cancelAnimationFrame(rafRef.current);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    speed,
    color,
    columnCount,
    stretch,
    trailLength,
    rotationSpeed,
    rotation,
    intensity,
    thickness,
    enableRotation,
    transparent,
    quality,
    maxFPS,
    pauseWhenOffscreen,
  ]);

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
      { children ? <div className="pointer-events-none relative z-10 h-full w-full">{ children }</div> : null }
    </div>
  );
};

LightDroplets.displayName = 'LightDroplets';

export default LightDroplets;

