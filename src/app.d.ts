import type { User } from "./lib/types";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db?: {
				user: User;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface PageData {
			flash?: { type: "success" | "error" | "info"; message: string };
		}
	}
}

export {};
