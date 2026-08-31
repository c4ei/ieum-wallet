# IEUM Wallet agent guide

작업 전에 `docs/PROJECT_CONTINUITY.md`, `README.md`, 최신 `docs/VERSION_*`, `docs/TESTING.md`, `docs/SECURITY.md`, `SECURITY.md`를 읽는다.

## 현재 기준

- 소스 버전: `package.json`/Tauri의 `1.0.2-1`
- 표시 버전: `version.json`의 `1.0.2.1`
- 태그: `v1.0.2.1`
- 안정 Release: `wallet-light-latest`, `wallet-normal-latest`
- IEUM Mainnet Chain ID `21004`, 공식 genesis hash 확인 필수

## 필수 불변조건

- seed/private key는 로컬 암호화 저장만 하며 로그·서버·GitHub·AI 대화로 보내지 않는다.
- RPC 후보는 chain ID, genesis hash, 프로토콜 호환성을 확인한다. 연결 성공만으로 신뢰하지 않는다.
- 전송은 pending nonce와 로컬 제출 상태를 사용해 중복 제출을 막고, 불명확한 오류에서 자동 재전송하지 않는다.
- Cold Wallet 결과는 from/to/value/nonce/gas/chain ID를 원본 요청과 대조한 뒤 전송한다.
- 금액·수수료는 wei 정수/정밀 문자열로 처리하고 표시 단계에서만 반올림·끝 0 제거를 한다.
- Light와 Normal의 역할을 섞지 않는다. Normal에 포함되는 Chain core 버전을 검증한다.
- updater 공개키 placeholder가 실제 릴리스 빌드에서 안전하게 주입되는지 유지한다. 서명 private key를 저장소에 넣지 않는다.

## 변경 절차

1. `dev`를 `main`과 동기화한다.
2. 동작 변경이면 `package.json`, `version.json`, Tauri 설정/Cargo의 버전을 같은 릴리스로 +1 한다.
3. `docs/VERSION_<display>_<TOPIC>.md`, README/CHANGELOG와 회귀 테스트를 갱신한다.
4. Draft PR과 CI 성공 뒤 `main`에 병합하고 annotated tag를 만든다.
5. 빌드가 모두 성공한 뒤 stable latest 태그·Release·`latest.json`·서명을 대조한다.

## 필수 검증

```bash
npm ci
npm run validate:ci
npm run build
npm test
```

릴리스에서는 Light/Normal의 Windows, Ubuntu, macOS Intel/Apple Silicon과 Android Light 결과를 확인한다. CI 성공과 실제 설치·업데이트 성공은 구분해 보고한다.
