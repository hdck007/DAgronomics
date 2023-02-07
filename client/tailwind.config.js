module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
	daisyui: {
		themes: ['forest'],
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
