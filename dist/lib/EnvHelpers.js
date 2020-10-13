"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envFile = exports.env = void 0;
const fs = require("fs");
function env(variable, defaultValue) {
    const value = process.env[variable];
    if (typeof value === "string") {
        return value;
    }
    if (typeof defaultValue === "string") {
        return defaultValue;
    }
    throw new Error("Environment variable is required to be set: " + variable);
}
exports.env = env;
function envFile(variable, defaultValue) {
    const filename = env(variable, defaultValue);
    try {
        return fs.readFileSync(filename);
    }
    catch (err) {
        throw new Error("Failed to read file: " + filename);
    }
}
exports.envFile = envFile;
