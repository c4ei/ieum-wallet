# IEUM Wallet v0.0.10.12 수량 표시·릴리스 파일명 수정

## 수정 내용

- 잔액 표시에서 18자리 정수를 JavaScript `Number`로 변환하던 코드를 제거했습니다.
- IEUM 최소 단위를 `BigInt`로 유지하면서 소수점 8자리에서 반올림합니다.
- 표시 결과 뒤의 0은 제거합니다. `99.23100000`은 `99.231`, `99.99990000`은
  `99.9999`로 표시합니다.
- 9번째 자리가 5 이상이면 올림합니다. `99.999999996`은 `100`으로 표시됩니다.
- Windows 릴리스 이름에서 `[bundle]`과 `[ext]`가 중복되던 규칙도 함께 수정하여
  새 MSI가 `...-windows-x64.msi` 형식으로 생성되게 했습니다.
- 수량 반올림 경계와 릴리스 이름에 대한 회귀 테스트를 추가했습니다.
- 설정된 운영 RPC와 보조 RPC 중 체인 신원이 일치하면서 확정 높이가 가장 높은 노드를
  선택합니다. 뒤처진 RPC가 `readyForTransactions=true`를 잘못 보고해도 더 최신인
  후보가 있으면 이전 잔액을 표시하지 않습니다.
- 송금 RPC 성공은 블록 확정이 아니므로 안내 문구를 `전파됨·확정 대기`로 수정했습니다.

## 검증

```bash
DISPLAY_VERSION=0.0.10.12 npm run validate:release
npm run validate:ci
npm run build
npm test
```

검증 후 `v0.0.10.12` 태그를 만들고 Light·Normal 전체 릴리스를 실행합니다.

git push origin HEAD:main
git tag -a v0.0.10.12 -m "IEUM Wallet v0.0.10.12"
git push origin v0.0.10.12
