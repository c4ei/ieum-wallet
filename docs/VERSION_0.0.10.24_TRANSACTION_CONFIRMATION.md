# IEUM Wallet v0.0.10.24 — 실제 거래 확정 표시

## 변경 이유

2026-08-21 운영 중 월렛에 거래 해시가 표시됐지만 운영 RPC의 거래와 영수증은
`null`이고 잔액도 변하지 않은 사례가 확인됐다. 월렛이 만든 해시나 RPC 제출 응답은
블록 확정을 의미하지 않는다.

## 사용자 화면

- **처리 중**: 노드에 제출했지만 아직 영수증이 없다.
- **블록 확정**: 영수증 `status`가 `0x1`이다.
- **거래 실패**: 영수증 `status`가 `0x0`이다.
- **체인에서 확인되지 않음**: 확인 시간 동안 거래와 영수증이 모두 조회되지 않는다.

미확인 거래가 보이면 같은 거래를 즉시 반복 전송하지 말고 네트워크와 nonce를 먼저
확인한다. 일반 온라인 송금과 콜드월렛 서명 거래에 같은 기준을 사용한다.

## 검증

```bash
npm ci
npm run build
npm test
cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

## Git 반영과 릴리스

```bash
git switch dev
git add -- package.json package-lock.json CHANGELOG.md README.md \
  src/App.tsx src/styles.css src/transferHistory.ts \
  src/transactionConfirmation.ts src/transactionConfirmation.test.ts \
  src/wallet.ts src/wallet.test.ts \
  src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json \
  docs/VERSION_0.0.10.24_TRANSACTION_CONFIRMATION.md
git commit -m "fix: show confirmed wallet transactions accurately"
git push origin dev
```

PR을 `main`에 병합한 후 릴리스한다.

```bash
gh workflow run wallet-build.yml \
  -f version=0.0.10.24 \
  -f core_ref=v0.23.10 \
  -f normal_only=false \
  -f android_release=false
```
