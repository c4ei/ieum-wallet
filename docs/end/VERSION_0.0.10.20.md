# IEUM Wallet v0.0.10.20 — 선택형 신뢰 통신과 로그인 편의

## 변경 사항

- 잠금 화면이 처음 표시될 때 지갑 비밀번호 입력란으로 커서를 자동 이동한다.
- 브라우저 비밀번호 관리자에 현재 지갑 비밀번호 입력란임을 알린다.
- Light와 Normal 월렛 모두 채팅과 WebRTC 통화를 지원한다.
- 통신 수신의 기본값은 꺼짐이며, 사용자가 채팅 화면에서 명시적으로 켠 동안에만 메시지와 통화 신호를 확인한다.
- 복호화 성공만으로 메시지를 표시하지 않고, 선택한 친구의 지갑 주소와 PeerId가 통신 봉투와 모두 일치할 때만 처리한다.
- 고정 `wallet-light-latest`, `wallet-normal-latest` 릴리스는 새 빌드 전에 기존 첨부 파일을 정리하여 최신 빌드 파일만 남긴다. 버전별 태그와 릴리스 기록은 삭제하지 않는다.

## 송금자를 친구로 자동 추가할 수 없는 이유

확정 거래에는 발신 지갑 주소가 있지만 화상채팅에 필요한 libp2p PeerId와 64자리 종단간 암호화 방 키는 없다. 주소만 보고 친구로 자동 등록하면 스팸 송금으로 주소록을 채울 수 있고, 해당 주소가 실제 PeerId 소유자라는 보장도 없다. 따라서 현재 버전은 자동 친구 등록을 하지 않는다.

안전하게 구현하려면 차기 체인 프로토콜에 다음 절차가 필요하다.

1. Normal 월렛이 지갑 개인키로 `지갑 주소 + PeerId + 만료 시각`을 서명한다.
2. 상대 Normal 월렛은 송금 확정 거래의 `from` 주소와 서명 주소가 같은지 검증한다.
3. 자동 친구가 아니라 `연락처 요청`으로 표시하고 사용자가 승인한다.
4. 방 키는 승인 후 별도 키 합의로 생성하며 체인이나 서버에 평문 저장하지 않는다.

## 검증 명령

```bash
DISPLAY_VERSION=0.0.10.20 npm run validate:release
npm run validate:ci
npm run build
npm test

cd src-tauri
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
```

이번 변경본에서 Web/TypeScript 빌드와 10개 테스트 파일의 22개 테스트는 통과했다. 작업 환경에 Rust 도구 모음이 없어 Rust 포맷·Clippy·테스트는 실행하지 못했으므로, PR CI 또는 개발 PC에서 위 명령으로 반드시 확인한다.

## 운영 확인이 더 필요한 항목

- 서로 다른 두 실제 기기의 Light ↔ Light, Light ↔ Normal, Normal ↔ Normal 채팅·WebRTC 연결
- NAT 환경에서 운영 TURN 단기 자격증명 발급과 영상·음성 품질
- 최신 IEUM Chain과의 통신 봉투 `sender_peer_id` 검증 E2E
- Tauri 서명키를 사용한 Windows·Ubuntu 설치 파일과 자동 업데이트
- UI에서 숨긴 USDT 교환과 광고 보상은 운영 서버 계약이 완성되기 전까지 사용자 기능으로 보지 않는다.

따라서 자동 테스트가 통과한 범위는 배포 후보 수준이지만, 실제 기기와 운영 서버까지 포함한 “버그 0개·100% 보증” 상태로 표현해서는 안 된다.

## dev 커밋, PR, 태그 및 배포

```bash
git switch dev
git pull --ff-only origin dev
git add -- package.json package-lock.json README.md \
  src/App.tsx src/communication.ts src/communication.test.ts \
  src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json \
  .github/workflows/wallet-build.yml docs/VERSION_0.0.10.20.md
git commit -m "fix: restrict trusted communication to Normal wallet v0.0.10.20"
git push origin dev
```

GitHub에서 `dev`를 head, `main`을 base로 PR을 만들고 CI 성공 후 병합한다. 병합 후:

```bash
git switch main
git pull --ff-only origin main
git tag -a v0.0.10.20 -m "IEUM Wallet v0.0.10.20"
git push origin v0.0.10.20

gh workflow run wallet-build.yml --ref main \
  -f version=0.0.10.20 \
  -f core_ref=latest \
  -f normal_only=false \
  -f android_release=false
```

릴리스 워크플로에는 Tauri 서명 비밀키와 공개키 변수가 설정되어 있어야 한다.
