# IEUM Wallet v0.0.10.14 — 한국어·영어 지원

## 변경 사항

- 헤더에 한국어/English 언어 선택기를 추가했습니다.
- 선택 언어는 브라우저에 저장되어 다음 실행에도 유지됩니다.
- 운영 UI 텍스트, 입력 안내, 접근성 레이블과 동적 송금 확인 문구를 영어로 표시합니다.
- 미번역 키는 안전하게 원문(한국어)으로 폴백합니다.
- 앱, Tauri, Rust 패키지 버전을 0.0.10-14로 일치시켰습니다.

## 호환성 점검

- Chain ID 21004와 운영 Genesis hash가 Chain 설정과 일치합니다.
- Wallet 요구 프로토콜 v2는 Chain v0.23.0의 프로토콜 v3 및 최소 호환 정책과 호환됩니다.
- 기본 원격 RPC는 https://irpc.aah.name 을 유지합니다.

## 검증 및 배포

    npm ci
    npm run validate:release
    npm run validate:ci
    npm run build
    npm test
    git add src docs package.json package-lock.json src-tauri
    git commit -m "feat: add English localization to wallet"
    git push origin main
    git tag -a v0.0.10.14 -m "IEUM Wallet v0.0.10.14"
    git push origin v0.0.10.14
