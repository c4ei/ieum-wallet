import { readFile } from "node:fs/promises";

const versionFile = JSON.parse(await readFile("version.json", "utf8"));
const displayVersion = String(versionFile.displayVersion ?? "").trim();
if (process.env.DISPLAY_VERSION?.trim() && process.env.DISPLAY_VERSION.trim() !== displayVersion) {
  throw new Error(`release input ${process.env.DISPLAY_VERSION.trim()} does not match version.json ${displayVersion}`);
}

const parts = displayVersion.split(".");
if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part))) {
  throw new Error(`DISPLAY_VERSION must use A.B.C.D format: ${displayVersion}`);
}

const internalVersion = `${parts[0]}.${parts[1]}.${parts[2]}-${parts[3]}`;
const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const tauriConfig = JSON.parse(await readFile("src-tauri/tauri.conf.json", "utf8"));
const cargoToml = await readFile("src-tauri/Cargo.toml", "utf8");
const cargoVersion = cargoToml.match(/^version\s*=\s*"([^"]+)"/m)?.[1];

const versions = {
  "package.json": packageJson.version,
  "src-tauri/tauri.conf.json": tauriConfig.version,
  "src-tauri/Cargo.toml": cargoVersion,
};

for (const [file, actual] of Object.entries(versions)) {
  if (actual !== internalVersion) {
    throw new Error(`${file}: expected ${internalVersion}, found ${actual ?? "missing"}`);
  }
}

console.log(`Release version validated: ${displayVersion} (${internalVersion})`);
