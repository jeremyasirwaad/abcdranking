const {
	override,
	addWebpackAlias,
	addWebpackResolve
} = require("customize-cra");
const path = require("path");

module.exports = override(
	addWebpackAlias({
		stream: path.resolve(__dirname, "node_modules/stream-browserify")
	}),
	addWebpackResolve({
		fallback: {
			buffer: require.resolve("buffer/"),
			os: require.resolve("os-browserify/browser")
		}
	})
);
