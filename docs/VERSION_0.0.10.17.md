# IEUM Wallet v0.0.10.17 — 업데이트 서명키 교체

## 작업 배경

기존 Tauri 업데이트 개인 서명키가 공개 Git 저장소에 포함된 것을 확인했습니다.

공개된 개인키는 더 이상 안전한 키로 간주할 수 없으므로 기존 키를 폐기하고 새로운 업데이트 서명키로 교체했습니다.

## 보안 변경

- `ieum-wallet-updater.key` 개인키를 Git 추적 대상에서 제거했습니다.
- 개인 서명키가 다시 추가되지 않도록 `.gitignore`에 등록했습니다.
- 새로운 Tauri 업데이트 서명키 쌍을 생성했습니다.
- 새로운 개인키를 GitHub Actions Secret에 등록했습니다.
- 새로운 공개키를 GitHub Actions Variable과 월렛 설정에 반영했습니다.
- 패키지 및 Display version을 `0.0.10.17`로 올렸습니다.
- GitHub Actions 수동 릴리스 기본 버전을 `0.0.10.17`로 수정했습니다.

## GitHub Actions 설정

다음 항목이 GitHub 저장소 설정에 등록되어 있어야 합니다.

- Secret `TAURI_SIGNING_PRIVATE_KEY`
- Secret `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- Variable `TAURI_UPDATER_PUBLIC_KEY`

개인 서명키와 비밀번호는 소스, 로그, 문서 및 빌드 산출물에 포함하면 안 됩니다.

## 기존 사용자 주의사항

v0.0.10.16 이하의 기존 설치본은 이전 공개키를 신뢰합니다.

v0.0.10.17부터 새로운 공개키를 사용하므로 기존 설치본에서 자동 업데이트 검증이 실패할 수 있습니다. 기존 사용자는 공식 GitHub Release에서 v0.0.10.17 설치 파일을 내려받아 한 번 재설치해야 합니다.

v0.0.10.17을 설치한 이후부터는 새로운 서명키를 사용하는 자동 업데이트가 가능합니다.

## 검증

```bash
DISPLAY_VERSION=0.0.10.17 npm run validate:release
npm run validate:ci
npm run build
npm test


# 현재 HEAD에 태그 재생성 및 푸시
git push origin HEAD:main
git tag -a v0.0.10.17 -m "IEUM Wallet v0.0.10.17"
git push origin v0.0.10.17

