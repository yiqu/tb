'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';

import { cn } from '@/lib/utils';

export interface LightspeedProps {
  /** Width of the component in pixels or CSS value */
  width?: number | string;
  /** Height of the component in pixels or CSS value */
  height?: number | string;
  /** Animation speed multiplier */
  speed?: number;
  /** Primary streak color in hex format */
  primaryColor?: string;
  /** Secondary streak color in hex format */
  secondaryColor?: string;
  /** Tertiary streak color in hex format */
  tertiaryColor?: string;
  /** Number of horizontal streak columns */
  streakCount?: number;
  /** Vertical stretch factor of streaks */
  stretchFactor?: number;
  /** Overall intensity/brightness multiplier */
  intensity?: number;
  /** Enable compression on mouse click */
  interactionEnabled?: boolean;
  /** Rotation angle in radians */
  rotation?: number;
  /** Distance-based fade multiplier */
  fadePower?: number;
  /** Overall opacity (0-1) */
  opacity?: number;
  /** Quality preset for performance/visual tradeoff */
  quality?: 'low' | 'medium' | 'high';
  /** Maximum frames per second cap */
  maxFPS?: number;
  /** Pause rendering when component is off-screen */
  pauseWhenOffscreen?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top of the effect */
  children?: React.ReactNode;
}

const Lightspeed: React.FC<LightspeedProps> = ({
  width = '100%',
  height = '100%',
  speed = 1.0,
  primaryColor = '#FF5722',
  secondaryColor = '#2196F3',
  tertiaryColor = '#4CAF50',
  streakCount = 128,
  stretchFactor = 0.05,
  intensity = 1.0,
  interactionEnabled = true,
  rotation = 0,
  fadePower = 2.0,
  opacity = 1.0,
  quality = 'medium',
  maxFPS = 60,
  pauseWhenOffscreen = true,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const mouseDownRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const compressionTargetRef = useRef<number>(0);
  const compressionCurrentRef = useRef<number>(0);

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
        : { r: 1, g: 0.4, b: 0.13 };
    };

    const color1 = hexToRgb(primaryColor);
    const color2 = hexToRgb(secondaryColor);
    const color3 = hexToRgb(tertiaryColor);

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
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      uCompression: { value: 0 },
      uColor1: { value: new THREE.Vector3(color1.r, color1.g, color1.b) },
      uColor2: { value: new THREE.Vector3(color2.r, color2.g, color2.b) },
      uColor3: { value: new THREE.Vector3(color3.r, color3.g, color3.b) },
      uStreakCount: { value: streakCount },
      uStretchFactor: { value: stretchFactor },
      uIntensity: { value: intensity },
      uSpeed: { value: speed },
      uRotation: { value: rotation },
      uFadePower: { value: fadePower },
      uOpacity: { value: opacity },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      #define PI 3.14159265359

      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec4 iMouse;
      uniform float uCompression;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uStreakCount;
      uniform float uStretchFactor;
      uniform float uIntensity;
      uniform float uSpeed;
      uniform float uRotation;
      uniform float uFadePower;
      uniform float uOpacity;

      float computeStreak(vec2 coord, float timeOffset) {
        coord.x = coord.x * uStreakCount;
        float horizontalPos = fract(coord.x);
        float columnIndex = floor(coord.x);

        coord.y *= uStretchFactor;

        float randomOffset = sin(columnIndex * 215.4);

        float speedVariation = cos(columnIndex * 33.1) * 0.3 + 0.7;

        float dynamicTrail = mix(95.0, 35.0, speedVariation);

        float animatedY = fract(coord.y + timeOffset * speedVariation + randomOffset);
        float streakValue = animatedY * dynamicTrail;

        streakValue = 1.0 / streakValue;
        streakValue = smoothstep(0.0, 1.0, streakValue * streakValue);
        streakValue = sin(streakValue * PI) * (speedVariation * 5.0);

        float horizontalFalloff = sin(horizontalPos * PI);

        return streakValue * (horizontalFalloff * horizontalFalloff);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;

        float distFromCenter = length(uv) + 0.1;

        float angle = atan(uv.x, uv.y) / PI + uRotation;
        float radius = 2.5 / distFromCenter;
        vec2 polarCoord = vec2(angle, radius);

        float compressionFactor = mix(1.0, 0.5, uCompression);
        polarCoord.y *= compressionFactor;

        float animTime = iTime * 0.4 * uSpeed;

        vec3 finalColor = vec3(0.0);
        finalColor += uColor1 * computeStreak(polarCoord, animTime);
        finalColor += uColor2 * computeStreak(polarCoord, animTime + 0.33);
        finalColor += uColor3 * computeStreak(polarCoord, animTime + 0.66);

        finalColor *= uIntensity;
        float distanceFade = pow(distFromCenter, uFadePower);
        finalColor *= distanceFade;

        finalColor *= uOpacity;

        float alpha = max(max(finalColor.r, finalColor.g), finalColor.b);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.iMouse.value.x = event.clientX - rect.left;
      uniforms.iMouse.value.y = actualHeight - (event.clientY - rect.top);
    };

    const handleMouseDown = () => {
      mouseDownRef.current = true;
      compressionTargetRef.current = 1;
      uniforms.iMouse.value.z = 1;
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
      compressionTargetRef.current = 0;
      uniforms.iMouse.value.z = 0;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        uniforms.iMouse.value.x = touch.clientX - rect.left;
        uniforms.iMouse.value.y = actualHeight - (touch.clientY - rect.top);
        compressionTargetRef.current = 1;
        uniforms.iMouse.value.z = 1;
      }
    };

    const handleTouchEnd = () => {
      compressionTargetRef.current = 0;
      uniforms.iMouse.value.z = 0;
    };

    if (interactionEnabled) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

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

    const frameInterval = 1000 / maxFPS;
    const animate = (currentTime: number) => {
      rafRef.current = requestAnimationFrame(animate);

      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
        lastFrameTimeRef.current = currentTime;
      }

      const elapsed = currentTime - lastFrameTimeRef.current;

      if (elapsed < frameInterval) {
        return;
      }

      lastFrameTimeRef.current = currentTime - (elapsed % frameInterval);

      if (pauseWhenOffscreen && !isVisibleRef.current) {
        return;
      }

      uniforms.iTime.value = (currentTime - startTimeRef.current) * 0.001;

      const compressionSpeed = 4.0;
      const delta = elapsed * 0.001;
      compressionCurrentRef.current += (compressionTargetRef.current - compressionCurrentRef.current) * compressionSpeed * delta;
      uniforms.uCompression.value = compressionCurrentRef.current;

      uniforms.uColor1.value.set(color1.r, color1.g, color1.b);
      uniforms.uColor2.value.set(color2.r, color2.g, color2.b);
      uniforms.uColor3.value.set(color3.r, color3.g, color3.b);
      uniforms.uStreakCount.value = streakCount;
      uniforms.uStretchFactor.value = stretchFactor;
      uniforms.uIntensity.value = intensity;
      uniforms.uSpeed.value = speed;
      uniforms.uRotation.value = rotation;
      uniforms.uFadePower.value = fadePower;
      uniforms.uOpacity.value = opacity;

      renderer.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(animate);

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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (interactionEnabled) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }

      if (observer) {
        observer.disconnect();
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    primaryColor,
    secondaryColor,
    tertiaryColor,
    streakCount,
    stretchFactor,
    intensity,
    speed,
    rotation,
    fadePower,
    opacity,
    interactionEnabled,
    quality,
    maxFPS,
    pauseWhenOffscreen,
  ]);

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div ref={ containerRef } className={ cn('relative overflow-hidden', className) } style={ { width: widthStyle, height: heightStyle } }>
      { children ? <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">{ children }</div> : null }
    </div>
  );
};

export default Lightspeed;

