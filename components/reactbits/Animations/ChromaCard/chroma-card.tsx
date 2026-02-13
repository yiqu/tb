'use client';

import gsap from 'gsap';
import * as THREE from 'three';
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';

import { cn } from '@/lib/utils';

export interface ChromaCardProps {
  /** Width of the component in pixels or CSS value */
  width?: string | number;
  /** Height of the component in pixels or CSS value */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top of the effect */
  children?: React.ReactNode;
  /** Image source URL */
  imageSrc?: string;
  /** Aspect ratio of the source image */
  imageAspectRatio?: number;
  /** Width of the 3D card */
  cardWidth?: number;
  /** Height of the 3D card */
  cardHeight?: number;
  /** Zoom level on hover (0-1) */
  zoomLevel?: number;
  /** RGB chromatic aberration shift amount (0-0.1) */
  rgbShiftAmount?: number;
  /** Pixel displacement amount on hover (0-0.5) */
  pixelDisplaceAmount?: number;
  /** Duration of hover animation in seconds */
  hoverDuration?: number;
  /** Rotation intensity on mouse move (0-1) */
  rotationIntensity?: number;
  /** Scale intensity on mouse move (0-0.5) */
  scaleIntensity?: number;
  /** Position movement intensity on mouse move (0-2) */
  positionIntensity?: number;
  /** Duration of interaction animations in seconds */
  interactionDuration?: number;
  /** Master opacity (0-1) */
  opacity?: number;
  /** Camera field of view */
  cameraFov?: number;
  /** Camera Z position */
  cameraZ?: number;
  /** Border radius in pixels */
  borderRadius?: number;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D u_texture;
uniform float u_imageAspectRatio;
uniform float u_aspectRatio;
uniform float u_opacity;
uniform float u_hover;
uniform float u_zoomLevel;
uniform float u_rgbShift;
uniform float u_pixelDisplace;
uniform float u_borderRadius;
uniform vec2 u_resolution;
varying vec2 vUv;

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float roundedBoxSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 uv = vUv;

  vec2 pixelCoord = vUv * u_resolution;
  vec2 center = u_resolution * 0.5;
  vec2 halfSize = u_resolution * 0.5;
  float dist = roundedBoxSDF(pixelCoord - center, halfSize, u_borderRadius);

  if (dist > 0.0) {
    discard;
  }

  float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);

  float u = u_imageAspectRatio / u_aspectRatio;
  if(u_imageAspectRatio > u_aspectRatio) {
    u = 1. / u;
  }

  uv.y *= u;
  uv.y -= (u) / 2. - .5;

  float hoverLevel = exponentialInOut(min(1., (distance(vec2(.5), uv) * u_hover) + u_hover));
  uv *= 1. - u_zoomLevel * hoverLevel;
  uv += u_zoomLevel / 2. * hoverLevel;
  uv = clamp(uv, 0., 1.);
  vec4 color = texture2D(u_texture, uv);

  if(hoverLevel > 0.) {
    hoverLevel = 1. - abs(hoverLevel - .5) * 2.;
    uv.y += color.r * hoverLevel * u_pixelDisplace;
    color = texture2D(u_texture, uv);
    color.r = texture2D(u_texture, uv + (hoverLevel) * u_rgbShift).r;
    color.g = texture2D(u_texture, uv - (hoverLevel) * u_rgbShift).g;
  }

  gl_FragColor = vec4(color.rgb, color.a * u_opacity * alpha);
}
`;

interface CardMeshProps {
  imageSrc: string;
  imageAspectRatio: number;
  cardWidth: number;
  cardHeight: number;
  zoomLevel: number;
  rgbShiftAmount: number;
  pixelDisplaceAmount: number;
  hoverDuration: number;
  rotationIntensity: number;
  scaleIntensity: number;
  positionIntensity: number;
  interactionDuration: number;
  opacity: number;
  borderRadius: number;
}

const CardMesh: React.FC<CardMeshProps> = ({
  imageSrc,
  imageAspectRatio,
  cardWidth,
  cardHeight,
  zoomLevel,
  rgbShiftAmount,
  pixelDisplaceAmount,
  hoverDuration,
  rotationIntensity,
  scaleIntensity,
  positionIntensity,
  interactionDuration,
  opacity,
  borderRadius,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseRef = useRef(new THREE.Vector2());

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageSrc);
    return tex;
  }, [imageSrc]);

  const uniforms = useMemo(
    () => ({
      u_texture: { value: texture },
      u_imageAspectRatio: { value: imageAspectRatio },
      u_aspectRatio: { value: cardWidth / cardHeight },
      u_opacity: { value: opacity },
      u_hover: { value: 0 },
      u_zoomLevel: { value: zoomLevel },
      u_rgbShift: { value: rgbShiftAmount },
      u_pixelDisplace: { value: pixelDisplaceAmount },
      u_borderRadius: { value: borderRadius },
      u_resolution: { value: new THREE.Vector2(500, 700) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_texture.value = texture;
      materialRef.current.uniforms.u_imageAspectRatio.value = imageAspectRatio;
      materialRef.current.uniforms.u_aspectRatio.value = cardWidth / cardHeight;
      materialRef.current.uniforms.u_opacity.value = opacity;
      materialRef.current.uniforms.u_zoomLevel.value = zoomLevel;
      materialRef.current.uniforms.u_rgbShift.value = rgbShiftAmount;
      materialRef.current.uniforms.u_pixelDisplace.value = pixelDisplaceAmount;
      materialRef.current.uniforms.u_borderRadius.value = borderRadius;
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!meshRef.current || !materialRef.current) return;
      const mesh = meshRef.current;

      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObject(mesh);

      gsap.to(materialRef.current.uniforms.u_hover, {
        value: intersects.length > 0 ? 1 : 0,
        duration: hoverDuration,
      });

      gsap.to(mesh.scale, {
        x: 1 - mouseRef.current.y * scaleIntensity,
        y: 1 - mouseRef.current.y * scaleIntensity,
        duration: interactionDuration,
      });

      gsap.to(mesh.position, {
        x: mouseRef.current.x * positionIntensity,
        duration: interactionDuration,
      });

      gsap.to(mesh.rotation, {
        x: -mouseRef.current.y * (Math.PI / 3) * rotationIntensity,
        y: mouseRef.current.x * (Math.PI / 3) * rotationIntensity,
        duration: interactionDuration,
      });
    };

    const handleMouseLeave = () => {
      if (!materialRef.current) return;
      gsap.to(materialRef.current.uniforms.u_hover, {
        value: 0,
        duration: hoverDuration,
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl, camera, raycaster, hoverDuration, rotationIntensity, scaleIntensity, positionIntensity, interactionDuration]);

  return (
    <mesh ref={ meshRef }>
      <planeGeometry args={ [cardWidth, cardHeight] } />
      <shaderMaterial
        ref={ materialRef }
        vertexShader={ vertexShader }
        fragmentShader={ fragmentShader }
        uniforms={ uniforms }
        transparent={ true }
      />
    </mesh>
  );
};

const ChromaCard: React.FC<ChromaCardProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  children,
  imageSrc = 'https://images.unsplash.com/photo-1619961602105-16fa2a5465c2?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  imageAspectRatio = 0.67,
  cardWidth = 5,
  cardHeight = 6,
  zoomLevel = 0.3,
  rgbShiftAmount = 0.02,
  pixelDisplaceAmount = 0.095,
  hoverDuration = 3,
  rotationIntensity = 0.2,
  scaleIntensity = 0.1,
  positionIntensity = 0.5,
  interactionDuration = 0.4,
  opacity = 1,
  cameraFov = 50,
  cameraZ = 7,
  borderRadius = 30,
}) => {
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
      <Canvas
        key={ `camera-${cameraFov}-${cameraZ}` }
        className="absolute inset-0 h-full w-full"
        gl={ {
          antialias: true,
          alpha: true,
          toneMapping: THREE.NoToneMapping,
        } }
        camera={ {
          fov: cameraFov,
          near: 0.1,
          far: 100,
          position: [0, 0, cameraZ],
        } }
      >
        <CardMesh
          imageSrc={ imageSrc }
          imageAspectRatio={ imageAspectRatio }
          cardWidth={ cardWidth }
          cardHeight={ cardHeight }
          zoomLevel={ zoomLevel }
          rgbShiftAmount={ rgbShiftAmount }
          pixelDisplaceAmount={ pixelDisplaceAmount }
          hoverDuration={ hoverDuration }
          rotationIntensity={ rotationIntensity }
          scaleIntensity={ scaleIntensity }
          positionIntensity={ positionIntensity }
          interactionDuration={ interactionDuration }
          opacity={ opacity }
          borderRadius={ borderRadius }
        />
      </Canvas>
      { children ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{ children }</div> : null }
    </div>
  );
};

ChromaCard.displayName = 'ChromaCard';

export default ChromaCard;

