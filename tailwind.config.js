/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: 'class',
	theme: {
		extend: {
			backdropBlur: {
				sm: '4px',
			},
			colors: {
				background: "rgb(var(--background) / <alpha-value>)",
				foreground: "rgb(var(--foreground) / <alpha-value>)",
				primary: "rgb(var(--primary) / <alpha-value>)",
				secondary: "rgb(var(--secondary) / <alpha-value>)",
				accent: "rgb(var(--accent) / <alpha-value>)",
			},


		},
	},
	plugins: [],
}
