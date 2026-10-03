/**
 * Gester för kartan med Pointer Events (docs/teknisk-profil.md §6.3): en pekare
 * panorerar, två nyper, dubbeltryck zoomar ×2 och mushjulet zoomar runt pekaren.
 * Matematiken finns i transform.ts. Här finns bara DOM och händelser.
 */
import {
	clamp,
	centerY,
	fitAll,
	fitBox,
	focusBox,
	pan,
	pinch,
	zoomAround,
	type Box,
	type Frame,
	type Point,
	type Transform
} from './transform.ts';

export type PanZoomOptions = {
	frame: () => Frame;
	/** Ett tryck utan förflyttning. `target` är elementet där fingret landade. */
	onTap: (target: Element, clientX: number, clientY: number) => void;
	/** Användaren har panorerat eller zoomat själv */
	onGesture?: () => void;
};

/** Förflyttning i px innan ett tryck räknas som en panorering */
const TAP_SLOP = 6;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_SLOP = 30;
const EASE = 'transform .5s var(--ease)';

type Gesture =
	| { mode: 'pan'; start: Point; t0: Transform; moved: boolean; target: Element | null }
	| { mode: 'pinch'; d0: number; mid0: Point; t0: Transform };

export class PanZoom {
	t: Transform = { x: 0, y: 0, s: 1 };

	#viewport: HTMLElement;
	#map: HTMLElement;
	#options: PanZoomOptions;
	#pointers = new Map<number, Point>();
	#gesture: Gesture | null = null;
	#lastTap: { time: number; p: Point } | null = null;

	constructor(viewport: HTMLElement, map: HTMLElement, options: PanZoomOptions) {
		this.#viewport = viewport;
		this.#map = map;
		this.#options = options;
		viewport.addEventListener('pointerdown', this.#down);
		viewport.addEventListener('wheel', this.#wheel, { passive: false });
		window.addEventListener('pointermove', this.#move);
		window.addEventListener('pointerup', this.#up);
		window.addEventListener('pointercancel', this.#up);
	}

	destroy() {
		this.#viewport.removeEventListener('pointerdown', this.#down);
		this.#viewport.removeEventListener('wheel', this.#wheel);
		window.removeEventListener('pointermove', this.#move);
		window.removeEventListener('pointerup', this.#up);
		window.removeEventListener('pointercancel', this.#up);
	}

	get #frame() {
		return this.#options.frame();
	}

	set(t: Transform, animate: boolean) {
		const f = this.#frame;
		this.t = clamp(f, t);
		const { x, y, s } = this.t;
		const style = this.#map.style;
		style.width = `${f.mapWidth}px`;
		style.height = `${f.mapHeight}px`;
		style.transition = animate ? EASE : 'none';
		style.transform = `translate(${x}px,${y}px) scale(${s})`;
		this.#map.dataset.ready = '';
	}

	/** Begränsar om transformen, t.ex. när ett ark ändrar den fria ytan. */
	refresh(animate: boolean) {
		this.set(this.t, animate);
	}

	fitAll(animate = true) {
		this.set(fitAll(this.#frame), animate);
	}

	fitBox(box: Box) {
		this.set(fitBox(this.#frame, box), true);
	}

	focusBox(box: Box, animate = true) {
		this.set(focusBox(this.#frame, box, this.t), animate);
	}

	/** Zoom kring mitten av den fria ytan (knapparna och tangentbordet) */
	zoomBy(factor: number) {
		const f = this.#frame;
		this.set(zoomAround(f, this.t, factor, { x: f.width / 2, y: centerY(f) }), true);
	}

	panBy(dx: number, dy: number) {
		this.set(pan(this.#frame, this.t, dx, dy), true);
	}

	/** Rektangeln som elementen täcker, i kartans koordinater vid skala 1 */
	boxOf(elements: Iterable<Element>): Box | null {
		const mr = this.#map.getBoundingClientRect();
		const k = mr.width / this.#frame.mapWidth;
		let box: Box | null = null;
		for (const el of elements) {
			const r = el.getBoundingClientRect();
			const b = {
				x0: (r.left - mr.left) / k,
				y0: (r.top - mr.top) / k,
				x1: (r.right - mr.left) / k,
				y1: (r.bottom - mr.top) / k
			};
			box = box
				? {
						x0: Math.min(box.x0, b.x0),
						y0: Math.min(box.y0, b.y0),
						x1: Math.max(box.x1, b.x1),
						y1: Math.max(box.y1, b.y1)
					}
				: b;
		}
		return box;
	}

	#point(e: { clientX: number; clientY: number }): Point {
		const r = this.#viewport.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	}

	/** Stannar en pågående animation där den är just nu, så att gesten tar vid därifrån. */
	#freeze() {
		const mr = this.#map.getBoundingClientRect();
		const vr = this.#viewport.getBoundingClientRect();
		if (mr.width) {
			this.t = { x: mr.left - vr.left, y: mr.top - vr.top, s: mr.width / this.#frame.mapWidth };
		}
		this.set(this.t, false);
	}

	#down = (e: PointerEvent) => {
		if (e.button > 0) return;
		this.#pointers.set(e.pointerId, this.#point(e));
		this.#freeze();

		if (this.#pointers.size === 1) {
			this.#gesture = {
				mode: 'pan',
				start: this.#point(e),
				t0: { ...this.t },
				moved: false,
				target: e.target instanceof Element ? e.target : null
			};
		} else if (this.#pointers.size === 2) {
			const [a, b] = this.#pointers.values();
			this.#gesture = {
				mode: 'pinch',
				d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
				mid0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
				t0: { ...this.t }
			};
		}
		this.#viewport.dataset.dragging = '';
	};

	#move = (e: PointerEvent) => {
		if (!this.#pointers.has(e.pointerId)) return;
		this.#pointers.set(e.pointerId, this.#point(e));
		const g = this.#gesture;
		if (!g) return;

		if (g.mode === 'pan' && this.#pointers.size === 1) {
			const p = this.#point(e);
			const dx = p.x - g.start.x;
			const dy = p.y - g.start.y;
			if (!g.moved && Math.hypot(dx, dy) > TAP_SLOP) {
				g.moved = true;
				this.#options.onGesture?.();
			}
			if (g.moved) this.set(pan(this.#frame, g.t0, dx, dy), false);
		} else if (g.mode === 'pinch' && this.#pointers.size === 2) {
			const [a, b] = this.#pointers.values();
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			const ratio = Math.hypot(a.x - b.x, a.y - b.y) / g.d0;
			this.set(pinch(this.#frame, g.t0, g.mid0, mid, ratio), false);
			this.#options.onGesture?.();
		}
	};

	#up = (e: PointerEvent) => {
		if (!this.#pointers.has(e.pointerId)) return;
		this.#pointers.delete(e.pointerId);
		const g = this.#gesture;

		if (g?.mode === 'pan' && !g.moved && this.#pointers.size === 0 && e.type === 'pointerup') {
			const p = this.#point(e);
			const last = this.#lastTap;
			if (
				last &&
				e.timeStamp - last.time < DOUBLE_TAP_MS &&
				Math.hypot(p.x - last.p.x, p.y - last.p.y) < DOUBLE_TAP_SLOP
			) {
				this.#lastTap = null;
				this.set(zoomAround(this.#frame, this.t, 2, p), true);
				this.#options.onGesture?.();
			} else {
				this.#lastTap = { time: e.timeStamp, p };
				if (g.target) this.#options.onTap(g.target, e.clientX, e.clientY);
			}
		}

		if (this.#pointers.size === 1) {
			// Ett finger kvar efter ett nyp fortsätter som panorering
			const [rest] = this.#pointers.values();
			this.#gesture = { mode: 'pan', start: rest, t0: { ...this.t }, moved: true, target: null };
		} else if (this.#pointers.size === 0) {
			this.#gesture = null;
			delete this.#viewport.dataset.dragging;
		}
	};

	#wheel = (e: WheelEvent) => {
		e.preventDefault();
		const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
		// Nyp på en styrplatta kommer som hjul med ctrlKey och små steg
		const speed = e.ctrlKey ? 0.01 : 0.0022;
		const factor = Math.exp(-e.deltaY * unit * speed);
		this.set(zoomAround(this.#frame, this.t, factor, this.#point(e)), false);
		this.#options.onGesture?.();
	};
}
