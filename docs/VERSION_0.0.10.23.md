# IEUM Wallet v0.0.10.23 — macOS와 앱 업데이트

## 사용자에게 달라지는 점

IEUM Wallet Light와 Normal을 다음 환경에서 내려받을 수 있습니다.

| 운영체제 | 제공 파일 |
| --- | --- |
| Windows x64 | NSIS 설치 파일, MSI |
| Ubuntu/Linux x64 | AppImage, DEB |
| macOS Intel | DMG |
| macOS Apple Silicon | DMG |

Light는 인터넷 RPC에 연결하는 가벼운 월렛이고, Normal은 IEUM Chain 실행 파일을 함께
포함합니다. Mac이 Intel인지 Apple Silicon인지 모르겠다면 화면 왼쪽 위 Apple 메뉴의
`이 Mac에 관하여`에서 칩 정보를 확인하세요.

앱 화면 안에서는 IEUM Cold Wallet과 동일한 IEUM 오빗 로고를 사용합니다. 바탕화면과
설치 파일 아이콘은 Cold Wallet을 잘못 실행하지 않도록 기존 IEUM Wallet 전용 아이콘을
유지합니다.

Wallet은 IEUM Chain v0.23.9의 Genesis hash
`0x82cfc3615112766f3eb151a8677890c1b74ce6bce8463a1a3590991c383650f6`을 확인합니다.
잠금 화면과 지갑 사용 화면 하단에는 `IEUM Wallet v0.0.10.23`이 표시됩니다.
같은 영역에서 최신 버전을 확인할 수 있습니다. 새 버전이 있으면 `업데이트 설치`를
누르세요. Wallet이 서명을 검증해 설치한 다음 자동으로 다시 시작합니다. 시작할 때
업데이트를 강제로 설치하지 않으므로 사용자가 설치 시점을 선택할 수 있습니다.

## 최신 파일 관리

빌드가 성공하면 다음 고정 주소의 태그가 자동으로 이번 소스 커밋으로 이동합니다.

- `wallet-light-latest`
- `wallet-normal-latest`

따라서 다음 릴리스부터 사용자가 태그를 수동으로 강제 이동할 필요가 없습니다.
릴리스에 함께 표시되는 `.sig`와 `latest.json`은 오래된 파일이 아니라 안전한 자동
업데이트 검증에 필요한 현재 버전 파일입니다.

## 로컬 검증

```bash
npm ci
DISPLAY_VERSION=0.0.10.23 npm run validate:release
npm run validate:ci
npm run build
npm test
cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

## GitHub Release 실행

PR을 `main`에 병합하고 IEUM Chain `v0.23.9` 태그가 생성된 뒤 전체 데스크톱
릴리스를 실행합니다.

```bash
git switch dev
git add -- .github/workflows/wallet-build.yml CHANGELOG.md README.md \
  package.json package-lock.json scripts/validate-ci-workflow.mjs \
  src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json \
  src/App.tsx src/styles.css src/assets/ieum-orbit-logo.png \
  docs/VERSION_0.0.10.23.md
git commit -m "release: publish wallet updater UI v0.0.10.23"
git push origin dev
gh pr create --base main --head dev \
  --title "IEUM Wallet v0.0.10.23 updater and macOS release" --draft

# CI 성공 후 PR을 main에 병합하고 실행
gh workflow run wallet-build.yml \
  -f version=0.0.10.23 \
  -f core_ref=v0.23.9 \
  -f normal_only=false \
  -f android_release=false
```

이번 릴리스는 macOS용 GitHub runner 두 개를 추가 사용하므로 기존보다 시간이 더
걸릴 수 있습니다. 모든 데스크톱 작업이 성공해야 latest 태그가 이동합니다.

Release 입력 버전이 Light 또는 Normal의 현재 배포 버전과 같거나 낮으면 검증 작업이
즉시 실패합니다. 소스가 바뀌었는데 기존 버전으로 다시 빌드되어 업데이트가 감지되지
않는 문제를 게시 전에 차단합니다.
