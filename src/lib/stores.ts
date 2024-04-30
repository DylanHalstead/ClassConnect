import { readable, writable } from "svelte/store";

export const currentTime = readable(new Date(), set => {
	set(new Date());

	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});

function createTitle() {
	const { subscribe, set } = writable("");

	return {
		subscribe,
		set: (value: string) => {
			set(`${value}`);
		},
		clear: () => {
			set("Home");
		}
	};
}

export const title = createTitle();
