const config = require("webpack-config-narazaka-ts-js").node;

config.entry["ghost-kernel"] = "./src/lib/ghost-kernel.ts";
config.output.library = "ghostKernel";

module.exports = config;