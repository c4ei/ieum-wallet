# IEUM Wallet v1.0.2.2 — 지갑 백업과 화면 정리

## 해결한 문제

기존 버전은 새 지갑을 만들 때 SEED를 한 번만 보여 준 뒤 암호화 금고에는 개인키만 저장했습니다. 그래서 잠금 해제 후 백업 정보를 다시 확인하는 메뉴가 없었습니다.

v1.0.2.2부터 새로 만들거나 SEED로 복원한 지갑은 SEED를 개인키와 함께 AES-256-GCM 암호화 금고에 저장합니다. 기존 금고에는 과거에 저장하지 않은 SEED를 역산할 수 없으므로 개인키를 백업 수단으로 표시합니다. 개인키는 SEED와 마찬가지로 지갑 전체 권한이므로 경고 확인 후에만 노출됩니다.

USB 콜드월렛 영역은 기본적으로 접혀 있어 일반 송금 화면을 간결하게 유지합니다. 필요할 때 **펼치기**를 눌러 기존 오프라인 서명 기능을 그대로 사용합니다.

## 사용자 매뉴얼

### 지갑 백업

1. 월렛 잠금을 해제하고 **지갑 백업 → 펼치기**를 누릅니다.
2. 사람이 없는 안전한 환경인지 확인하고 경고 체크박스를 선택합니다.
3. **복구 정보 보기**를 누릅니다.
4. SEED 또는 개인키를 종이에 적어 오프라인에 보관합니다.
5. 기존 지갑에서 SEED가 보이지 않는 것은 오류가 아닙니다. 표시되는 개인키로 지갑을 동일하게 복원할 수 있습니다.
6. 화면 캡처, 이메일, 클라우드 메모, 메신저에는 저장하지 않습니다.

### 전송 내역 삭제

- 삭제 대상은 **이 기기에서 보낸 거래**의 로컬 목록뿐입니다.
- 블록체인의 확정 거래와 **최근 온체인 거래**는 삭제되거나 변경되지 않습니다.
- 완료·실패·유실 거래에는 **목록에서 삭제** 버튼이 표시됩니다.
- 처리 중·확정 지연 거래는 중복 송금 사고 방지를 위해 삭제할 수 없습니다.

## 환경변수와 Docker

새 환경변수와 비밀값은 없습니다. 월렛 프로젝트이므로 Docker/Manager 설정 변경도 없습니다.

## 버전 변수 확인

표시 버전 `1.0.2.2`, 내부 SemVer `1.0.2-2`를 `version.json`, npm, Cargo, Tauri 설정, 테스트와 문서에서 일치시킵니다.

```bash
npm run version:sync
npm run validate:release
npm run validate:ci
npm test
npm run build
cargo fmt --all --check --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

## Git·PR·태그·릴리스

```bash
git switch -c feat/v1.0.2.2-wallet-backup
git add -- CHANGELOG.md README.md docs/VERSION_1.0.2.2_WALLET_BACKUP_AND_HISTORY.md \
  version.json package.json package-lock.json src/App.tsx src/i18n.ts src/styles.css \
  src/transferHistory.ts src/transferHistory.test.ts src/vault.ts \
  src/wallet.test.ts src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json
git commit -m "feat: restore wallet backup controls"
git push -u origin feat/v1.0.2.2-wallet-backup
gh pr create --base main --head feat/v1.0.2.2-wallet-backup --draft \
  --title "IEUM Wallet v1.0.2.2 지갑 백업과 내역 관리" \
  --body "지갑 백업 재노출, 콜드월렛 접기, 안전한 로컬 전송내역 삭제를 추가합니다."
```

PR 병합과 CI 성공 후에만 `v1.0.2.2` 태그를 생성합니다. 태그 push가 월렛 빌드·릴리스를 시작하므로 같은 태그를 재생성하지 않습니다.
