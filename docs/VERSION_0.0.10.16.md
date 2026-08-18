# IEUM Wallet v0.0.10.16 — 길드 주소와 전송 주소 정규화

## 변경

- 길드 재단지갑 안내 주소를 안전한 소문자 표기로 통일했습니다.
- 받는 주소의 앞뒤 공백을 제거한 뒤 검증, 서명, 최근 전송 저장에 동일한 주소를 사용합니다.
- 잘못된 혼합 대소문자 체크섬을 임의로 소문자로 바꾸지 않으므로 오타 검출은 유지합니다.
- Display version은 0.0.10.16, 패키지 내부 버전은 0.0.10-16입니다.

## 검증

    DISPLAY_VERSION=0.0.10.16 npm run validate:release
    npm run validate:ci
    npm run build
    npm test
