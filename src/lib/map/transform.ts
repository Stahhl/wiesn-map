/**
 * Transformmatematiken för kartan, flyttad från prototypen (docs/teknisk-profil.md §6.3).
 * Rena funktioner i CSS-pixlar relativt kartans viewport. Alla returnerar en
 * transform som redan är begränsad med `clamp`.
 */

/** Kartan ritas som `translate(x, y) scale(s)` med origo uppe till vänster. */
export type Transform = { x: number; y: number; s: number };

/** Rektangel i kartans koordinater vid skala 1 */
export type Box = { x0: number; y0: number; x1: number; y1: number };

export type Frame = {
	/** Viewportens storlek */
	width: number;
	height: number;
	/** Kartans storlek vid skala 1 */
	mapWidth: number;
	mapHeight: number;
	/** Yta som täcks av headern uppe … */
	top: number;
	/** … och av ark eller resultatband nere */
	bottom: number;
	maxScale: number;
};

export type Point = { x: number; y: number };

/** Hur långt kartan får dras förbi kanten */
const EDGE = 40;
/** Luft under kartan när hela kartan visas */
const FIT_GAP = 16;
/** `fitBox` zoomar aldrig in mer än så här */
const FIT_MAX = 2.6;
/** Ett valt ställe zoomas tills dess största sida är ungefär så här många pixlar … */
const FOCUS_SIZE = 90;
/** … men aldrig mer än så här */
const FOCUS_MAX = 3;
/** Minsta storlek på en box när den anpassas, så att ett enskilt litet tält inte zoomas för nära */
const MIN_BOX = 30;

export function minScale(f: Frame): number {
	return Math.min(1, (f.height - f.top - FIT_GAP) / f.mapHeight);
}

export function clampScale(f: Frame, s: number): number {
	return Math.min(f.maxScale, Math.max(minScale(f), s));
}

/** Mitten av den fria ytan mellan header och ark */
export function centerY(f: Frame): number {
	return f.top + (f.height - f.bottom - f.top) / 2;
}

/** Håller skalan inom gränserna och kartan inom viewporten. Är kartan mindre än ytan centreras den. */
export function clamp(f: Frame, t: Transform): Transform {
	const s = clampScale(f, t.s);
	const w = f.mapWidth * s;
	const h = f.mapHeight * s;

	const minX = f.width - w - EDGE;
	const maxX = EDGE;
	const x = minX > maxX ? (f.width - w) / 2 : Math.min(maxX, Math.max(minX, t.x));

	const minY = f.height - h - EDGE - f.bottom;
	const maxY = f.top;
	const y =
		minY > maxY
			? f.top + (f.height - f.bottom - f.top - h) / 2
			: Math.min(maxY, Math.max(minY, t.y));

	return { x, y, s };
}

export function fitAll(f: Frame): Transform {
	const s = minScale(f);
	return clamp(f, { x: (f.width - f.mapWidth * s) / 2, y: centerY(f) - (f.mapHeight * s) / 2, s });
}

function centerOn(f: Frame, box: Box, s: number): Transform {
	const cx = (box.x0 + box.x1) / 2;
	const cy = (box.y0 + box.y1) / 2;
	return clamp(f, { x: f.width / 2 - cx * s, y: centerY(f) - cy * s, s });
}

/** Visar hela boxen i den fria ytan, t.ex. alla träffar för ett filter. */
export function fitBox(f: Frame, box: Box): Transform {
	const bw = Math.max(box.x1 - box.x0, MIN_BOX);
	const bh = Math.max(box.y1 - box.y0, MIN_BOX);
	const s = clampScale(
		f,
		Math.min((f.width - 70) / bw, (f.height - f.bottom - f.top - 50) / bh, FIT_MAX)
	);
	return centerOn(f, box, s);
}

/** Centrerar ett valt ställe och zoomar in om det behövs, men aldrig ut. */
export function focusBox(f: Frame, box: Box, current: Transform): Transform {
	const size = Math.max(box.x1 - box.x0, box.y1 - box.y0, 1);
	const s = clampScale(f, Math.max(current.s, Math.min(FOCUS_SIZE / size, FOCUS_MAX)));
	return centerOn(f, box, s);
}

/** Skalar med `factor` runt punkten `p` i viewporten, som ligger kvar under fingret. */
export function zoomAround(f: Frame, t: Transform, factor: number, p: Point): Transform {
	return pinch(f, t, p, p, factor);
}

/** Nyp: punkten som låg under `from` när gesten började hamnar under `to`, skalad med `ratio`. */
export function pinch(
	f: Frame,
	start: Transform,
	from: Point,
	to: Point,
	ratio: number
): Transform {
	const s = clampScale(f, start.s * ratio);
	const mx = (from.x - start.x) / start.s;
	const my = (from.y - start.y) / start.s;
	return clamp(f, { x: to.x - mx * s, y: to.y - my * s, s });
}

export function pan(f: Frame, t: Transform, dx: number, dy: number): Transform {
	return clamp(f, { x: t.x + dx, y: t.y + dy, s: t.s });
}
