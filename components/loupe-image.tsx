"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

export type LoupeImageMode = "lens" | "inline";
export type LoupeImageShape = "circle" | "rounded";
export type LoupeImageRim = "none" | "hairline" | "glass" | "solid";
export type LoupeImageReticle = "none" | "dot" | "cross" | "corners";
export type LoupeImageFit = "cover" | "contain";
export type LoupeImageWheel = "pinch" | "wheel" | "off";

export interface LoupeImageHandle {
  show: (x?: number, y?: number) => void;
  hide: () => void;
  setZoom: (zoom: number) => void;
}

export interface LoupeImageProps {
  src?: string;
  zoomSrc?: string;
  alt?: string;
  aspectRatio?: number | "auto";
  fit?: LoupeImageFit;
  focusX?: number;
  focusY?: number;
  radius?: number;
  mode?: LoupeImageMode;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  boost?: number;
  wheelZoom?: LoupeImageWheel;
  lensSize?: number;
  lensAspect?: number;
  shape?: LoupeImageShape;
  lensRadius?: number;
  rim?: LoupeImageRim;
  rimWidth?: number;
  rimColor?: string;
  backgroundColor?: string;
  shadow?: number;
  dim?: number;
  reticle?: LoupeImageReticle;
  showZoom?: boolean;
  smoothing?: number;
  overhang?: boolean;
  hideCursor?: boolean;
  touchOffset?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
  style?: CSSProperties;
}

interface Settings {
  mode: LoupeImageMode;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  boost: number;
  wheelZoom: LoupeImageWheel;
  lensSize: number;
  lensAspect: number;
  shape: LoupeImageShape;
  lensRadius: number;
  radius: number;
  dim: number;
  showZoom: boolean;
  smoothing: number;
  overhang: boolean;
  hideCursor: boolean;
  touchOffset: number;
  reduced: boolean;
}

interface Touch {
  id: number;
  x: number;
  y: number;
  time: number;
  active: boolean;
  timer: number;
}

interface Pinch {
  distance: number;
  level: number;
}

interface Controller {
  sync: () => void;
  show: (x?: number, y?: number) => void;
  hide: () => void;
  setZoom: (zoom: number) => void;
  destroy: () => void;
}

const MODES: LoupeImageMode[] = ["lens", "inline"];
const SHAPES: LoupeImageShape[] = ["circle", "rounded"];
const RIMS: LoupeImageRim[] = ["none", "hairline", "glass", "solid"];
const RETICLES: LoupeImageReticle[] = ["none", "dot", "cross", "corners"];
const WHEELS: LoupeImageWheel[] = ["pinch", "wheel", "off"];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const finite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

const defaultSrc = "https://pro.reactbits.dev/demo-media/effect-loupe-waldo-preview.webp";
const defaultZoomSrc = "https://pro.reactbits.dev/demo-media/effect-loupe-waldo.webp";

const subscribeToMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const readMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createLoupe(
  root: HTMLDivElement,
  settingsRef: { current: Settings },
  zoomRef: { current: (zoom: number) => void },
): Controller {
  const view = root.ownerDocument.defaultView ?? window;
  const part = (name: string) =>
    root.querySelector<HTMLElement>(`[data-loupe="${name}"]`);
  let lens = part("lens");
  let veil = part("veil");
  let chip = part("chip");
  let layers: HTMLImageElement[] = [];
  const watched: HTMLImageElement[] = [];
  const touches = new Map<number, { x: number; y: number }>();
  let width = 0;
  let height = 0;
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let shown = false;
  let vis = 0;
  let level = 1;
  let current = 1;
  let boosted = false;
  let raster = 0;
  let lensW = 0;
  let lensH = 0;
  let raf = 0;
  let last = 0;
  let chipTimer = 0;
  let lingerTimer = 0;
  let hover = false;
  let pressed: number | null = null;
  let touch: Touch | null = null;
  let pinch: Pinch | null = null;
  let destroyed = false;
  let zoomProp = Number.NaN;
  let structure = "";
  let chipText = "";

  const settings = () => settingsRef.current;

  const target = () => {
    const s = settings();
    const boost = boosted ? clamp(finite(s.boost, 2), 1, 4) : 1;
    return clamp(level * boost, 1, 40);
  };

  const local = (event: PointerEvent | MouseEvent) => {
    const box = root.getBoundingClientRect();
    const sx = box.width > 0 && width > 0 ? box.width / width : 1;
    const sy = box.height > 0 && height > 0 ? box.height / height : 1;
    return {
      x: (event.clientX - box.left) / sx,
      y: (event.clientY - box.top) / sy,
    };
  };

  const layout = () => {
    const s = settings();
    if (s.mode === "inline") {
      lensW = width;
      lensH = height;
      root.style.setProperty("--loupe-r", `${Math.max(0, finite(s.radius, 18))}px`);
    } else {
      const aspect = clamp(finite(s.lensAspect, 1), 0.25, 4);
      const h = clamp(finite(s.lensSize, 180), 40, 900);
      const w = h * aspect;
      const k = Math.min(
        1,
        Math.max(40, width * 0.62) / w,
        Math.max(40, height * 0.62) / h,
      );
      lensW = w * k;
      lensH = h * k;
      const r =
        s.shape === "circle"
          ? Math.min(lensW, lensH) / 2
          : Math.min(Math.max(0, finite(s.lensRadius, 18)), Math.min(lensW, lensH) / 2);
      root.style.setProperty("--loupe-r", `${r.toFixed(2)}px`);
    }
    for (const node of [lens, veil]) {
      if (!node) continue;
      node.style.width = `${lensW.toFixed(2)}px`;
      node.style.height = `${lensH.toFixed(2)}px`;
    }
    raster = 0;
  };

  const placeContent = (k: number, fx: number, fy: number, ax: number, ay: number) => {
    const need = Math.max(k, target(), 1);
    if (raster < need - 0.001 || raster > need * 1.6) {
      raster = Math.ceil(need * 2) / 2;
      for (const img of layers) {
        img.style.width = `${(width * raster).toFixed(1)}px`;
        img.style.height = `${(height * raster).toFixed(1)}px`;
      }
    }
    const transform = `translate3d(${(ax - fx * k).toFixed(2)}px,${(ay - fy * k).toFixed(2)}px,0) scale(${(k / raster).toFixed(5)})`;
    for (const img of layers) img.style.transform = transform;
  };

  const placeChip = (lx: number, ly: number, scale: number) => {
    if (!chip) return;
    const s = settings();
    if (s.mode === "inline") {
      chip.style.transform = `translate3d(${(width - 12).toFixed(1)}px,${(height - 12).toFixed(1)}px,0) translate(-100%,-100%)`;
      return;
    }
    const below = ly + (lensH / 2) * scale + 10;
    const flip = below + 30 > height && ly - (lensH / 2) * scale - 10 > 30;
    const y = flip ? ly - (lensH / 2) * scale - 10 : below;
    chip.style.transform = `translate3d(${lx.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,${flip ? "-100%" : "0"})`;
  };

  const render = () => {
    if (!lens || width <= 0 || height <= 0) return;
    const s = settings();
    const e = vis * vis * (3 - 2 * vis);
    if (s.mode === "inline") {
      const k = 1 + (current - 1) * e;
      lens.style.transform = "translate3d(0px,0px,0)";
      lens.style.opacity = e.toFixed(4);
      if (veil) veil.style.opacity = "0";
      placeContent(k, cx, cy, cx, cy);
      placeChip(0, 0, 1);
      return;
    }
    let lx = cx;
    let ly = cy;
    if (!s.overhang) {
      lx = clamp(cx, Math.min(lensW / 2, width / 2), Math.max(width - lensW / 2, width / 2));
      ly = clamp(cy, Math.min(lensH / 2, height / 2), Math.max(height - lensH / 2, height / 2));
    }
    const scale = 0.84 + 0.16 * e;
    const transform = `translate3d(${(lx - lensW / 2).toFixed(2)}px,${(ly - lensH / 2).toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    lens.style.transform = transform;
    lens.style.opacity = e.toFixed(4);
    if (veil) {
      veil.style.transform = transform;
      veil.style.opacity = (e * clamp(finite(s.dim, 0.25), 0, 1)).toFixed(4);
    }
    let fx = cx;
    let fy = cy;
    if (!s.overhang) {
      const hx = lensW / (2 * current);
      const hy = lensH / (2 * current);
      fx = clamp(cx, Math.min(hx, width / 2), Math.max(width - hx, width / 2));
      fy = clamp(cy, Math.min(hy, height / 2), Math.max(height - hy, height / 2));
    }
    placeContent(current, fx, fy, lensW / 2, lensH / 2);
    placeChip(lx, ly, scale);
  };

  const settled = () => {
    const goal = shown ? 1 : 0;
    return (
      Math.abs(tx - cx) < 0.05 &&
      Math.abs(ty - cy) < 0.05 &&
      vis === goal &&
      current === target()
    );
  };

  const frame = (time: number) => {
    raf = 0;
    if (destroyed) return;
    const dt =
      last && time - last < 100
        ? Math.min(Math.max((time - last) / 1000, 0), 0.05)
        : 1 / 60;
    last = time;
    const s = settings();
    const tau = s.reduced ? 0 : 0.012 + clamp(finite(s.smoothing, 0.35), 0, 1) * 0.2;
    const follow = tau > 0 ? 1 - Math.exp(-dt / tau) : 1;
    cx += (tx - cx) * follow;
    cy += (ty - cy) * follow;
    if (Math.abs(tx - cx) < 0.05) cx = tx;
    if (Math.abs(ty - cy) < 0.05) cy = ty;
    const goal = shown ? 1 : 0;
    const fade = s.reduced ? 1 : 1 - Math.exp(-dt / (shown ? 0.085 : 0.12));
    vis += (goal - vis) * fade;
    if (Math.abs(goal - vis) < 0.002) vis = goal;
    const z = target();
    const glide = s.reduced ? 1 : 1 - Math.exp(-dt / 0.13);
    current = Math.exp(Math.log(current) + (Math.log(z) - Math.log(current)) * glide);
    if (Math.abs(z - current) < 0.0008) current = z;
    render();
    if (!settled() && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const schedule = () => {
    if (!raf && !destroyed) raf = requestAnimationFrame(frame);
  };

  const showChip = () => {
    const s = settings();
    if (!chip || !s.showZoom) return;
    const z = target();
    const text = `${z < 9.95 ? z.toFixed(1) : Math.round(z)}×`;
    if (text !== chipText) {
      chipText = text;
      chip.textContent = text;
    }
    chip.style.opacity = "1";
    view.clearTimeout(chipTimer);
    chipTimer = view.setTimeout(() => {
      if (chip) chip.style.opacity = "0";
    }, 900);
  };

  const hideChip = () => {
    view.clearTimeout(chipTimer);
    if (chip) chip.style.opacity = "0";
  };

  const cursor = () => {
    const s = settings();
    root.style.cursor =
      shown && s.hideCursor && s.mode === "lens"
        ? "none"
        : s.mode === "inline"
          ? shown
            ? "zoom-out"
            : "zoom-in"
          : "";
  };

  const aim = (x: number, y: number, snap = false) => {
    const s = settings();
    const margin = s.overhang ? Math.max(lensW, lensH) * 0.5 : 0;
    tx = clamp(x, -margin, width + margin);
    ty = clamp(y, -margin, height + margin);
    if (snap || vis < 0.01) {
      cx = tx;
      cy = ty;
    }
    schedule();
  };

  const show = () => {
    view.clearTimeout(lingerTimer);
    if (!shown) {
      shown = true;
      cursor();
    }
    schedule();
  };

  const hide = () => {
    view.clearTimeout(lingerTimer);
    if (shown) {
      shown = false;
      boosted = false;
      cursor();
      hideChip();
    }
    schedule();
  };

  const linger = (ms: number) => {
    view.clearTimeout(lingerTimer);
    lingerTimer = view.setTimeout(() => {
      if (!hover && pressed === null && !touch?.active) hide();
    }, ms);
  };

  const setLevel = (next: number, notify = true) => {
    const s = settings();
    const min = clamp(finite(s.minZoom, 1.25), 1, 40);
    const max = Math.max(min, clamp(finite(s.maxZoom, 4), 1, 40));
    const value = clamp(next, min, max);
    if (Math.abs(value - level) < 0.0001) return;
    level = value;
    if (shown) showChip();
    if (notify) zoomRef.current(level);
    schedule();
  };

  const reveal = (img: HTMLImageElement) => {
    if (img.naturalWidth <= 0) return;
    const show = () => {
      if (img.hasAttribute("data-loupe-hi")) img.style.opacity = "1";
    };
    if (typeof img.decode === "function") img.decode().then(show, show);
    else show();
  };

  const onImage = (event: Event) => reveal(event.currentTarget as HTMLImageElement);

  const collect = () => {
    lens = part("lens");
    veil = part("veil");
    chip = part("chip");
    layers = lens
      ? Array.from(lens.querySelectorAll<HTMLImageElement>("[data-loupe-layer]"))
      : [];
    for (const img of layers) {
      if (!watched.includes(img)) {
        watched.push(img);
        img.addEventListener("load", onImage);
      }
      if (img.complete && img.naturalWidth > 0) reveal(img);
    }
    layout();
    render();
  };

  const measure = () => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (w <= 0 || h <= 0) return;
    if (Math.abs(w - width) < 0.5 && Math.abs(h - height) < 0.5) return;
    const fx = width > 0 ? cx / width : 0.5;
    const fy = height > 0 ? cy / height : 0.5;
    width = w;
    height = h;
    tx = cx = fx * width;
    ty = cy = fy * height;
    layout();
    render();
  };

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hover = true;
    const at = local(event);
    aim(at.x, at.y, !shown);
    show();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      if (touches.has(event.pointerId)) touches.set(event.pointerId, local(event));
      if (pinch && touches.size >= 2) {
        const [a, b] = Array.from(touches.values());
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        setLevel(pinch.level * (distance / Math.max(1, pinch.distance)));
        aim((a.x + b.x) / 2, (a.y + b.y) / 2 - offset());
        return;
      }
      if (!touch || event.pointerId !== touch.id) return;
      const at = local(event);
      if (!touch.active) {
        if (Math.hypot(at.x - touch.x, at.y - touch.y) > 8) {
          view.clearTimeout(touch.timer);
          touch = null;
        }
        return;
      }
      aim(at.x, at.y - offset());
      return;
    }
    hover = true;
    const at = local(event);
    aim(at.x, at.y);
    if (!shown) show();
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hover = false;
    if (pressed === null) hide();
  };

  const offset = () => {
    const s = settings();
    return s.mode === "inline" ? 0 : Math.max(0, finite(s.touchOffset, 72));
  };

  const activateTouch = () => {
    if (!touch) return;
    touch.active = true;
    aim(touch.x, touch.y - offset(), true);
    show();
  };

  const onPointerDown = (event: PointerEvent) => {
    const s = settings();
    if (event.pointerType === "touch") {
      touches.set(event.pointerId, local(event));
      if (touches.size === 2 && (touch?.active || shown)) {
        const [a, b] = Array.from(touches.values());
        pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y), level };
        if (touch) touch.active = true;
        return;
      }
      if (touch || !event.isPrimary) return;
      const at = local(event);
      touch = {
        id: event.pointerId,
        x: at.x,
        y: at.y,
        time: performance.now(),
        active: false,
        timer: view.setTimeout(activateTouch, 160),
      };
      return;
    }
    if (event.button !== 0 || pressed !== null) return;
    pressed = event.pointerId;
    root.setPointerCapture(event.pointerId);
    const at = local(event);
    hover = true;
    aim(at.x, at.y, !shown);
    show();
    if (s.mode === "lens" && finite(s.boost, 2) > 1.001) {
      boosted = true;
      showChip();
      schedule();
    }
  };

  const release = (event: PointerEvent, cancelled: boolean) => {
    if (event.pointerType === "touch") {
      touches.delete(event.pointerId);
      if (pinch && touches.size < 2) pinch = null;
      if (!touch || event.pointerId !== touch.id) return;
      view.clearTimeout(touch.timer);
      const quick = !touch.active && performance.now() - touch.time < 320;
      const was = touch.active;
      const at = { x: touch.x, y: touch.y };
      touch = null;
      if (cancelled) {
        if (was) hide();
        return;
      }
      if (was) linger(650);
      else if (quick) {
        aim(at.x, at.y - offset(), true);
        show();
        linger(1600);
      }
      return;
    }
    if (pressed !== event.pointerId) return;
    pressed = null;
    if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
    if (boosted) {
      boosted = false;
      showChip();
      schedule();
    }
    const box = root.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (!inside || cancelled) {
      hover = false;
      hide();
    }
  };

  const onPointerUp = (event: PointerEvent) => release(event, false);
  const onPointerCancel = (event: PointerEvent) => release(event, true);

  const onTouchMove = (event: TouchEvent) => {
    if ((touch?.active || pinch) && event.cancelable) event.preventDefault();
  };

  const onContextMenu = (event: MouseEvent) => {
    if (touch?.active || pinch) event.preventDefault();
  };

  const onWheel = (event: WheelEvent) => {
    const s = settings();
    if (!shown || s.wheelZoom === "off") return;
    if (s.wheelZoom === "pinch" && !event.ctrlKey) return;
    event.preventDefault();
    const delta = clamp(event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY, -60, 60);
    setLevel(level * Math.exp(-delta * 0.006));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target !== root) return;
    const step = (event.shiftKey ? 0.12 : 0.04) * Math.max(width, height);
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      if (!shown) aim(tx || width / 2, ty || height / 2, true);
      aim(clamp(tx + move[0], 0, width), clamp(ty + move[1], 0, height));
      show();
      return;
    }
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      show();
      setLevel(level * 1.25);
      return;
    }
    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      show();
      setLevel(level / 1.25);
      return;
    }
    if (event.key === "Escape") hide();
  };

  const onFocus = () => {
    let keyboard = true;
    try {
      keyboard = root.matches(":focus-visible");
    } catch {
      keyboard = true;
    }
    if (!keyboard || shown) return;
    aim(width / 2, height / 2, true);
    show();
  };

  const onBlur = () => {
    if (!hover && pressed === null && !touch) hide();
  };

  const onVisibility = () => {
    last = 0;
    if (!document.hidden && !settled()) schedule();
  };

  const resizeObserver = new ResizeObserver(measure);

  root.addEventListener("pointerenter", onPointerEnter);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerleave", onPointerLeave);
  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", onPointerCancel);
  root.addEventListener("touchmove", onTouchMove, { passive: false });
  root.addEventListener("contextmenu", onContextMenu);
  root.addEventListener("wheel", onWheel, { passive: false });
  root.addEventListener("keydown", onKeyDown);
  root.addEventListener("focus", onFocus);
  root.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onVisibility);

  const structureOf = (s: Settings) =>
    [s.mode, s.lensSize, s.lensAspect, s.shape, s.lensRadius, s.radius].join(",");

  const sync = () => {
    const s = settings();
    if (s.zoom !== zoomProp) {
      zoomProp = s.zoom;
      setLevel(finite(s.zoom, 2), false);
    } else setLevel(level, false);
    const next = structureOf(s);
    if (next !== structure) {
      structure = next;
      collect();
    } else {
      const fresh = lens
        ? Array.from(lens.querySelectorAll<HTMLImageElement>("[data-loupe-layer]"))
        : [];
      if (
        part("lens") !== lens ||
        fresh.length !== layers.length ||
        fresh.some((img, i) => img !== layers[i])
      )
        collect();
    }
    if (s.mode === "inline" && boosted) boosted = false;
    cursor();
    render();
    schedule();
  };

  measure();
  resizeObserver.observe(root);
  level = clamp(finite(settings().zoom, 2), 1, 40);
  current = level;
  zoomProp = settings().zoom;
  structure = structureOf(settings());
  collect();

  return {
    sync,
    show: (x, y) => {
      aim(
        (x === undefined ? 0.5 : clamp(x, 0, 1)) * width,
        (y === undefined ? 0.5 : clamp(y, 0, 1)) * height,
        !shown,
      );
      show();
    },
    hide,
    setZoom: (zoom) => setLevel(zoom),
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      view.clearTimeout(chipTimer);
      view.clearTimeout(lingerTimer);
      if (touch) view.clearTimeout(touch.timer);
      resizeObserver.disconnect();
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("contextmenu", onContextMenu);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("focus", onFocus);
      root.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const img of watched) img.removeEventListener("load", onImage);
      root.style.cursor = "";
    },
  };
}

const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const ring = (background: string, width: number): CSSProperties => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  padding: width,
  background,
  WebkitMaskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  WebkitMaskClip: "content-box, border-box",
  WebkitMaskComposite: "xor",
  maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  maskClip: "content-box, border-box",
  maskComposite: "exclude",
  pointerEvents: "none",
});

const mark = (style: CSSProperties, color: string): CSSProperties => ({
  position: "absolute",
  background: color,
  boxShadow: "0 0 0 0.5px rgb(0 0 0 / 0.35)",
  pointerEvents: "none",
  ...style,
});

const corner = (
  style: CSSProperties,
  sides: [boolean, boolean, boolean, boolean],
  color: string,
): CSSProperties => ({
  position: "absolute",
  width: "clamp(10px, 15%, 26px)",
  height: "clamp(10px, 15%, 26px)",
  borderStyle: "solid",
  borderColor: color,
  borderTopWidth: sides[0] ? 1.5 : 0,
  borderRightWidth: sides[1] ? 1.5 : 0,
  borderBottomWidth: sides[2] ? 1.5 : 0,
  borderLeftWidth: sides[3] ? 1.5 : 0,
  filter: "drop-shadow(0 0 0.5px rgb(0 0 0 / 0.5))",
  pointerEvents: "none",
  ...style,
});

export const LoupeImage = forwardRef<LoupeImageHandle, LoupeImageProps>(
  function LoupeImage(
    {
      src = defaultSrc,
      zoomSrc,
      alt = "Where’s Waldo? illustrated crowd scene",
      aspectRatio = "auto",
      fit = "cover",
      focusX = 50,
      focusY = 50,
      radius = 18,
      mode = "lens",
      zoom = 2,
      minZoom = 1.25,
      maxZoom = 4,
      boost = 2,
      wheelZoom = "pinch",
      lensSize = 180,
      lensAspect = 1,
      shape = "circle",
      lensRadius = 18,
      rim = "glass",
      rimWidth = 3,
      rimColor = "#FFFFFF",
      backgroundColor = "transparent",
      shadow = 0.6,
      dim = 0.25,
      reticle = "none",
      showZoom = true,
      smoothing = 0.35,
      overhang = false,
      hideCursor = true,
      touchOffset = 72,
      onZoomChange,
      className,
      style,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<HTMLImageElement>(null);
    const controllerRef = useRef<Controller | null>(null);
    const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);
    const hintId = useId();
    const [natural, setNatural] = useState<number | null>(null);
    const safeMode = MODES.includes(mode) ? mode : "lens";
    const safeShape = SHAPES.includes(shape) ? shape : "circle";
    const safeRim = RIMS.includes(rim) ? rim : "glass";
    const safeReticle = RETICLES.includes(reticle) ? reticle : "none";
    const safeWheel = WHEELS.includes(wheelZoom) ? wheelZoom : "pinch";
    const lensSrc = zoomSrc ?? (src === defaultSrc ? defaultZoomSrc : src);

    const settings: Settings = {
      mode: safeMode,
      zoom,
      minZoom,
      maxZoom,
      boost,
      wheelZoom: safeWheel,
      lensSize,
      lensAspect,
      shape: safeShape,
      lensRadius,
      radius,
      dim,
      showZoom,
      smoothing,
      overhang,
      hideCursor,
      touchOffset,
      reduced,
    };
    const settingsRef = useRef(settings);
    const zoomRef = useRef((value: number) => {
      onZoomChange?.(value);
    });

    useEffect(() => {
      settingsRef.current = settings;
      zoomRef.current = (value: number) => {
        onZoomChange?.(value);
      };
      controllerRef.current?.sync();
    });

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const controller = createLoupe(root, settingsRef, zoomRef);
      controllerRef.current = controller;
      return () => {
        controller.destroy();
        controllerRef.current = null;
      };
    }, []);

    useEffect(() => {
      const img = baseRef.current;
      if (aspectRatio !== "auto" || !img) return;
      const read = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0)
          setNatural(img.naturalWidth / img.naturalHeight);
      };
      read();
      img.addEventListener("load", read);
      return () => img.removeEventListener("load", read);
    }, [aspectRatio, src]);

    useImperativeHandle(
      ref,
      () => ({
        show: (x?: number, y?: number) => controllerRef.current?.show(x, y),
        hide: () => controllerRef.current?.hide(),
        setZoom: (value: number) => controllerRef.current?.setZoom(value),
      }),
      [],
    );

    const ratio =
      aspectRatio === "auto"
        ? (natural ?? 1.5)
        : clamp(finite(aspectRatio, 1.5), 0.2, 5);
    const backgroundValue = backgroundColor.trim().toLowerCase();
    const transparent =
      backgroundValue === "transparent" || backgroundValue === "";
    const fill = transparent ? undefined : backgroundColor;
    const position = `${clamp(finite(focusX, 50), 0, 100)}% ${clamp(finite(focusY, 50), 0, 100)}%`;
    const amount = clamp(finite(shadow, 0.6), 0, 1);
    const band = clamp(finite(rimWidth, 3), 0.5, 24);
    const lensMode = safeMode === "lens";
    const tint = (percent: number) =>
      `color-mix(in oklch, ${rimColor} ${percent}%, transparent)`;
    const layerStyle: CSSProperties = {
      position: "absolute",
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      maxWidth: "none",
      objectFit: fit,
      objectPosition: position,
      transformOrigin: "0 0",
      willChange: "transform",
      pointerEvents: "none",
      userSelect: "none",
    };

    return (
      <div
        ref={rootRef}
        role="group"
        tabIndex={0}
        aria-label={alt}
        aria-describedby={hintId}
        className={cn(
          "relative isolate w-full select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color-mix(in_oklch,currentColor_45%,transparent)]",
          className,
        )}
        style={{
          aspectRatio: ratio,
          borderRadius: Math.max(0, finite(radius, 18)),
          touchAction: "pan-y",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            borderRadius: "inherit",
            background: fill,
          }}
        >
          <img
            ref={baseRef}
            src={src}
            alt={alt}
            draggable={false}
            decoding="async"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: fit,
              objectPosition: position,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
          {lensMode ? (
            <div
              data-loupe="veil"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                borderRadius: "var(--loupe-r, 50%)",
                boxShadow: "0 0 0 300vmax rgb(0 0 0 / 0.62)",
                opacity: 0,
                transformOrigin: "50% 50%",
                willChange: "transform, opacity",
                pointerEvents: "none",
              }}
            />
          ) : null}
        </div>
        <div
          data-loupe="lens"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            width: 0,
            height: 0,
            overflow: "hidden",
            borderRadius: "var(--loupe-r, 50%)",
            background: fill,
            boxShadow:
              lensMode && amount > 0
                ? `0 1px 2px rgb(0 0 0 / ${(0.25 * amount).toFixed(3)}), 0 10px 24px -6px rgb(0 0 0 / ${(0.35 * amount).toFixed(3)}), 0 28px 60px -18px rgb(0 0 0 / ${(0.5 * amount).toFixed(3)})`
                : "none",
            opacity: 0,
            transformOrigin: "50% 50%",
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        >
          <img
            data-loupe-layer=""
            src={src}
            alt=""
            draggable={false}
            decoding="async"
            style={layerStyle}
          />
          {lensSrc !== src ? (
            <img
              data-loupe-layer=""
              data-loupe-hi=""
              src={lensSrc}
              alt=""
              draggable={false}
              decoding="async"
              style={{ ...layerStyle, opacity: 0, transition: "opacity 0.35s ease" }}
            />
          ) : null}
          {lensMode && safeRim === "glass" ? (
            <>
              <span
                style={ring(
                  `linear-gradient(150deg, ${tint(95)} 0%, ${tint(38)} 28%, ${tint(12)} 52%, ${tint(30)} 78%, ${tint(70)} 100%)`,
                  band,
                )}
              />
              <span
                style={{
                  position: "absolute",
                  inset: band,
                  borderRadius: `calc(var(--loupe-r, 50%) - ${band}px)`,
                  boxShadow:
                    "inset 0 2px 9px rgb(0 0 0 / 0.38), inset 1.5px 2px 0 -0.5px rgb(255 255 255 / 0.35), inset -1px -1.5px 0 -0.5px rgb(0 0 0 / 0.3)",
                  pointerEvents: "none",
                }}
              />
            </>
          ) : null}
          {lensMode && safeRim === "solid" ? (
            <>
              <span style={ring(rimColor, band)} />
              <span
                style={{
                  position: "absolute",
                  inset: band,
                  borderRadius: `calc(var(--loupe-r, 50%) - ${band}px)`,
                  boxShadow: "inset 0 1px 6px rgb(0 0 0 / 0.3)",
                  pointerEvents: "none",
                }}
              />
            </>
          ) : null}
          {lensMode && safeRim === "hairline" ? (
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                boxShadow: `inset 0 0 0 1px ${tint(72)}, inset 0 1px 7px rgb(0 0 0 / 0.25)`,
                pointerEvents: "none",
              }}
            />
          ) : null}
          {lensMode && safeReticle === "dot" ? (
            <span
              style={mark(
                {
                  left: "50%",
                  top: "50%",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  transform: "translate(-50%,-50%)",
                },
                rimColor,
              )}
            />
          ) : null}
          {lensMode && safeReticle === "cross" ? (
            <>
              <span style={mark({ left: "calc(36% - 6px)", top: "50%", width: "14%", height: 1, transform: "translateY(-50%)" }, rimColor)} />
              <span style={mark({ left: "calc(50% + 6px)", top: "50%", width: "14%", height: 1, transform: "translateY(-50%)" }, rimColor)} />
              <span style={mark({ top: "calc(36% - 6px)", left: "50%", height: "14%", width: 1, transform: "translateX(-50%)" }, rimColor)} />
              <span style={mark({ top: "calc(50% + 6px)", left: "50%", height: "14%", width: 1, transform: "translateX(-50%)" }, rimColor)} />
            </>
          ) : null}
          {lensMode && safeReticle === "corners" ? (
            <>
              <span style={corner({ left: "16%", top: "16%" }, [true, false, false, true], rimColor)} />
              <span style={corner({ right: "16%", top: "16%" }, [true, true, false, false], rimColor)} />
              <span style={corner({ right: "16%", bottom: "16%" }, [false, true, true, false], rimColor)} />
              <span style={corner({ left: "16%", bottom: "16%" }, [false, false, true, true], rimColor)} />
            </>
          ) : null}
        </div>
        <div
          data-loupe="chip"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2,
            padding: "4px 8px",
            borderRadius: 8,
            background: "rgb(10 10 10 / 0.7)",
            color: "#FFFFFF",
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            opacity: 0,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
          }}
        />
        <span id={hintId} style={visuallyHidden}>
          Move the pointer or use the arrow keys to move the loupe. Plus and minus change the zoom.
        </span>
      </div>
    );
  },
);

LoupeImage.displayName = "LoupeImage";

export default LoupeImage;
