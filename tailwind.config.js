import daisyui from "daisyui";

export default {
	content: ["src/**/*.{html,svelte,ts}"],
	daisyui: {
		themes: [
			{
				classConnect: {
					"primary": "#f8942a",
					"secondary": "#4c9cc8",
					"accent": "#28546c",
					"neutral": "#bfbfbf",
					"base-100": "#f4f8fb",
					"info": "#9ac3db",
					"success": "#33c95d",
					"error": "#c02626"
				}
			}
		]
	},

	plugins: [daisyui],
	theme: {
		extend: {
			colors: {
				"calendar-card-1": "#040b10",
				"calendar-card-2": "#9ac3db",
				"calendar-card-3": "#ad99ac",
				"calendar-card-4": "#33c95d",
				"calendar-card-5": "#c02626",
				"calendar-card-6": "#eaebeb",
				"calendar-card-7": "#bababa"
			}
		}
	}
};
