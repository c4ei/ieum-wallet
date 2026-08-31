# IEUM Wallet v1.0.3.1 — 금고 복구와 비밀번호 관리

## 해결한 문제

v1.0.2.2는 잠금 해제 후 SEED·개인키를 다시 확인할 수 있었지만 암호화 금고 파일 자체를 내보내거나 가져올 수 없었습니다. 신규 생성 화면도 사용자의 백업 여부를 체크박스로만 확인했고 비밀번호 변경과 안전한 기기 초기화가 없었습니다.

v1.0.3.1은 저장된 AES-256-GCM 암호문을 복호화하지 않고 `.aahvault`로 내보냅니다. 가져오기는 사용자가 입력한 비밀번호로 복호화하고 개인키에서 계산한 주소가 금고 주소와 같은지 검사한 뒤에만 저장합니다.

## 사용자 매뉴얼

### 암호화 금고 내보내기·가져오기

1. 지갑을 열고 **지갑 백업 → 암호화 금고 파일 내보내기**를 누릅니다.
2. 파일은 운영체제의 기본 **다운로드** 폴더에 저장됩니다. Windows는 파일 탐색기, macOS는 Finder, Linux는 파일 관리자에서 다운로드 폴더를 엽니다. 브라우저 다운로드 목록의 **폴더에서 보기**로도 찾을 수 있습니다.
3. `.aahvault` 파일과 비밀번호를 서로 다른 안전한 장소에 보관합니다.
4. 복구할 때 잠금 화면의 **다른 PC의 암호화 금고 가져오기**를 펼치고 금고 비밀번호를 입력한 뒤 파일을 선택합니다.
5. 지갑 열기 비밀번호와 가져오기 비밀번호 입력칸은 서로 공유되지 않습니다.
6. 기존 지갑이 있는 기기에서는 교체할 지갑 주소를 확인한 뒤 승인합니다.
7. 가져온 뒤 표시 주소가 기록해 둔 주소와 같은지 반드시 확인합니다.

금고 파일은 암호화되어도 SEED와 같은 중요 백업입니다. 이메일·공개 클라우드·메신저에 올리지 않습니다.

### SEED 백업 확인

신규 지갑 생성 또는 SEED 복원 시 월렛이 무작위로 고른 3개 위치의 단어를 다시 입력합니다. 세 단어가 모두 일치해야 저장할 수 있습니다. 이 검사는 사용자가 실제로 오프라인 기록을 확인하도록 돕지만 백업의 안전성을 보증하지는 않습니다.

### 비밀번호 변경

1. **내 정보 → 지갑 비밀번호 변경**을 엽니다.
2. 현재 비밀번호와 8자 이상의 새 비밀번호를 입력합니다.
3. 기존 금고를 현재 비밀번호로 검증한 뒤 새 비밀번호로 다시 암호화합니다.
4. 이전에 내보낸 금고 파일은 당시 비밀번호를 계속 사용하므로 필요하면 새 파일을 다시 내보냅니다.

### 안전한 초기화

1. SEED·개인키 또는 `.aahvault` 백업으로 복구 가능한지 먼저 확인합니다.
2. **내 정보 → 이 기기의 지갑 초기화**를 엽니다.
3. 현재 비밀번호와 화면의 `0x` 지갑 주소 전체를 입력합니다.
4. 마지막 경고를 승인하면 이 기기의 금고 파일만 삭제됩니다. 온체인 자산과 거래는 삭제되지 않습니다.

## 보안·호환성

- 기존 v1 금고 형식과 PBKDF2-SHA256 310,000회, AES-256-GCM을 유지합니다.
- 평문 SEED·개인키를 내보내기 파일로 새로 만들지 않습니다.
- 잠금 실패는 1·2·4·8·16·30초로 지연되며 앱 재시작 시 초기화됩니다.
- 새 환경변수, 외부 API, 의존성은 없습니다.
- 월렛 프로젝트이므로 Docker 및 Manager `.env` 변경은 없습니다.

## 버전 변수 확인

표시 버전은 `1.0.3.1`, npm·Cargo·Tauri 내부 버전은 `1.0.3-1`입니다.

```bash
npm run version:sync
npm run validate:ci
npm run validate:release
npm test
npm run build
cargo fmt --all --check --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

## Git·PR·태그·릴리스

```bash
git switch -c feat/v1.0.3.1-vault-recovery
git add -- AGENTS.md CHANGELOG.md README.md docs src version.json package.json package-lock.json src-tauri
git commit -m "feat: add verified wallet vault recovery"
git push -u origin feat/v1.0.3.1-vault-recovery
gh pr create --base main --head feat/v1.0.3.1-vault-recovery --draft \
  --title "IEUM Wallet v1.0.3.1 금고 복구와 비밀번호 관리"
```

PR CI, Rust 검사와 수동 복구 시험이 성공하고 `main` 병합이 끝난 뒤에만 다음 태그를 생성합니다.

```bash
git switch main
git pull --ff-only origin main
git tag -a v1.0.3.1 -m "IEUM Wallet v1.0.3.1"
git push origin v1.0.3.1
```

태그 push가 Light·Normal 릴리스 빌드를 시작합니다. `wallet-light-latest`, `wallet-normal-latest`, 업데이트 `latest.json`과 설치 파일 서명이 모두 갱신됐는지 확인합니다.

## 롤백

문제가 있으면 v1.0.2.2 설치 파일로 되돌릴 수 있습니다. 금고 형식은 변경하지 않아 호환되지만, v1.0.3.1에서 비밀번호를 변경했다면 새 비밀번호를 사용해야 합니다. 초기화한 로컬 금고는 백업 없이는 롤백으로 복구되지 않습니다.
