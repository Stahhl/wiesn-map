/**
 * Schema för innehållet i `content/`. Används av `pnpm content:check`, av bygget
 * (`#lib/server/content.ts`) och ger TS-typerna till klienten.
 *
 * Modulen har inga beroenden till SvelteKit, så den kan senare brytas ut till ett
 * delat paket för native-klienter.
 */
import * as v from 'valibot';

export const SCHEMA_VERSION = 1;

const Id = v.pipe(
	v.string(),
	v.regex(/^[a-z0-9][a-z0-9-]*$/, 'id får bara innehålla a–z, 0–9 och bindestreck')
);
const Text = v.pipe(v.string(), v.trim(), v.nonEmpty('får inte vara tom'));
const Color = v.pipe(v.string(), v.hexColor('ska vara en hex-färg, t.ex. #c59b17'));
const IsoDate = v.pipe(v.string(), v.isoDate('ska vara ett datum, t.ex. 2026-09-19'));
const Url = v.pipe(v.string(), v.url('ska vara en fullständig url'));

/** Fält som får saknas. Saknas det blir värdet `null`, och UI:t döljer det. */
const nullish = <T extends v.GenericSchema>(schema: T) => v.optional(v.nullable(schema), null);

const Tag = v.strictObject({ bg: Color, fg: Color });

export const SiteSchema = v.strictObject({
	schemaVersion: v.literal(SCHEMA_VERSION),
	currentEdition: Id
});

export const CategorySchema = v.strictObject({
	id: Id,
	/** "Stora tält" – teckenförklaring och resultattitel */
	label: Text,
	/** "Stora" – segmentet */
	short: Text,
	/** "Stort tält" – detaljark och resultatband */
	singular: Text,
	color: Color,
	shape: v.picklist(['square', 'round'])
});

export const AreaSchema = v.strictObject({
	id: Id,
	label: Text,
	/** Visas som tagg i detaljarket */
	tag: v.optional(Tag),
	/** Visas i teckenförklaringen */
	legend: v.optional(v.strictObject({ fill: Color, stroke: Color }))
});

export const FilterSchema = v.strictObject({
	id: Id,
	label: Text,
	tag: Tag
});

export const LayerSchema = v.pipe(
	v.strictObject({
		id: Id,
		label: Text,
		/** Färgruta i lagerarket … */
		swatch: v.optional(Color),
		/** … eller en `<symbol id>` från kartan */
		symbol: v.optional(v.string()),
		/** Tänt när appen öppnas */
		default: v.boolean(),
		/** Tonas ned när ett filter är aktivt eller ett ställe är valt */
		dimWhenFocused: v.optional(v.boolean(), false)
	}),
	v.check(
		(layer) => (layer.swatch === undefined) !== (layer.symbol === undefined),
		'ett lager behöver antingen `swatch` eller `symbol`'
	)
);

export const EditionSchema = v.strictObject({
	schemaVersion: v.literal(SCHEMA_VERSION),
	id: Id,
	title: Text,
	subtitle: Text,
	dates: v.strictObject({ start: IsoDate, end: IsoDate }),
	map: v.strictObject({
		file: Text,
		dimOpacity: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
		maxZoom: v.pipe(v.number(), v.minValue(1)),
		autoFit: v.boolean()
	}),
	categories: v.pipe(v.array(CategorySchema), v.minLength(1)),
	areas: v.pipe(v.array(AreaSchema), v.minLength(1)),
	filters: v.strictObject({
		/** `all` = alla valda villkor (OCH), `any` = något villkor (ELLER) */
		mode: v.picklist(['all', 'any']),
		items: v.array(FilterSchema),
		/** Tagg i detaljarket när ett ställe saknar `features` */
		fallbackTag: v.optional(v.strictObject({ label: Text, bg: Color, fg: Color }))
	}),
	layers: v.array(LayerSchema)
});

export const PlaceSchema = v.strictObject({
	/** Stabilt mellan år, så att delade länkar fortsätter fungera */
	id: Id,
	name: Text,
	category: Id,
	area: Id,
	/** Nummer på kartan, för små tält */
	number: nullish(v.pipe(v.number(), v.integer(), v.minValue(1))),
	brewery: nullish(Text),
	seats: nullish(v.pipe(v.number(), v.integer(), v.minValue(0))),
	/** Referenser till `filters.items[].id` */
	features: v.optional(v.array(Id), []),
	hours: nullish(v.strictObject({ weekday: Text, weekend: Text })),
	links: v.optional(
		v.strictObject({
			/** Ställets sida på oktoberfest.de, helst den engelska */
			oktoberfest: nullish(Url),
			website: nullish(Url),
			booking: nullish(Url),
			menu: nullish(Url),
			/** Ett eget dokument eller avsnitt om allergener */
			allergens: nullish(Url),
			/** Planritning av tältet, inte karta över var det ligger */
			floorplan: nullish(Url),
			instagram: nullish(Url),
			facebook: nullish(Url),
			tiktok: nullish(Url),
			youtube: nullish(Url)
		}),
		{}
	),
	/**
	 * Var allergeninformationen finns när den inte har en egen länk: märkt i menyn,
	 * via QR-kod i tältet eller hos personalen.
	 */
	allergenInfo: nullish(v.picklist(['menu', 'qr', 'staff'])),
	/** Visningsbild utifrån, helst fasaden. Länkas från källan och kan försvinna. */
	image: nullish(
		v.strictObject({
			src: Url,
			/** Fotografen, som källan anger den */
			credit: Text
		})
	),
	description: nullish(Text)
});

export const PlacesSchema = v.array(PlaceSchema);

export type Site = v.InferOutput<typeof SiteSchema>;
export type Category = v.InferOutput<typeof CategorySchema>;
export type Area = v.InferOutput<typeof AreaSchema>;
export type Filter = v.InferOutput<typeof FilterSchema>;
export type Layer = v.InferOutput<typeof LayerSchema>;
export type Edition = v.InferOutput<typeof EditionSchema>;
export type Place = v.InferOutput<typeof PlaceSchema>;

/** En upplaga som klienten får den: data plus färdig karta. */
export type EditionBundle = {
	edition: Edition;
	places: Place[];
	/** Optimerad SVG-markup, redo att bäddas in */
	map: string;
	/** Kartans viewBox: x, y, bredd, höjd */
	viewBox: [number, number, number, number];
};
