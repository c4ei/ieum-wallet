# IEUM Wallet v0.0.10.25 — 전송 처리 중 표시 수정

전송 버튼을 누른 뒤 입력 화면이 초기화되어도 최종 확인한 금액을 그대로 사용합니다.
따라서 빈 문자열이 금액 변환기로 전달되어 발생하던 `invalid FixedNumber string` 오류를
차단했습니다.

지갑은 거래·영수증을 최대 약 60초 확인합니다. Chain v0.23.11에서는 해당 거래가
mempool에 있으면 바로 `처리 중`으로 표시합니다. 구형 노드는 `txpool_status`에 대기
거래가 있으면 성급하게 `체인에서 확인되지 않음`으로 단정하지 않습니다.

`처리 중` 거래를 같은 nonce로 반복 전송하지 마세요. Manager의 Chain Doctor에서
높이와 대기 거래를 먼저 확인해야 합니다.

cd ~/www/ieum-wallet
npm ci
DISPLAY_VERSION=0.0.10.25 npm run validate:release
npm run validate:ci
npm run build
npm test
cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked