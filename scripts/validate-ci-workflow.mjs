import { readFile } from "node:fs/promises";

const workflowPath = ".github/workflows/wallet-build.yml";
const workflow = await readFile(workflowPath, "utf8");
const upgradeGuard = await readFile("scripts/validate-release-upgrade.mjs", "utf8");

const required = new Map([
  ["actions/checkout@v5", "Node 24 기반 checkout 액션을 사용해야 합니다."],
  ["actions/setup-node@v5", "Node 24 기반 setup-node 액션을 사용해야 합니다."],
  ["x64-windows-static-md", "Windows Normal Core는 정적 SQLite CRT 변형을 설치해야 합니다."],
  ["RUSTFLAGS=-L native=$sqliteLib", "Rust 링커에 SQLite 라이브러리 경로를 전달해야 합니다."],
  ["rm -rf src-tauri/gen/android", "식별자 변경 전 Android 생성물을 제거해야 합니다."],
  ["npm run android:init:light", "Light 식별자로 Android 프로젝트를 다시 생성해야 합니다."],
  ["test -n \"${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}\"", "릴리스 전에 Tauri 서명 키를 검사해야 합니다."],
  ["git ls-remote --tags --refs https://github.com/c4ei/ieum-chain.git 'refs/tags/v*'", "latest 입력은 IEUM Core의 안정 태그 목록에서 해석해야 합니다."],
  ["sort -V", "IEUM Core 태그는 버전 순서로 정렬해야 합니다."],
  ["ref: ${{ steps.resolve-core.outputs.core_ref }}", "Normal 빌드는 해석 및 검증한 Core ref를 checkout해야 합니다."],
  ["IEUM Chain: ${{ matrix.edition == 'normal' && steps.resolve-core.outputs.core_ref || 'remote RPC' }}", "Normal 릴리스에는 포함된 Core 버전을 기록해야 합니다."],
  ["releaseAssetNamePattern: IEUM-Wallet-${{ matrix.label }}-v${{ inputs.version }}-[platform]-[arch][setup].[ext]", "번들 이름과 확장자를 중복한 릴리스 파일명을 사용하면 안 됩니다."],
  ["macos-15-intel", "Intel Mac DMG 빌드가 필요합니다."],
  ["macos-15", "Apple Silicon Mac DMG 빌드가 필요합니다."],
  ["git push origin refs/tags/wallet-normal-latest --force", "Normal latest 태그를 현재 소스로 이동해야 합니다."],
  ["git push origin refs/tags/wallet-light-latest --force", "Light latest 태그를 현재 소스로 이동해야 합니다."],
  ["validate-release-upgrade.mjs", "이미 배포된 버전의 재사용을 차단해야 합니다."],
]);

for (const [pattern, message] of required) {
  if (!workflow.includes(pattern)) {
    throw new Error(`${workflowPath}: ${message} (missing: ${pattern})`);
  }
}

if (/actions\/(?:checkout|setup-node)@v4\b/.test(workflow)) {
  throw new Error(`${workflowPath}: Node 20 기반 GitHub 액션 v4가 다시 추가됐습니다.`);
}

if (/releaseAssetNamePattern:.*\[bundle\].*\[ext\]/.test(workflow)) {
  throw new Error(`${workflowPath}: bundle 이름과 확장자를 함께 사용하면 msi.msi 같은 중복 이름이 생성됩니다.`);
}

if (!upgradeGuard.includes("compare(candidate, released) <= 0")) {
  throw new Error("배포 버전보다 크지 않은 버전을 거부해야 합니다.");
}

console.log("Wallet CI regression guards passed.");
