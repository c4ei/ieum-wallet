# IEUM Wallet 0.0.10.7 변경 내역

작성일: 2026-08-11

## 확인한 최신 상태

- 기준 커밋: `ef821adb13e8b0ce2a4fdcf8ea809aefeca3d1bc`
- GitHub Actions: Build and release 실행 #11 성공
- 표시 버전: `0.0.10.7`
- npm/Cargo/Tauri 내부 버전: `0.0.10-7`
- Normal Core 기본 참조: IEUM Chain `v0.21.8`

## 반복 실패의 정확한 원인

연속된 실패는 하나의 불안정한 작업이 아니라 서로 다른 배포 전제의 누락이었다.

1. 실행 #6은 `TAURI_SIGNING_PRIVATE_KEY`가 비어 있어 사전 검증에서 중단됐다.
2. 실행 #7의 Android Light는 번들 식별자를 바꾼 뒤 기존 `gen/android`를 재사용해
   새 Java 패키지 경로가 없었다.
3. 같은 실행의 Windows Normal은 Core 링크에 필요한 `sqlite3.lib`가 없었다.
4. 실행 #8은 SQLite를 동적/정적 CRT가 맞지 않는 조합으로 연결해 Windows 링커의
   unresolved external 오류가 발생했다.
5. 실행 #9는 아직 원격에 존재하지 않는 IEUM Chain ref를 checkout해 두 Normal
   작업이 시작 전에 실패했다.

각 항목은 최신 성공 실행 #11에서 서명 키 검증, Android 프로젝트 재생성,
`x64-windows-static-md` SQLite 설치와 링커 경로 전달, 존재하는 `v0.21.8` Core
참조로 해결된 것을 확인했다.

## 이번 작업

- 버전을 `0.0.10.7`로 올렸다.
- `actions/checkout`과 `actions/setup-node`를 Node 24 기반 v5로 올려 기존 v4의
  Node 20 지원 종료 경고를 제거했다.
- `scripts/validate-ci-workflow.mjs`와 `npm run validate:ci`를 추가했다.
- 배포 검증 단계에서 아래 조건이 사라지면 빌드 전에 실패하도록 했다.
  - Windows 정적 SQLite 설치 및 Rust 링커 경로
  - Android 생성물 삭제 후 Light 식별자로 재생성
  - Tauri 서명 키 사전 확인
  - 입력된 IEUM Chain ref checkout
  - GitHub 공식 액션 v5 사용

## 검증 명령

```bash
DISPLAY_VERSION=0.0.10.7 npm run validate:release
npm run validate:ci
npm ci
npm run build
npm test
cargo check --locked --manifest-path src-tauri/Cargo.toml
```
