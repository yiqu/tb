'use client';

import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

import { cn } from '@/lib/utils';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;

  uniform float uRayCount;
  uniform float uRayWidth;
  uniform float uPulseSpeed;
  uniform float uPulseWidth;
  uniform float uTrailLength;
  uniform float uMotionBlur;
  uniform float uBgGlow;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  const float topWidth = 0.15;
  const float bottomWidth = 1.0;
  const float verticalLength = 0.45;
  const float controlPoint1Y = 0.35;
  const float controlPoint1X = 0.25;
  const float controlPoint2Y = 0.55;
  const float controlPoint2X = 0.0;
  const float glowSpread = 1.0;
  const float glowCurve = 0.2;
  const float pulseBrightness = 1.0;

  varying vec2 vUv;

  float hash(float n) {
      return fract(sin(n * 127.1) * 43758.5453123);
  }

  vec3 solveCubic(float a, float b, float c, float d) {
      if (abs(a) < 1e-6) {
          if (abs(b) < 1e-6) {
              if (abs(c) < 1e-6) return vec3(-1.0);
              return vec3(-d/c, -1.0, -1.0);
          }
          float delta = c*c - 4.0*b*d;
          if (delta < 0.0) return vec3(-1.0);
          float sqrtDelta = sqrt(delta);
          return vec3((-c - sqrtDelta)/(2.0*b), (-c + sqrtDelta)/(2.0*b), -1.0);
      }

      float p = (3.0*a*c - b*b) / (3.0*a*a);
      float q = (2.0*b*b*b - 9.0*a*b*c + 27.0*a*a*d) / (27.0*a*a*a);

      float offset = b / (3.0*a);
      float discriminant = q*q/4.0 + p*p*p/27.0;

      if (discriminant > 0.0) {
          float r = sqrt(discriminant);
          float u = pow(abs(-q/2.0 + r), 1.0/3.0);
          u = (-q/2.0 + r) < 0.0 ? -u : u;
          float v = pow(abs(-q/2.0 - r), 1.0/3.0);
          v = (-q/2.0 - r) < 0.0 ? -v : v;
          return vec3(u + v - offset, -1.0, -1.0);
      } else if (discriminant == 0.0) {
          float u = pow(abs(q/2.0), 1.0/3.0);
          u = q < 0.0 ? u : -u;
          return vec3(2.0*u - offset, -u - offset, -1.0);
      } else {
          float r = sqrt(-p*p*p/27.0);
          float phi = acos(clamp(-q/(2.0*r), -1.0, 1.0));
          float t1 = 2.0 * pow(r, 1.0/3.0);
          float rho = 2.0 * sqrt(-p/3.0);
          float t0 = rho * cos(phi/3.0) - offset;
          float t1_val = rho * cos((phi + 2.0*3.14159)/3.0) - offset;
          float t2_val = rho * cos((phi + 4.0*3.14159)/3.0) - offset;
          return vec3(t0, t1_val, t2_val);
      }
  }

  void main() {
    float targetY = 1.0 - vUv.y;

    float P0 = 0.0;
    float P1 = verticalLength + controlPoint1Y;
    float P2 = controlPoint2Y;
    float P3 = 1.0;

    float a = -P0 + 3.0*P1 - 3.0*P2 + P3;
    float b = 3.0*P0 - 6.0*P1 + 3.0*P2;
    float c = -3.0*P0 + 3.0*P1;
    float d = P0 - targetY;

    vec3 roots = solveCubic(a, b, c, d);

    vec3 finalColorAccum = vec3(0.0);
    vec3 bgGlowAccum = vec3(0.0);

    float px = 1.0 / uResolution.x;

    for (int r = 0; r < 3; r++) {
        float t = roots[r];
        if (t < 0.0 || t > 1.0) continue;

        float s = 1.0 - t;
        float flowWidthAtT = s*s*s*topWidth +
                             3.0*s*s*t*(bottomWidth * controlPoint1X) +
                             3.0*s*t*t*(bottomWidth * controlPoint2X) +
                             t*t*t*bottomWidth;

        float idealH = (vUv.x - 0.5) / flowWidthAtT;
        float idealRayIndex = idealH + 0.5;
        float idealBin = idealRayIndex * (uRayCount - 1.0);

        for (int offset = 0; offset <= 1; offset++) {
             float bin = floor(idealBin) + float(offset);
             if (bin < 0.0 || bin >= uRayCount) continue;

             float i = bin;
             float rayIndex = i / (uRayCount - 1.0);
             float H = rayIndex - 0.5;
             float centerX = 0.5 + H * flowWidthAtT;
             float dist = abs(vUv.x - centerX);

             float widthAtT = mix(topWidth, bottomWidth, t);
             float widthScale = widthAtT / max(topWidth, bottomWidth);
             float scaledRayWidth = uRayWidth * widthScale;

             float dy_dt = 3.0*a*t*t + 2.0*b*t + c;
             float Wa = -topWidth + 3.0*(bottomWidth*controlPoint1X) - 3.0*(bottomWidth*controlPoint2X) + bottomWidth;
             float Wb = 3.0*topWidth - 6.0*(bottomWidth*controlPoint1X) + 3.0*(bottomWidth*controlPoint2X);
             float Wc = -3.0*topWidth + 3.0*(bottomWidth*controlPoint1X);
             float dFlowWidth_dt = 3.0*Wa*t*t + 2.0*Wb*t + Wc;
             float dx_dt = H * dFlowWidth_dt;

             float geomFactor = abs(dy_dt) / sqrt(dx_dt*dx_dt + dy_dt*dy_dt);
             float trueDist = dist * geomFactor;

             float minWidth = px * 1.5;
             float aaScale = 1.0;
             if (scaledRayWidth < minWidth) {
                 aaScale = scaledRayWidth / minWidth;
                 scaledRayWidth = minWidth;
             }

             float rayGlow = exp(-trueDist / scaledRayWidth);

             rayGlow = pow(rayGlow, 0.8);
             rayGlow *= aaScale;

             float colorHash = hash(i * 3.7);
             vec3 rayColor = mix(uColor1, uColor2, targetY);
             rayColor += (colorHash - 0.5) * 0.1;

             vec3 pulseColor = vec3(0.0);
             for (float p = 0.0; p < 3.0; p += 1.0) {
                 float pulseTime = uTime * uPulseSpeed + i * 0.2 + p * 0.7;
                 float pulsePos = fract(pulseTime);

                 float pulseDist = abs(t - pulsePos);

                 float pulseWidthAtT = mix(topWidth, bottomWidth, pulsePos);
                 float pulseWidthScale = pulseWidthAtT / max(topWidth, bottomWidth);
                 float scaledPulseWidth = uPulseWidth * pulseWidthScale;

                 float pulse = exp(-pulseDist / scaledPulseWidth) * rayGlow;

                 float trailDist = pulsePos - t;
                 if (trailDist > 0.0 && trailDist < uTrailLength) {
                     float trailFade = (1.0 - trailDist / uTrailLength) * 0.3;
                     pulse += trailFade * rayGlow;

                     float blurFactor = exp(-trailDist * 2.0) * uMotionBlur;
                     pulse += blurFactor * rayGlow * 0.5;
                 }

                 pulse *= smoothstep(1.0, 0.8, pulsePos);
                 pulseColor += rayColor * pulse;
             }

             finalColorAccum += pulseColor * pulseBrightness;

             float bgGlowDist = trueDist / (uRayWidth * 10.0);
             float baseGlowIntensity = exp(-bgGlowDist) * uBgGlow * 0.15;
             float spreadWeight = smoothstep(0.3, 1.0, t) * glowSpread;
             float curveWeight = exp(-pow((t - 0.5) * 3.0, 2.0)) * glowCurve;
             float glowWeight = spreadWeight + curveWeight;
             bgGlowAccum += rayColor * baseGlowIntensity * glowWeight;
        }
    }

    float yFade = smoothstep(0.0, 0.15, targetY);
    vec3 finalColor = finalColorAccum * yFade;
    finalColor += bgGlowAccum;

    vec2 centerUV = vUv - vec2(0.5);
    float vignette = 1.0 - smoothstep(0.7, 1.2, length(centerUV));
    finalColor *= vignette * 0.3 + 0.7;

    float alpha = max(max(finalColor.r, finalColor.g), finalColor.b);

    vec3 normalizedColor = finalColor / max(alpha, 0.001);

    alpha = smoothstep(0.0, 1.0, alpha);

    gl_FragColor = vec4(normalizedColor, alpha);
  }
`;

interface RaySceneProps {
  rayCount: number;
  rayWidth: number;
  pulseSpeed: number;
  pulseWidth: number;
  trailLength: number;
  motionBlur: number;
  bgGlow: number;
  color1: string;
  color2: string;
}

const RayScene: React.FC<RaySceneProps> = ({
  rayCount,
  rayWidth,
  pulseSpeed,
  pulseWidth,
  trailLength,
  motionBlur,
  bgGlow,
  color1,
  color2,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uRayCount: { value: rayCount },
      uRayWidth: { value: rayWidth },
      uPulseSpeed: { value: pulseSpeed },
      uPulseWidth: { value: pulseWidth },
      uTrailLength: { value: trailLength },
      uMotionBlur: { value: motionBlur },
      uBgGlow: { value: bgGlow },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uRayCount.value = rayCount;
      materialRef.current.uniforms.uRayWidth.value = rayWidth;
      materialRef.current.uniforms.uPulseSpeed.value = pulseSpeed;
      materialRef.current.uniforms.uPulseWidth.value = pulseWidth;
      materialRef.current.uniforms.uTrailLength.value = trailLength;
      materialRef.current.uniforms.uMotionBlur.value = motionBlur;
      materialRef.current.uniforms.uBgGlow.value = bgGlow;
      materialRef.current.uniforms.uColor1.value.set(color1);
      materialRef.current.uniforms.uColor2.value.set(color2);
    }
  });

  return (
    <mesh ref={ meshRef }>
      <planeGeometry args={ [viewport.width, viewport.height] } />
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

interface FallingRaysProps {
  color1?: string;
  color2?: string;
  rayCount?: number;
  rayWidth?: number;
  pulseSpeed?: number;
  pulseWidth?: number;
  trailLength?: number;
  motionBlur?: number;
  bgGlow?: number;
  className?: string;
  style?: React.CSSProperties;
}

const FallingRays: React.FC<FallingRaysProps> = ({
  color1 = '#1a00ff',
  color2 = '#ff0080',
  rayCount = 37,
  rayWidth = 0.005,
  pulseSpeed = 0.4,
  pulseWidth = 0.03,
  trailLength = 0.5,
  motionBlur = 0.3,
  bgGlow = 1.2,
  className = '',
  style,
}) => {
  return (
    <div className={ cn('relative h-full w-full overflow-hidden', className) } style={ { ...style } }>
      <Canvas
        orthographic
        camera={ { position: [0, 0, 1], zoom: 1 } }
        dpr={ [1, 2] }
        gl={ {
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        } }
        resize={ { scroll: false, debounce: 0 } }
      >
        <RayScene
          rayCount={ rayCount }
          rayWidth={ rayWidth }
          pulseSpeed={ pulseSpeed }
          pulseWidth={ pulseWidth }
          trailLength={ trailLength }
          motionBlur={ motionBlur }
          bgGlow={ bgGlow }
          color1={ color1 }
          color2={ color2 }
        />
      </Canvas>
    </div>
  );
};

export default FallingRays;

