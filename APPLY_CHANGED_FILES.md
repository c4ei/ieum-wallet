# IEUM Wallet v0.0.10.25 변경분 적용

```bash
cd ~/www/ieum-wallet
git switch dev
tar -xJf ~/다운로드/ieum-wallet-v0.0.10.25-changed-only.tar.xz
npm ci
npm run build
npm test
cd src-tauri
cargo fmt --all --check
cargo clippy --all-targets --locked -- -D warnings
cargo test --locked
```

검증 뒤 커밋·push하고 PR을 main에 병합합니다. Release는 Chain v0.23.11 배포 후
다음 입력으로 실행합니다.

```bash
gh workflow run wallet-build.yml --ref main \
  -f version=0.0.10.25 \
  -f core_ref=v0.23.11 \
  -f normal_only=false \
  -f android_release=false
```

워크플로의 빠른 검증 job이 성공해야 긴 OS별 빌드가 시작됩니다.
