// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		/** Shallow routing, se src/lib/state/history.ts */
		interface PageState {
			/** Valt ställe */
			place?: string;
			/** Posten skapades när stället valdes, så bakåt stänger arket */
			ownEntry?: true;
			/** Lagerarket är öppet */
			layers?: true;
		}
		// interface Platform {}
	}
}

export {};
