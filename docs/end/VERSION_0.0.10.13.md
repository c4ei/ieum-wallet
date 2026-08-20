# IEUM Wallet v0.0.10.13 — 이음마당 시작 화면

새 **이음마당** 탭에서 일반 지갑 보유 이벤트, 예상 일 보상, 길드 규칙, AAH 가입과 공개 저장소를 한눈에 안내합니다.

- 99.9999 IEUM·5% APR 예시를 소수점 12자리로 표시합니다.
- 보상은 예상값이며 체인의 이벤트 기간·최소 잔액·일일 한도·스냅샷을 기준으로 한다고 명확히 표시합니다.
- 길드 생성비 1 IEUM의 수령처를 재단지갑 `0x356456fF1216B57a6f8891b195b42d296789B67D`로 표시합니다.
- 길드장은 길드 운영자이고 이음지기(체인 검증자)와 별도입니다.
- 실제 잠금형 위임이 체인에 들어오기 전까지 “이음 맡기기” 버튼으로 자산을 잠근 척하지 않습니다.
- Ubuntu Tauri에서 일반 외부 링크와 opener가 열리지 않는 문제를 막기 위해 지급 상태와 AAH 커뮤니티 버튼 모두 기존 `IEUM 사이트` 메뉴와 같은 별도 보안 WebView 창을 사용합니다. 커뮤니티 주소는 `https://aah.name/club`입니다.

검증: `npm test && npm run build`

공개 저장소: [Chain](https://github.com/c4ei/ieum-chain) · [Wallet](https://github.com/c4ei/ieum-wallet) · [Manager](https://github.com/c4ei/ieum-manager)
