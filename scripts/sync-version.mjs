import { readFile, writeFile } from "node:fs/promises";

const versionFile = JSON.parse(await readFile("version.json", "utf8"));
const displayVersion = String(versionFile.displayVersion ?? "").trim();
const parts = displayVersion.split(".");
if (parts.length !== 4 || parts.some(part => !/^\d+$/.test(part))) {
  throw new Error(`version.json displayVersion must use A.B.C.D: ${displayVersion}`);
}
const internalVersion = `${parts[0]}.${parts[1]}.${parts[2]}-${parts[3]}`;

async function updateJson(path, update) {
  const value = JSON.parse(await readFile(path, "utf8"));
  update(value);
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

await updateJson("package.json", value => { value.version = internalVersion; });
await updateJson("package-lock.json", value => {
  value.version = internalVersion;
  if (value.packages?.[""]) value.packages[""].version = internalVersion;
});
await updateJson("src-tauri/tauri.conf.json", value => { value.version = internalVersion; });

for (const path of ["src-tauri/Cargo.toml", "src-tauri/Cargo.lock"]) {
  const source = await readFile(path, "utf8");
  const updated = path.endsWith("Cargo.toml")
    ? source.replace(/^version\s*=\s*"[^"]+"/m, `version = "${internalVersion}"`)
    : source.replace(/(name = "ieum-wallet"\nversion = ")[^"]+("\n)/, `$1${internalVersion}$2`);
  await writeFile(path, updated);
}

console.log(`Wallet version synchronized: ${displayVersion} (${internalVersion})`);
