# IEUM Wallet v1.0.2.1 — 받은 거래 포함 온체인 내역

## 해결한 문제

v1.0.2.0의 `최근 전송`은 이 기기에서 직접 보낸 거래만 로컬 저장소에서 보여 주었습니다. 상품권이나 다른 지갑에서 받은 IEUM은 잔액에는 반영되지만 거래내역에는 나타나지 않았습니다.

v1.0.2.1은 공식 IEUM Manager의 확정 주소 거래를 조회해 다음 두 목록을 분리합니다.

- **최근 온체인 거래**: 확정된 `받음`, `보냄`, `내 주소 이동`
- **이 기기에서 보낸 거래**: 전송 직후의 처리 중·확정 지연·안전 재전파 상태

Manager 거래내역 조회가 일시적으로 실패해도 RPC 잔액 조회와 송금 기능은 계속 사용할 수 있습니다.

## 사용자 매뉴얼

1. 월렛 잠금을 해제합니다.
2. **새로고침**을 누릅니다.
3. 잔액 아래 **최근 온체인 거래**를 확인합니다.
4. 초록색 `받음`은 외부 지갑·상품권에서 받은 거래입니다.
5. 노란색 `보냄`은 이 주소가 보낸 확정 거래입니다.
6. 각 목록은 5건 단위로 **이전/다음** 페이지를 이동합니다.

Manager 인덱서 반영까지 몇 초 걸릴 수 있습니다. 잔액이 먼저 늘고 내역이 늦게 보이면 잠시 후 새로고침합니다.

## 연결·환경변수

기본 Manager 주소는 코드에 안전하게 고정된 `https://iem.aah.name`입니다. 빌드 시 다음 선택 변수를 사용할 수 있지만 Rust 계층은 공식 HTTPS 호스트만 허용합니다.

```dotenv
VITE_MANAGER_URL=https://iem.aah.name
```

기존 RPC 환경변수는 그대로 유지하며 새로운 필수 비밀값은 없습니다.

## 버전 변수 확인

표시 버전 `1.0.2.1`, 내부 SemVer `1.0.2-1`이 다음 파일에서 일치해야 합니다.

- `version.json`
- `package.json`, `package-lock.json`
- `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`
- `src-tauri/tauri.conf.json`
- `src/wallet.test.ts`

```bash
npm run version:sync
npm test
npm run build
cargo fmt --all --check --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

## Git·PR·태그·릴리스

```bash
git switch -c fix/v1.0.2.1-received-history
git status --short
git add -- CHANGELOG.md README.md version.json package.json package-lock.json \
  src/addressHistory.ts src/addressHistory.test.ts src/App.tsx src/styles.css src/vite-env.d.ts \
  src/wallet.test.ts src-tauri/src/lib.rs src-tauri/Cargo.toml src-tauri/Cargo.lock \
  src-tauri/tauri.conf.json docs/VERSION_1.0.2.1_RECEIVED_HISTORY.md
git commit -m "feat: show received on-chain transactions in wallet"
git push -u origin fix/v1.0.2.1-received-history
gh pr create --base main --head fix/v1.0.2.1-received-history --draft \
  --title "IEUM Wallet v1.0.2.1 받은 거래 내역" \
  --body "받은 거래를 포함한 확정 온체인 내역을 추가합니다."
```

PR 병합과 CI 성공 후 4자리 표시 버전으로 태그합니다.

```bash
git switch main
git pull --ff-only origin main
test "$(node -p "require('./version.json').displayVersion")" = "1.0.2.1"
git tag -a v1.0.2.1 -m "IEUM Wallet v1.0.2.1"
git push origin v1.0.2.1
```

태그 push가 Wallet 빌드·릴리스를 시작하므로 같은 버전 태그를 반복 생성하지 않습니다.
