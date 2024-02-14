// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const Config = getDefaultConfig(__dirname);

Config.resolver.assetExts.push("sqlite");

module.exports = Config;

