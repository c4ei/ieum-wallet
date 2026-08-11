import { readFile } from "node:fs/promises";

const workflowPath = ".github/workflows/wallet-build.yml";
const workflow = await readFile(workflowPath, "utf8");

const required = new Map([
  ["actions/checkout@v5", "Node 24 기반 checkout 액션을 사용해야 합니다."],
  ["actions/setup-node@v5", "Node 24 기반 setup-node 액션을 사용해야 합니다."],
  ["x64-windows-static-md", "Windows Normal Core는 정적 SQLite CRT 변형을 설치해야 합니다."],
  ["RUSTFLAGS=-L native=$sqliteLib", "Rust 링커에 SQLite 라이브러리 경로를 전달해야 합니다."],
  ["rm -rf src-tauri/gen/android", "식별자 변경 전 Android 생성물을 제거해야 합니다."],
  ["npm run android:init:light", "Light 식별자로 Android 프로젝트를 다시 생성해야 합니다."],
  ["test -n \"${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}\"", "릴리스 전에 Tauri 서명 키를 검사해야 합니다."],
  ["gh api repos/c4ei/ieum-chain/releases/latest", "latest 입력은 최신 IEUM Core 릴리스 태그로 해석해야 합니다."],
  ["ref: ${{ steps.resolve-core.outputs.core_ref }}", "Normal 빌드는 해석 및 검증한 Core ref를 checkout해야 합니다."],
  ["IEUM Chain: ${{ matrix.edition == 'normal' && steps.resolve-core.outputs.core_ref || 'remote RPC' }}", "Normal 릴리스에는 포함된 Core 버전을 기록해야 합니다."],
]);

for (const [pattern, message] of required) {
  if (!workflow.includes(pattern)) {
    throw new Error(`${workflowPath}: ${message} (missing: ${pattern})`);
  }
}

if (/actions\/(?:checkout|setup-node)@v4\b/.test(workflow)) {
  throw new Error(`${workflowPath}: Node 20 기반 GitHub 액션 v4가 다시 추가됐습니다.`);
}

console.log("Wallet CI regression guards passed.");
