# IEUM Wallet 0.0.10.9

## 변경 사항

- 앱 버전을 `0.0.10.9`로 올렸습니다.
- IEUM Chain v0.22.4의 높이 0 제네시스 및 고정 제네시스 시각과의 호환성을 확인했습니다.
- Wallet의 잔액, nonce, 전송 RPC 형식은 바뀌지 않아 기능 소스 수정은 없습니다.

## 검증

```bash
npm ci
npm test
npm run build
DISPLAY_VERSION=0.0.10.9 npm run validate:release
```

Chain 원장 초기화 뒤에는 전송 전 RPC 주소, chain ID, 잔액과 nonce를 다시 확인하십시오.
