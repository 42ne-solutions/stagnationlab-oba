
import * as fs from "fs";
import * as path from "path";

export function env(variable: string, defaultValue?: string): string {
	const value = process.env[variable];
	if (typeof value === "string") {
		return value;
	}
	if (typeof defaultValue === "string") {
		return defaultValue;
	}
	throw new Error("Environment variable is required to be set: " + variable);
}

export function envFile(variable: string, defaultValue?: string) {
	const filename = path.resolve(env(variable, defaultValue));
	try {
		return fs.readFileSync(filename); 
	} catch (err) {
		throw new Error("Failed to read file: " + filename);
	}
}
