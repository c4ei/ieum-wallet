# IEUM Wallet v0.0.10.19 — IEUM 메인넷 신원 전환

- Chain ID `21004`는 IEUM 메인넷 전용으로 유지한다.
- 공식 network name은 `ieum-mainnet`이다.
- 예상 Genesis hash를 `0xc7a4f99b113341db7705117dedb240bb3ea3b0b99c115d134ddf505be1ff8a5a`로 고정한다.
- 현재 사용자 안내의 개발·사설망 표현을 메인넷 운영 안내로 교체한다.
- 기존 Genesis 원장에는 연결하지 않으므로 Chain v0.23.5 전환과 Wallet 배포 시점을 맞춘다.

```bash
DISPLAY_VERSION=0.0.10.19 npm run validate:release
npm run validate:ci
npm run build
npm test
```
