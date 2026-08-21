import { describe, expect, it } from "vitest";
import { translateText } from "./i18n";

describe("wallet internationalization", () => {
  it("keeps Korean source text", () => expect(translateText("지갑 열기", "ko")).toBe("지갑 열기"));
  it("translates static and dynamic text", () => {
    expect(translateText("지갑 열기", "en")).toBe("Open wallet");
    expect(translateText("2.5 IEUM를 보낼까요?", "en")).toBe("Send 2.5 IEUM?");
    expect(translateText("잔액이 보낼 수량과 네트워크 수수료의 합보다 부족합니다.", "en"))
      .toBe("The balance is insufficient for the amount plus the network fee.");
  });
});
