# IEUM Wallet 최신 체인 동기화 404 수정

## 원인

`ieum-chain`에는 `v0.21.13` 태그가 있지만 GitHub의 `releases/latest` 항목은 없습니다.
기존 워크플로가 Release API만 조회해 `HTTP 404`로 종료됐습니다.

## 적용

이 압축 파일을 `ieum-wallet` 저장소 루트에서 덮어씁니다.

```bash
tar -xzf ieum-wallet-chain-sync-404-fix.tar.gz
npm run validate:ci
git add .github/workflows/sync-latest-chain.yml \
        .github/workflows/wallet-build.yml \
        scripts/validate-ci-workflow.mjs
git commit -m "fix: resolve latest IEUM Chain from tags"
git push
```

그다음 GitHub Actions에서 **Sync latest IEUM Chain into Normal wallet**를 다시 실행합니다.

## 변경 내용

- GitHub Release API 대신 원격 Git 태그를 조회합니다.
- `vMAJOR.MINOR.PATCH` 형식만 선택합니다.
- `sort -V`로 정렬해 최신 안정 태그를 선택합니다.
- 현재 확인된 최신 태그는 `v0.21.13`입니다.
