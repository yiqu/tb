// 'use client';

// import * as THREE from 'three';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { useRef, useMemo, useState, useEffect, useCallback, type ReactNode, useSyncExternalStore } from 'react';

// import { cn } from '@/lib/utils';

// export interface AuroraBeamProps {
//   /** How fast the curtains travel */
//   speed?: number;
//   /** Number of stacked light sheets */
//   sheets?: number;
//   /** Height of the travelling wave that shapes each sheet */
//   amplitude?: number;
//   /** Spatial frequency of that wave */
//   frequency?: number;
//   /** Half height of a sheet at full brightness */
//   thickness?: number;
//   /** Vertical softness of the upward streak */
//   tail?: number;
//   /** Vertical centre of the beam, -0.5 to 0.5 */
//   position?: number;
//   /** Diagonal lean applied across the beam */
//   slant?: number;
//   /** Vertical separation between consecutive sheets */
//   spread?: number;
//   /** Strength of the vertical striations, 0 to 1 */
//   rays?: number;
//   /** Spatial frequency of the striations */
//   rayScale?: number;
//   /** How fast the striations drift sideways */
//   rayDrift?: number;
//   /** How strongly the envelope model modulates the beam, 0 to 1 */
//   reactivity?: number;
//   /** Overall brightness before tone mapping */
//   gain?: number;
//   /** Tone mapping headroom, higher keeps more of the falloff */
//   exposure?: number;
//   /** Tone response curve, above 1 deepens the shadows */
//   contrast?: number;
//   /** First palette colour */
//   color?: string;
//   /** Second palette colour */
//   midColor?: string;
//   /** Third palette colour */
//   deepColor?: string;
//   /** How fast the palette travels through the sheets */
//   hueDrift?: number;
//   /** Film grain strength, 0 to 1 */
//   grain?: number;
//   /** Grain cell size in CSS pixels */
//   grainSize?: number;
//   /** Grain refreshes per second */
//   grainRate?: number;
//   /** Panel backdrop, or "transparent" to show the page through */
//   backgroundColor?: string;
//   /** Master alpha */
//   opacity?: number;
//   /** Let the pointer sway the curtains */
//   cursorInteraction?: boolean;
//   /** How far the pointer sways the curtains, 0 to 1 */
//   cursorSway?: number;
//   /** Freeze the animation */
//   paused?: boolean;
//   /** Scale back resolution when the frame budget slips */
//   adaptiveQuality?: boolean;
//   /** Frame rate the quality meter aims to hold */
//   targetFps?: number;
//   /** Upper device pixel ratio bound */
//   dpr?: number;
//   className?: string;
//   children?: ReactNode;
// }

// const beamVertex = `
// varying vec2 vPlane;

// void main() {
//   vPlane = uv;
//   gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
// }
// `;

// const buildBeamFragment = (sheets: number) => `
// precision highp float;

// varying vec2 vPlane;

// uniform vec2 uCanvas;
// uniform float uClock;
// uniform float uSpeed;
// uniform float uAmplitude;
// uniform float uFrequency;
// uniform float uThickness;
// uniform float uTail;
// uniform float uSeat;
// uniform float uSlant;
// uniform float uSpread;
// uniform float uRays;
// uniform float uRayScale;
// uniform float uRayDrift;
// uniform float uReact;
// uniform float uGain;
// uniform float uExposure;
// uniform float uContrast;
// uniform float uHueDrift;
// uniform float uGrain;
// uniform float uGrainSize;
// uniform float uGrainRate;
// uniform vec3 uTintA;
// uniform vec3 uTintB;
// uniform vec3 uTintC;
// uniform vec3 uBackdrop;
// uniform float uBackdropAlpha;
// uniform float uOpacity;
// uniform vec2 uSway;

// float scatter(vec3 seed) {
//   vec3 wobble = fract(seed * vec3(0.1031, 0.1030, 0.0973));
//   wobble += dot(wobble, wobble.yxz + 33.33);
//   return fract((wobble.x + wobble.y) * wobble.z);
// }

// float silver(vec2 cell, float tick) {
//   float a = scatter(vec3(cell, tick));
//   float b = scatter(vec3(cell.yx + 41.7, tick + 19.3));
//   return a + b - 1.0;
// }

// vec3 softClip(vec3 x) {
//   vec3 fall = exp(-2.0 * max(x, 0.0));
//   return (1.0 - fall) / (1.0 + fall);
// }

// vec4 envelopes(float t) {
//   vec4 rate = vec4(1.73, 2.41, 3.07, 0.87);
//   vec4 skew = vec4(0.0, 1.15, 2.4, 0.6);
//   vec4 broad = 0.5 + 0.5 * sin(t * rate + skew);
//   vec4 fine = 0.5 + 0.5 * sin(t * rate * 2.7 + skew * 1.9);
//   return mix(broad, broad * fine, 0.35);
// }

// float bandGain(float x, float t) {
//   float tilt = exp(-x * 1.9) + 0.22 * exp(-abs(x - 0.62) * 6.0);
//   float comb = 0.62 + 0.38 * sin(x * 18.0 - t * 4.0 + sin(x * 7.0));
//   return clamp(tilt * comb, 0.0, 1.6);
// }

// float ripple(float x, float t) {
//   return sin(x * 21.0 + t * 5.4) * 0.42 + sin(x * 34.0 - t * 3.1) * 0.24;
// }

// vec3 palette(float h) {
//   float w = fract(h) * 3.0;
//   vec3 warm = mix(uTintA, uTintB, smoothstep(0.0, 1.0, clamp(w, 0.0, 1.0)));
//   vec3 cool = mix(warm, uTintC, smoothstep(0.0, 1.0, clamp(w - 1.0, 0.0, 1.0)));
//   return mix(cool, uTintA, smoothstep(0.0, 1.0, clamp(w - 2.0, 0.0, 1.0)));
// }

// void main() {
//   vec2 pixel = vPlane * uCanvas;
//   vec2 field = (pixel - 0.5 * uCanvas) / max(uCanvas.y, 1.0);

//   float clock = uClock * uSpeed;
//   vec4 env = mix(vec4(1.0), envelopes(clock), clamp(uReact, 0.0, 1.0));

//   float lateral = field.x + uSway.x * 0.35;
//   float span = clamp(lateral * 0.5 + 0.5, 0.0, 1.0);
//   float tone = bandGain(span, clock);

//   vec3 glow = vec3(0.0);

//   for (int i = 0; i < ${sheets}; i++) {
//     float lane = (float(i) + 0.5) / float(${sheets});
//     float turn = lane * 6.2831853;

//     float march = lateral * uFrequency + clock * 0.6 + turn * 1.7;
//     float ridge =
//       sin(march) * 0.55 +
//       sin(march * 0.53 + turn) * 0.3 +
//       sin(march * 2.17 - clock * 0.9) * 0.15;
//     ridge += ripple(lateral, clock) * env.z * 0.22;

//     float lift = mix(0.65, 1.25, lane) * (0.7 + 0.6 * env.y);
//     float spine =
//       uSeat +
//       uSway.y * 0.25 +
//       uSlant * lateral +
//       ridge * uAmplitude * lift +
//       (lane - 0.5) * uSpread;

//     float gap = field.y - spine;
//     float girth = max(uThickness * mix(0.55, 1.35, lane) * (0.75 + 0.5 * env.x) * tone, 1e-4);

//     float core = girth * girth / (gap * gap + girth * girth);
//     float above = max(gap, 0.0);
//     float below = max(-gap, 0.0);
//     float veil = exp(-above / max(uTail, 1e-3)) * exp(-below / (girth * 2.5));

//     float streak =
//       1.0 - uRays +
//       uRays * (0.5 + 0.5 * sin(lateral * uRayScale + turn * 3.1 + clock * uRayDrift));

//     float sheet = (core * 0.85 + veil * 0.55) * streak;
//     sheet *= 0.6 + 0.7 * env.w;

//     float hue = lane + span * 0.28 + clock * uHueDrift * 0.05;
//     glow += palette(hue) * sheet;
//   }

//   vec3 raw = glow * uGain / max(uExposure, 0.05);
//   vec3 col = softClip(raw);
//   col = pow(clamp(col, 0.0, 1.0), vec3(max(uContrast, 0.05)));

//   float cover = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);

//   vec2 cell = floor(pixel / max(uGrainSize, 1.0));
//   float tick = floor(uClock * max(uGrainRate, 1.0));
//   float speck = silver(cell, tick) + silver(cell * 0.5 + 7.0, tick) * 0.5;
//   float response = cover * (1.0 - cover) * 4.0;
//   float dust = 1.0 + speck * uGrain * response * 1.6;
//   col = clamp(col * dust, 0.0, 1.0);
//   cover = clamp(cover * dust, 0.0, 1.0);

//   float rest = uBackdropAlpha * (1.0 - cover);
//   gl_FragColor = vec4(col + uBackdrop * rest, cover + rest) * uOpacity;
// }
// `;

// const literal = (hex: string, fallback: string) => {
//   const shade = new THREE.Color();
//   try {
//     shade.setStyle(hex, THREE.LinearSRGBColorSpace);
//   } catch {
//     shade.setStyle(fallback, THREE.LinearSRGBColorSpace);
//   }
//   return shade;
// };

// const repaint = (target: THREE.Color, hex: string) => {
//   try {
//     target.setStyle(hex, THREE.LinearSRGBColorSpace);
//   } catch {
//     return;
//   }
// };

// const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

// const subscribeToScreen = (notify: () => void) => {
//   if (typeof window === 'undefined') return () => {};
//   const media = window.matchMedia('(min-resolution: 2dppx)');
//   media.addEventListener('change', notify);
//   window.addEventListener('resize', notify);
//   return () => {
//     media.removeEventListener('change', notify);
//     window.removeEventListener('resize', notify);
//   };
// };

// const readScreenDpr = () => (typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);

// const isClear = (paint: string) => paint === 'transparent' || paint === 'none' || paint === '';

// interface PointerState {
//   x: number;
//   y: number;
// }

// interface BeamFieldProps {
//   speed: number;
//   sheets: number;
//   amplitude: number;
//   frequency: number;
//   thickness: number;
//   tail: number;
//   position: number;
//   slant: number;
//   spread: number;
//   rays: number;
//   rayScale: number;
//   rayDrift: number;
//   reactivity: number;
//   gain: number;
//   exposure: number;
//   contrast: number;
//   color: string;
//   midColor: string;
//   deepColor: string;
//   hueDrift: number;
//   grain: number;
//   grainSize: number;
//   grainRate: number;
//   backgroundColor: string;
//   opacity: number;
//   cursorInteraction: boolean;
//   cursorSway: number;
//   paused: boolean;
//   adaptiveQuality: boolean;
//   targetFps: number;
//   ceiling: number;
//   readPointer: () => PointerState;
// }

// const BeamField = ({
//   speed,
//   sheets,
//   amplitude,
//   frequency,
//   thickness,
//   tail,
//   position,
//   slant,
//   spread,
//   rays,
//   rayScale,
//   rayDrift,
//   reactivity,
//   gain,
//   exposure,
//   contrast,
//   color,
//   midColor,
//   deepColor,
//   hueDrift,
//   grain,
//   grainSize,
//   grainRate,
//   backgroundColor,
//   opacity,
//   cursorInteraction,
//   cursorSway,
//   paused,
//   adaptiveQuality,
//   targetFps,
//   ceiling,
//   readPointer,
// }: BeamFieldProps) => {
//   const materialRef = useRef<THREE.ShaderMaterial>(null);
//   const clock = useRef(0);
//   const glide = useRef({ x: 0.5, y: 0.5 });
//   const budget = useRef({ frames: 0, span: 0, wins: 0, cap: 4 });
//   const { gl, size } = useThree();

//   const lanes = Math.round(clamp(sheets, 1, 16));

//   const fragment = useMemo(() => buildBeamFragment(lanes), [lanes]);

//   const uniforms = useMemo(
//     () => ({
//       uCanvas: { value: new THREE.Vector2(1, 1) },
//       uClock: { value: 0 },
//       uSpeed: { value: 1 },
//       uAmplitude: { value: 0.12 },
//       uFrequency: { value: 3.2 },
//       uThickness: { value: 0.05 },
//       uTail: { value: 0.22 },
//       uSeat: { value: 0 },
//       uSlant: { value: 0.1 },
//       uSpread: { value: 0.16 },
//       uRays: { value: 0.45 },
//       uRayScale: { value: 26 },
//       uRayDrift: { value: 0.8 },
//       uReact: { value: 0.7 },
//       uGain: { value: 1.5 },
//       uExposure: { value: 2.4 },
//       uContrast: { value: 1 },
//       uHueDrift: { value: 1 },
//       uGrain: { value: 0.05 },
//       uGrainSize: { value: 1 },
//       uGrainRate: { value: 24 },
//       uTintA: { value: literal('#34d399', '#34d399') },
//       uTintB: { value: literal('#22d3ee', '#22d3ee') },
//       uTintC: { value: literal('#a78bfa', '#a78bfa') },
//       uBackdrop: { value: literal('#0a0a0a', '#0a0a0a') },
//       uBackdropAlpha: { value: 1 },
//       uOpacity: { value: 1 },
//       uSway: { value: new THREE.Vector2(0, 0) },
//     }),
//     [],
//   );

//   useEffect(() => {
//     const material = materialRef.current;
//     if (!material) return;
//     material.fragmentShader = fragment;
//     material.needsUpdate = true;
//   }, [fragment]);

//   useEffect(() => {
//     const material = materialRef.current;
//     if (!material) return;
//     repaint(material.uniforms.uTintA.value, color);
//     repaint(material.uniforms.uTintB.value, midColor);
//     repaint(material.uniforms.uTintC.value, deepColor);
//     const clear = isClear(backgroundColor);
//     material.uniforms.uBackdropAlpha.value = clear ? 0 : 1;
//     if (!clear) repaint(material.uniforms.uBackdrop.value, backgroundColor);
//   }, [color, midColor, deepColor, backgroundColor]);

//   useFrame((_, delta) => {
//     const material = materialRef.current;
//     if (!material) return;

//     const beat = Math.min(delta, 0.05);
//     if (!paused) clock.current += beat;

//     const ratio = gl.getPixelRatio();
//     const set = material.uniforms;
//     set.uCanvas.value.set(size.width * ratio, size.height * ratio);
//     set.uClock.value = clock.current;
//     set.uSpeed.value = speed;
//     set.uAmplitude.value = amplitude;
//     set.uFrequency.value = frequency;
//     set.uThickness.value = Math.max(thickness, 0.002);
//     set.uTail.value = Math.max(tail, 0.01);
//     set.uSeat.value = position;
//     set.uSlant.value = slant;
//     set.uSpread.value = spread;
//     set.uRays.value = rays;
//     set.uRayScale.value = rayScale;
//     set.uRayDrift.value = rayDrift;
//     set.uReact.value = reactivity;
//     set.uGain.value = gain;
//     set.uExposure.value = exposure;
//     set.uContrast.value = contrast;
//     set.uHueDrift.value = hueDrift;
//     set.uGrain.value = grain;
//     set.uGrainSize.value = Math.max(grainSize, 1) * ratio;
//     set.uGrainRate.value = grainRate;
//     set.uOpacity.value = opacity;

//     if (cursorInteraction) {
//       const pointer = readPointer();
//       const ease = 1 - Math.exp(-beat * 4);
//       glide.current.x += (pointer.x - glide.current.x) * ease;
//       glide.current.y += (pointer.y - glide.current.y) * ease;
//       set.uSway.value.set((glide.current.x - 0.5) * cursorSway, (glide.current.y - 0.5) * cursorSway);
//     } else {
//       set.uSway.value.set(0, 0);
//     }

//     if (!adaptiveQuality) return;
//     const meter = budget.current;
//     meter.frames += 1;
//     meter.span += delta;
//     if (meter.span < 0.75) return;
//     const fps = meter.frames / meter.span;
//     meter.frames = 0;
//     meter.span = 0;
//     const roof = Math.min(ceiling, meter.cap);
//     if (fps < targetFps * 0.85 && ratio > 0.6) {
//       meter.wins = 0;
//       meter.cap = Math.max(0.6, ratio * 0.9);
//       gl.setPixelRatio(Math.max(0.6, ratio * 0.75));
//     } else if (fps > targetFps * 0.98 && ratio < roof - 0.01) {
//       meter.wins += 1;
//       if (meter.wins >= 3) {
//         meter.wins = 0;
//         gl.setPixelRatio(Math.min(roof, ratio * 1.25));
//       }
//     } else {
//       meter.wins = 0;
//     }
//   });

//   return (
//     <mesh frustumCulled={ false }>
//       <planeGeometry args={ [1, 1] } />
//       <shaderMaterial
//         ref={ materialRef }
//         vertexShader={ beamVertex }
//         fragmentShader={ fragment }
//         uniforms={ uniforms }
//         transparent
//         depthTest={ false }
//         depthWrite={ false }
//         premultipliedAlpha
//       />
//     </mesh>
//   );
// };

// export const AuroraBeam = ({
//   speed = 1,
//   sheets = 5,
//   amplitude = 0.12,
//   frequency = 3.2,
//   thickness = 0.05,
//   tail = 0.22,
//   position = 0,
//   slant = 0.1,
//   spread = 0.16,
//   rays = 0.45,
//   rayScale = 26,
//   rayDrift = 0.8,
//   reactivity = 0.7,
//   gain = 1.5,
//   exposure = 2.4,
//   contrast = 1,
//   color = '#34d399',
//   midColor = '#22d3ee',
//   deepColor = '#a78bfa',
//   hueDrift = 1,
//   grain = 0.05,
//   grainSize = 1,
//   grainRate = 24,
//   backgroundColor = '#0a0a0a',
//   opacity = 1,
//   cursorInteraction = true,
//   cursorSway = 0.5,
//   paused = false,
//   adaptiveQuality = true,
//   targetFps = 60,
//   dpr = 1.75,
//   className,
//   children,
// }: AuroraBeamProps) => {
//   const shell = useRef<HTMLDivElement>(null);
//   const pointer = useRef<PointerState>({ x: 0.5, y: 0.5 });
//   const [awake, setAwake] = useState(true);

//   const screenDpr = useSyncExternalStore(subscribeToScreen, readScreenDpr, () => 1);
//   const ceiling = Math.min(screenDpr, Math.max(dpr, 0.5));

//   const readPointer = useCallback(() => pointer.current, []);

//   useEffect(() => {
//     const node = shell.current;
//     if (!node || typeof IntersectionObserver === 'undefined') return;
//     const watcher = new IntersectionObserver(([entry]) => setAwake(entry.isIntersecting), { threshold: 0 });
//     watcher.observe(node);
//     return () => watcher.disconnect();
//   }, []);

//   useEffect(() => {
//     const node = shell.current;
//     if (!node || !cursorInteraction) return;

//     const track = (event: PointerEvent) => {
//       const box = node.getBoundingClientRect();
//       if (!box.width || !box.height) return;
//       pointer.current.x = clamp((event.clientX - box.left) / box.width, 0, 1);
//       pointer.current.y = clamp(1 - (event.clientY - box.top) / box.height, 0, 1);
//     };

//     const reset = () => {
//       pointer.current.x = 0.5;
//       pointer.current.y = 0.5;
//     };

//     node.addEventListener('pointermove', track);
//     node.addEventListener('pointerleave', reset);
//     return () => {
//       node.removeEventListener('pointermove', track);
//       node.removeEventListener('pointerleave', reset);
//     };
//   }, [cursorInteraction]);

//   return (
//     <div ref={ shell } className={ cn('relative overflow-hidden', className) }>
//       <div className="absolute inset-0">
//         <Canvas
//           orthographic
//           dpr={ ceiling }
//           frameloop={ awake ? 'always' : 'demand' }
//           gl={ {
//             antialias: false,
//             alpha: true,
//             powerPreference: 'high-performance',
//           } }
//         >
//           <BeamField
//             speed={ speed }
//             sheets={ sheets }
//             amplitude={ amplitude }
//             frequency={ frequency }
//             thickness={ thickness }
//             tail={ tail }
//             position={ position }
//             slant={ slant }
//             spread={ spread }
//             rays={ rays }
//             rayScale={ rayScale }
//             rayDrift={ rayDrift }
//             reactivity={ reactivity }
//             gain={ gain }
//             exposure={ exposure }
//             contrast={ contrast }
//             color={ color }
//             midColor={ midColor }
//             deepColor={ deepColor }
//             hueDrift={ hueDrift }
//             grain={ grain }
//             grainSize={ grainSize }
//             grainRate={ grainRate }
//             backgroundColor={ backgroundColor }
//             opacity={ opacity }
//             cursorInteraction={ cursorInteraction }
//             cursorSway={ cursorSway }
//             paused={ paused }
//             adaptiveQuality={ adaptiveQuality }
//             targetFps={ targetFps }
//             ceiling={ ceiling }
//             readPointer={ readPointer }
//           />
//         </Canvas>
//       </div>
//       { children ?
//         <div className="relative z-10 h-full w-full">{ children }</div>
//       : null }
//     </div>
//   );
// };

// export default AuroraBeam;

