# IEUM Wallet 최신 Chain 자동 반영 변경 파일

기준 커밋: `b5b36e8` (`automate latest IEUM Chain wallet builds`)

이 압축 파일에는 변경된 파일 5개만 원래 폴더 구조대로 들어 있습니다.

## 적용 방법

`ieum-wallet` 저장소의 최상위 폴더에서 실행합니다.

```bash
tar -xzf ieum-wallet-latest-chain-files.tar.gz
cp -a ieum-wallet-latest-chain-files/. ./
rm APPLY.md
```

또는 압축을 푼 뒤 아래 파일을 저장소의 동일 경로에 직접 덮어써도 됩니다.

- `.github/workflows/sync-latest-chain.yml`
- `.github/workflows/wallet-build.yml`
- `README.md`
- `docs/BUILD_AND_INSTALL_0.0.10.1.md`
- `scripts/validate-ci-workflow.mjs`

## 확인

```bash
git diff --check
git status --short
```
