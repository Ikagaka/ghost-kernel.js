const config = require("webpack-config-narazaka-ts-js").web;

config.entry["ghost-kernel"] = "./src/lib/ghost-kernel.ts";
config.output.library = "ghostKernel";

module.exports = config;
