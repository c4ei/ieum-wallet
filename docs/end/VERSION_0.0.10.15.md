# IEUM Wallet v0.0.10.15 — Light Wallet 최초 잔액 자동 조회

## 변경 사항

- Light 에디션에서 지갑 잠금 해제 직후 잔액과 네트워크 상태를 세션당 한 번 자동 조회합니다.
- React Strict Mode에서도 같은 주소를 중복 조회하지 않도록 보호합니다.
- 자동 조회 실패는 잠금 해제를 취소하지 않고 네트워크 오류 안내만 표시합니다.
- Normal 에디션에는 자동 조회를 적용하지 않습니다.
- 지갑 잠금 시 자동 조회 상태와 네트워크 상태를 초기화합니다.

## 검증

    DISPLAY_VERSION=0.0.10.15 npm run validate:release
    npm run validate:ci
    npm run build
    npm test
