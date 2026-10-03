import { describe, expect, it } from 'vitest';
import {
	clamp,
	fitAll,
	fitBox,
	focusBox,
	minScale,
	pan,
	pinch,
	zoomAround,
	type Frame,
	type Transform
} from './transform.ts';

/** iPhone-stor viewport med kartan 630×1050 skalad till bredden */
const frame: Frame = {
	width: 390,
	height: 800,
	mapWidth: 390,
	mapHeight: 650,
	top: 200,
	bottom: 0,
	maxScale: 5
};

/** Var en punkt i kartan (skala 1) hamnar i viewporten */
const project = (t: Transform, x: number, y: number) => ({ x: t.x + x * t.s, y: t.y + y * t.s });

describe('transform', () => {
	it('visar hela kartan mellan header och nederkant', () => {
		const t = fitAll(frame);
		expect(t.s).toBeCloseTo(minScale(frame));
		expect(t.s).toBeCloseTo((800 - 200 - 16) / 650);
		expect(t.y).toBeCloseTo(200);
		expect(t.x + (390 * t.s) / 2).toBeCloseTo(195);
	});

	it('centrerar kartan i den fria ytan när ett ark täcker nederkanten', () => {
		const t = fitAll({ ...frame, bottom: 300 });
		const center = t.y + (650 * t.s) / 2;
		expect(center).toBeCloseTo(200 + (800 - 300 - 200) / 2);
	});

	it('håller skalan mellan minsta skala och maxZoom', () => {
		expect(clamp(frame, { x: 0, y: 0, s: 99 }).s).toBe(5);
		expect(clamp(frame, { x: 0, y: 0, s: 0.01 }).s).toBeCloseTo(minScale(frame));
	});

	it('låter inte kartan dras bort från viewporten', () => {
		const t = pan(frame, { x: 0, y: 200, s: 3 }, 10_000, 10_000);
		expect(t.x).toBe(40);
		expect(t.y).toBe(200);
		const u = pan(frame, { x: 0, y: 200, s: 3 }, -10_000, -10_000);
		expect(u.x + 390 * 3).toBe(390 - 40);
		expect(u.y + 650 * 3).toBe(800 - 40);
	});

	it('zoomar runt punkten under fingret', () => {
		const t: Transform = { x: -100, y: 0, s: 2 };
		const p = { x: 200, y: 400 };
		const before = { x: (p.x - t.x) / t.s, y: (p.y - t.y) / t.s };
		const z = zoomAround(frame, t, 1.5, p);
		expect(z.s).toBe(3);
		expect(project(z, before.x, before.y).x).toBeCloseTo(p.x);
		expect(project(z, before.x, before.y).y).toBeCloseTo(p.y);
	});

	it('flyttar nypets mittpunkt med fingrarna', () => {
		const start: Transform = { x: -200, y: -100, s: 2 };
		const from = { x: 150, y: 400 };
		const to = { x: 170, y: 420 };
		const z = pinch(frame, start, from, to, 1.25);
		const anchor = { x: (from.x - start.x) / start.s, y: (from.y - start.y) / start.s };
		expect(project(z, anchor.x, anchor.y).x).toBeCloseTo(to.x);
		expect(project(z, anchor.x, anchor.y).y).toBeCloseTo(to.y);
	});

	it('anpassar en box till den fria ytan', () => {
		const box = { x0: 100, y0: 300, x1: 200, y1: 400 };
		const t = fitBox(frame, box);
		expect(t.s).toBeCloseTo(2.6);
		const c = project(t, 150, 350);
		expect(c.x).toBeCloseTo(195);
		expect(c.y).toBeCloseTo(200 + 600 / 2);
	});

	it('zoomar in på ett valt ställe men aldrig ut', () => {
		const tent = { x0: 100, y0: 100, x1: 126, y1: 141 };
		expect(focusBox(frame, tent, fitAll(frame)).s).toBeCloseTo(90 / 41);
		expect(focusBox(frame, tent, { x: 0, y: 0, s: 4 }).s).toBe(4);
		const pin = { x0: 50, y0: 50, x1: 59, y1: 59 };
		expect(focusBox(frame, pin, fitAll(frame)).s).toBe(3);
	});
});
