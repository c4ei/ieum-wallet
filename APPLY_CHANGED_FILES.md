# IEUM Wallet v0.0.10.26 변경분 적용

```bash
cd ~/www/ieum-wallet
git switch dev
tar -xJf ~/다운로드/ieum-wallet-v0.0.10.26-changed-only.tar.xz
DISPLAY_VERSION=0.0.10.26 npm run validate:release
npm run validate:ci
npm ci
npm run build
npm test
cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

PR을 main에 병합한 뒤 Chain v0.23.12 배포가 완료된 것을 확인하고 실행합니다.

```bash
gh workflow run wallet-build.yml --ref main \
  -f version=0.0.10.26 \
  -f core_ref=v0.23.12 \
  -f normal_only=false \
  -f android_release=false
```
