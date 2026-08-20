# IEUM Wallet v0.0.10.21 — IEUM Cold Wallet 연결

## 사용 순서

1. `IEUM 보내기`에 받는 주소와 수량을 입력합니다.
2. `콜드월렛용 거래 만들기`를 눌러 JSON 파일을 저장합니다.
3. JSON 파일만 거래용 USB로 오프라인 컴퓨터에 옮깁니다.
4. IEUM Cold Wallet에서 주소와 수량을 확인하고 서명합니다.
5. 서명된 Raw Transaction을 온라인 IEUM Wallet에 붙여 넣습니다.
6. 원래 거래와 일치한다는 표시를 확인한 뒤 전송합니다.

개인키, SEED, 콜드월렛 금고 파일과 비밀번호는 온라인 컴퓨터로 옮기지 않습니다.

## 구현 내용

- `eth_chainId`와 `eth_getTransactionCount(..., "pending")`로 Chain ID `21004`용 JSON을 만듭니다.
- 수량은 정밀도 손실이 없는 wei 10진수 문자열로 저장합니다.
- Cold Wallet v0.2.x가 읽는 snake_case 형식을 사용합니다.
- 서명 결과의 Chain ID, 형식, 발신자, 수신자, 수량, nonce, gas를 원본과 비교합니다.
- 하나라도 다르면 네트워크 전송을 허용하지 않습니다.

## 체인 변경 여부

변경하지 않습니다. 현재 `ieum-chain`은 EIP-155 legacy raw transaction과 `eth_sendRawTransaction`을 이미 지원합니다. 이번 작업은 기존 체인 RPC를 안전하게 사용하는 월렛 UI 연동입니다.

## 검증

```bash
DISPLAY_VERSION=0.0.10.21 npm run validate:release
npm run validate:ci
npm run build
npm test

cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

## Git 반영과 Release

```bash
git add -- src/offlineTransaction.ts src/offlineTransaction.test.ts src/App.tsx src/styles.css src/i18n.ts package.json package-lock.json src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json .github/workflows/wallet-build.yml README.md CHANGELOG.md docs/VERSION_0.0.10.21.md
git commit -m "feat: connect IEUM Cold Wallet offline signing v0.0.10.21"
git push origin dev
```

PR을 `main`에 병합한 다음 GitHub Actions에서 아래 값으로 실행합니다.

- workflow: `Build and release IEUM Wallet Light and Normal`
- `version`: `0.0.10.21`
- `core_ref`: `latest`
- `normal_only`: `false`
