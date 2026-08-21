# IEUM Wallet v0.0.10.26 — nonce·중복 전송 방지

## 원인

확정되지 않은 거래가 mempool에 있는데 RPC가 확정 nonce를 다시 반환하면 새 거래도
같은 nonce로 서명됩니다. 동일 raw transaction은 “이미 mempool”, 받는 주소만 바뀐
거래는 “최소 10% 높은 수수료” 오류가 발생합니다.

## 수정

- 전송 직전에 `latest`와 `pending` nonce를 함께 조회합니다.
- 두 값이 다르면 먼저 보낸 거래가 처리 중이므로 새 거래를 만들지 않습니다.
- 확인 버튼 연속 클릭을 즉시 차단합니다.
- 주소나 수량을 바꾸면 이전 확인 팝업의 값을 폐기합니다.
- 오류 문구는 수수료를 올리라고 유도하지 않고 기존 거래·Chain Doctor 확인을 안내합니다.
- 거래 확정은 해당 해시 조회 결과만 사용합니다. 다른 사용자의 mempool 거래는 내 거래
  상태 판단에 사용하지 않습니다.
- 잔액과 수수료 합계, 0번 주소, 소수점 18자리, 안전 nonce 범위를 서명 전에 검사합니다.
- 앱을 다시 열거나 잔액을 새로고침하면 최근 `처리 중` 거래를 자동으로 다시 조회해
  확정·실패 상태를 정리합니다. RPC 장애만으로 거래를 실패 처리하지 않습니다.

Chain v0.23.12가 `eth_getTransactionCount(..., "pending")`를 정확히 지원하므로 Chain을
먼저 배포한 뒤 Wallet을 배포해야 합니다.

cd ~/www/ieum-wallet
npm ci
DISPLAY_VERSION=0.0.10.26 npm run validate:release
npm run validate:ci
npm run build
npm test
cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked


# CI 성공 후 PR을 main에 병합하고 실행
gh workflow run wallet-build.yml \
  -f version=0.0.10.26 \
  -f core_ref=v0.23.12 \
  -f normal_only=false \
  -f android_release=false