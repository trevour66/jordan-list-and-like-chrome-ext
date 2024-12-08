let mix = require("laravel-mix");
let webpack = require("webpack");

mix.setPublicPath("./public");

mix.js("src/app.js", "public/js").vue();
mix.js("src/background.js", "public/js").vue();
mix.js("src/content.js", "public/js").vue();
mix.js("src/content_profile_page.js", "public/js").vue();

mix.postCss("src/css/app.css", "public/css", [require("tailwindcss")]);

mix.webpackConfig((webpack) => {
	return {
		plugins: [
			new webpack.DefinePlugin({
				__VUE_PROD_DEVTOOLS__: false,
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
			}),
		],
	};
});
