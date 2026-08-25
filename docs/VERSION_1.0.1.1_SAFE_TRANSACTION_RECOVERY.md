# IEUM Wallet v1.0.1.1 — 안전한 거래 확인·복구

## 변경 목적

운영망에서 거래가 mempool에 접수된 뒤 BFT 지연과 노드 재시작으로 사라진 사례를
기준으로, 사용자가 무한히 `처리 중`만 보거나 새 거래를 중복 생성하지 않도록
송금 수명주기를 보강했습니다.

## 사용자 기능

- 최종 확인 모달 안에서 제출 상태를 직접 표시하고 제출 중 버튼을 잠급니다.
- `처리 중`, `확정 지연`, `네트워크에서 유실됨`, `블록 확정`, `거래 실패`를 구분합니다.
- 서명된 raw transaction과 nonce를 로컬 거래 내역에 보관합니다.
- 유실 거래는 새 nonce의 새 거래를 만들지 않고 원래 서명 원문을 재전파합니다.
- 재전송 전에 latest/pending nonce를 다시 검사하며, 이미 nonce가 사용됐거나 다른
  pending 거래가 있으면 중단합니다.
- 재전파 결과 해시가 원래 해시와 다르면 즉시 중단합니다.

## 버전 단일 기준

표시 버전의 유일한 입력은 루트 `version.json`입니다.

```json
{ "displayVersion": "1.0.1.1" }
```

수정 후 아래 명령 한 번으로 package, lockfile, Tauri, Cargo 내부 버전을 맞춥니다.

```bash
npm run version:sync
```

웹 코드와 릴리스 워크플로도 `version.json`을 직접 참조합니다. 워크플로의 별도
`DISPLAY_VERSION` 상수와 수동 version 입력은 제거했습니다.

`v1.0.1.1`처럼 4자리 버전 태그를 push하면 릴리스 워크플로가 자동 실행되며,
수동 실행도 동일한 `version.json` 값을 사용합니다.

## 빌드 최적화 및 검증

- 릴리스 사전 검증 단계의 중복 웹 프로덕션 빌드를 제거했습니다.
- 단위 테스트는 OS별 Tauri matrix 시작 전에 한 번 실행합니다.
- 실제 Light/Normal·OS별 패키징만 matrix에서 수행합니다.

```bash
npm run version:sync
npm run validate:release
npm run validate:ci
npm run build
npm test
```

git tag -a v1.0.1.1 -m "IEUM Wallet v1.0.1.1"
git push origin v1.0.1.1

