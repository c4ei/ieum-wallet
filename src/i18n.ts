export type Language = "ko" | "en";

const STORAGE_KEY = "ieum-language";

const english: Record<string, string> = {
  "가볍고 안전한 IEUM 지갑": "A light and secure IEUM wallet",
  "다시 오신 것을 환영해요": "Welcome back",
  "첫 지갑을 만들어 볼까요?": "Ready to create your first wallet?",
  "지갑 비밀번호": "Wallet password",
  "지갑 열기": "Open wallet",
  "새 지갑 만들기": "Create wallet",
  "지갑 복원": "Restore wallet",
  "← 돌아가기": "← Back",
  "SEED를 반드시 적어 두세요": "Write down your SEED phrase",
  "아래 12단어를 잃으면 지갑을 복구할 수 없습니다. 누구에게도 보여주지 마세요.": "If you lose these 12 words, your wallet cannot be recovered. Never share them.",
  "오프라인에 안전하게 백업했습니다.": "I backed it up safely offline.",
  "암호화 비밀번호(8자 이상)": "Encryption password (8+ characters)",
  "지갑 저장": "Save wallet",
  "기존 지갑 복원": "Restore an existing wallet",
  "12단어 SEED (SEED 또는 개인키 중 하나)": "12-word SEED (enter a SEED or private key)",
  "또는": "or",
  "0x로 시작하는 Private Key": "Private key starting with 0x",
  "새 지갑 비밀번호(8자 이상)": "New wallet password (8+ characters)",
  "SEED 백업 책임을 확인했습니다.": "I understand my responsibility to back up the SEED.",
  "복원하고 저장": "Restore and save",
  "IEUM 네트워크 연결됨": "Connected to the IEUM network",
  "연결 확인 필요": "Connection needs attention",
  "연결 문제": "Connection issue",
  "잠금": "Lock",
  "주요 기능": "Main features",
  "지갑": "Wallet",
  "이음마당": "IEUM Community",
  "USDT 교환": "USDT Swap",
  "광고 보상": "Ad rewards",
  "친구·그룹": "Friends & groups",
  "채팅": "Chat",
  "IEUM 사이트": "IEUM site",
  "내 정보": "Profile",
  "사용 가능 잔액": "Available balance",
  "잔액 새로고침": "Refresh balance",
  "주소 복사": "Copy address",
  "내 지갑 주소 QR": "My wallet address QR",
  "IEUM 보내기": "Send IEUM",
  "받는 주소": "Recipient address",
  "수량": "Amount",
  "기본 수수료: gas 21,000 × gasPrice 1 · IEUM Chain ID 21004": "Base fee: gas 21,000 × gasPrice 1 · IEUM Chain ID 21004",
  "확인 후 전송": "Review and send",
  "네트워크": "Network",
  "정상 연결됨": "Connected",
  "연결을 확인해 주세요": "Check the connection",
  "노드": "Node",
  "프로토콜": "protocol",
  "피어": "Peers",
  "동기화": "Sync",
  "최종 확정 블록": "Finalized block",
  "복구 상태": "Recovery status",
  "복구안 처리 중": "Recovery in progress",
  "정상": "Healthy",
  "설정 닫기": "Close settings",
  "문제 해결·고급 설정": "Troubleshooting & advanced settings",
  "IEUM 노드 RPC": "IEUM node RPC",
  "연결 다시 확인": "Check connection again",
  "읽기 전용 익스플로러": "Read-only explorer",
  "에디션": "Edition",
  "기본 RPC": "Default RPC",
  "최근 전송": "Recent transfers",
  "이전": "Previous",
  "다음": "Next",
  "최근 전송 내역이 없습니다.": "No recent transfers.",
  "처음 오셨나요?": "New to IEUM?",
  "공개 소스": "Open source",
  "IEUM 소식과 웹 서비스를 별도 보안 창에서 확인합니다.": "View IEUM news and web services in a separate secure window.",
  "IEUM 공식 사이트": "Official IEUM site",
  "IEUM 사이트 열기": "Open IEUM site",
  "웹사이트 창은 지갑의 개인키·SEED·서명 기능에 접근할 수 없습니다. 사이트 창을 닫아도 지갑은 계속 실행됩니다.": "The website window cannot access your private key, SEED, or signing functions. Closing it does not close the wallet.",
  "처음 사용 안내": "Getting started",
  "처음 오셨군요": "Welcome",
  "어렵지 않게 시작해 볼게요": "Let's get started",
  "내 이름 정하기": "Choose your name",
  "친구가 알아보기 쉬운 닉네임을 써요.": "Use a nickname your friends will recognize.",
  "주소 공유하기": "Share your address",
  "주소 복사나 QR로 안전하게 IEUM를 받아요.": "Receive IEUM safely with copy address or QR.",
  "SEED 지키기": "Protect your SEED",
  "이메일로는 지갑을 복구할 수 없어요.": "Email cannot recover your wallet.",
  "사용할 닉네임": "Nickname",
  "이메일 (선택)": "Email (optional)",
  "IEUM Wallet 시작하기": "Start IEUM Wallet",
  "송금 최종 확인": "Final transfer confirmation",
  "마지막 확인": "Final check",
  "예상 수수료": "Estimated fee",
  "블록체인 송금은 전송 후 취소할 수 없습니다.": "Blockchain transfers cannot be canceled after submission.",
  "확인하고 보내기": "Confirm and send",
  "취소": "Cancel"
};

const dynamicRules: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
  [/^(\d+)개$/, m => `${m[1]}`],
  [/^받는 주소 (.+)$/, m => `Recipient ${m[1]}`],
  [/^(\d+)명$/, m => `${m[1]} people`],
  [/^(\d+)분$/, m => `${m[1]} min`],
  [/^(.+) IEUM를 보낼까요\?$/, m => `Send ${m[1]} IEUM?`]
];

export function getLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "ko" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export function setLanguage(language: Language) {
  localStorage.setItem(STORAGE_KEY, language);
  location.reload();
}

export function translateText(value: string, language = getLanguage()): string {
  if (language === "ko") return value;
  const trimmed = value.trim();
  const direct = english[trimmed];
  if (direct) return value.replace(trimmed, direct);
  for (const [pattern, replace] of dynamicRules) {
    const match = trimmed.match(pattern);
    if (match) return value.replace(trimmed, replace(match));
  }
  return value;
}

function translateElement(root: ParentNode, language: Language) {
  if (language === "ko") return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("code")) continue;
    const translated = translateText(node.textContent ?? "", language);
    if (translated !== node.textContent) node.textContent = translated;
  }
  root.querySelectorAll<HTMLElement>("[placeholder],[aria-label],[title]").forEach(element => {
    for (const name of ["placeholder", "aria-label", "title"]) {
      const value = element.getAttribute(name);
      if (value) element.setAttribute(name, translateText(value, language));
    }
  });
}

export function installI18n(language: Language) {
  document.documentElement.lang = language;
  const apply = () => translateElement(document.body, language);
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
