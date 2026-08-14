# v0.0.10.13 최종 작업·배포 인수인계

## 큰 이벤트와 핵심 변경

지갑에 **이음마당** 탭을 추가했습니다. 초보자는 보유 응원 보상 계산, AAH 가입, 길드 참여, 세 공개 저장소를 한 화면에서 찾습니다. 커뮤니티 활동과 회원 관리는 `aah.name`을 사용하고 `iem.aah.name`은 체인·보상 공개 현황을 확인하는 곳입니다. 길드 생성비 1 IEUM은 재단지갑으로 보내지만 이 화면은 개인키를 전송하거나 보관하지 않습니다.

이음마당 지급 상태 버튼은 `open_ieum_explorer`, AAH 길드 커뮤니티 버튼은 `open_aah_club`을 호출합니다. Ubuntu 데스크톱에서는 각각 격리된 보안 WebView 창을 만들고 모바일에서는 기본 브라우저를 사용합니다. AAH 커뮤니티 주소는 `https://aah.name/club`입니다.

## 빌드

```bash
git clone https://github.com/c4ei/ieum-wallet.git
cd ieum-wallet
npm ci
npm test
npm run build
npm run build:ubuntu   # Ubuntu 데스크톱
# Windows 빌드 서버에서는 npm run build:windows
```

이번 링크 수정은 Rust/Tauri 명령을 추가하므로 `npm run build`만 실행해서는 안 됩니다. Ubuntu에서는 반드시 `npm run build:ubuntu`로 `.deb` 또는 AppImage를 새로 만든 뒤 기존 앱을 교체 설치해야 합니다.

릴리스 전 `npm run validate:release`를 실행하고 앱 버전, Tauri 버전, 패키지 파일이 모두 `0.0.10-13`인지 확인합니다. 배포 파일의 체크섬을 공개하고 기존 버전 자동 업데이트 경로를 시험합니다.

## GitHub PR과 승인

```bash
git switch -c feature/ieum-yard-v0.0.10.13
git add package.json package-lock.json src src-tauri docs
git commit -m "feat: add beginner-friendly IEUM community entry"
git push -u origin feature/ieum-yard-v0.0.10.13
gh pr create --draft --title "IEUM Wallet v0.0.10.13 이음마당" --body "예상 보상은 실제 지급 보장이 아님을 표시했습니다."
```

CI·UI 확인 후 리뷰 승인, Ready 전환, 병합, 태그 `v0.0.10.13` 순서로 진행합니다. 세부 변경은 `docs/VERSION_0.0.10.13.md`를 봅니다.
