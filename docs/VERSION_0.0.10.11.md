# IEUM Wallet v0.0.10.11 운영 연결·릴리스 안전 보강

## 변경 사항

- 공개된 `v0.0.10.10` 태그는 변경하지 않고 수정 릴리스를 `v0.0.10.11`로
  올렸습니다. 표시 버전은 `0.0.10.11`, npm/Cargo/Tauri 내부 버전은
  `0.0.10-11`입니다. 네 번째 숫자는 SemVer prerelease 구분자로 변환합니다.
- 데스크톱에서도 Explorer 열기 명령이 `AppHandle::opener()`를 사용하지만
  `OpenerExt` trait를 모바일에서만 import하던 문제를 수정했습니다. 이제 trait를
  공통 범위에서 import하여 Linux/Windows `tauri dev` 및 릴리스 빌드의
  `error[E0599]`를 해결합니다.
- 사용자가 선택한 RPC가 응답하지 않으면 `VITE_FALLBACK_RPC_URLS` 후보를 순서대로
  확인합니다. 후보마다 Chain ID `21004`와 고정 genesis hash를 다시 검사하며,
  호환되는 운영망 RPC만 활성화합니다.
- 실제 운영 RPC `https://irpc.aah.name`의 `ieum_networkIdentity` 응답을 기준으로
  genesis hash를 `0x497e04ac4faec01b78b57d3caef7951fca98b1928a1af558ea03a663aa622418`로
  고정하고 회귀 테스트 기대값도 함께 갱신했습니다.
- 자동 장애조치는 우선 조회·상태 확인에 적용하고, 선택된 단일 RPC를 저장한 뒤 송금을
  수행합니다. 여러 RPC로 동시에 송금하지 않습니다.
- 네트워크 문제 해결 영역에 `https://iem.aah.name` 읽기 전용 Explorer 버튼을
  추가했습니다. Explorer 창에는 seed·개인키·비밀번호를 전달하지 않습니다.
- updater 설정 스크립트가 빈 값, 자리표시자, minisign 형식이 아닌 공개키를 거부합니다.
- Normal Wallet 릴리스에는 IEUM Chain v0.22.5 태그를 지정하고 Release 본문에서 포함
  Core 버전을 확인해야 합니다.

## 빌드 환경

선택적으로 쉼표로 구분한 보조 RPC를 설정할 수 있습니다.

```bash
VITE_FALLBACK_RPC_URLS=https://irpc.aah.name,https://보조-RPC npm run build
```

## 검증

```bash
DISPLAY_VERSION=0.0.10.11 npm run validate:release
npm run validate:ci
npm run build
npm test
```

GitHub Actions 릴리스 전 `TAURI_SIGNING_PRIVATE_KEY`,
`TAURI_SIGNING_PRIVATE_KEY_PASSWORD`, `TAURI_UPDATER_PUBLIC_KEY`가 설정되어 있어야
합니다. 생성된 설치 파일의 SHA-256과 `latest.json` 서명을 릴리스 페이지에서 함께
확인하세요.

## 태그 및 릴리스

`v0.0.10.10` 태그를 삭제하거나 이동하지 않습니다. 이 변경을 반영한 커밋에 새 태그를
만듭니다.

```bash
git tag -a v0.0.10.11 -m "IEUM Wallet v0.0.10.11"
git push origin v0.0.10.11
```

`wallet-light-latest`, `wallet-normal-latest`처럼 최신 채널을 가리키는 이동형 태그는
`v0.0.10.11` 릴리스 산출물 검증이 끝난 뒤 갱신할 수 있습니다.
