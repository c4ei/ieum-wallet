const candidate = process.env.DISPLAY_VERSION?.trim();
if (!candidate) throw new Error("DISPLAY_VERSION is required");

function parts(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)[.-](\d+)$/);
  if (!match) throw new Error(`지원하지 않는 버전 형식입니다: ${version}`);
  return match.slice(1).map(Number);
}

function compare(left, right) {
  const a = parts(left);
  const b = parts(right);
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

for (const channel of ["wallet-light-latest", "wallet-normal-latest"]) {
  const url = `https://github.com/c4ei/ieum-wallet/releases/download/${channel}/latest.json`;
  const response = await fetch(url, { redirect: "follow" });
  if (response.status === 404) continue;
  if (!response.ok) throw new Error(`${channel} 버전 확인 실패: HTTP ${response.status}`);
  const manifest = await response.json();
  const released = String(manifest.version ?? "");
  if (compare(candidate, released) <= 0) {
    throw new Error(`${channel} 배포 버전 ${released}보다 큰 버전이 필요합니다. 입력값: ${candidate}`);
  }
  console.log(`${channel}: ${released} -> ${candidate}`);
}

console.log(`Release upgrade validated: ${candidate}`);
