/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./node_modules/flowbite/**/*.js",
		"./src/**/*.js",
		"./src/**/*.vue",
	],
	theme: {
		extend: {},
	},
	plugins: [require("flowbite/plugin")],
};
