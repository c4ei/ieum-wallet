import { webcrypto } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createRoomSecret,
  decryptChat,
  encryptChat,
  isTrustedCommunication,
  type ChatMessage,
  type CommunicationEnvelope
} from "./communication";

beforeAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
});

describe("통신 발신자 검증", () => {
  const peerId = "12D3KooW123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const message: ChatMessage = {
    id: "message-1",
    scope: "direct",
    roomId: "room",
    senderAddress: "0x0000000000000000000000000000000000000001",
    senderName: "친구",
    text: "안녕하세요",
    sentAt: "2026-08-20T00:00:00.000Z"
  };
  const envelope: CommunicationEnvelope = {
    id: "envelope-1",
    sender_peer_id: peerId,
    target_peer_id: "local-peer",
    kind: "encrypted_chat",
    created_at: 1,
    expires_at: 91,
    encrypted_payload_hex: "00"
  };
  const friends = [{
    id: "friend-1",
    name: "친구",
    address: message.senderAddress,
    peerId,
    createdAt: message.sentAt
  }];

  it("주소와 PeerId가 모두 일치할 때만 신뢰한다", () => {
    expect(isTrustedCommunication(envelope, message, friends)).toBe(true);
    expect(isTrustedCommunication({ ...envelope, sender_peer_id: `${peerId}A` }, message, friends)).toBe(false);
    expect(isTrustedCommunication(envelope, { ...message, senderAddress: "0x0000000000000000000000000000000000000002" }, friends)).toBe(false);
  });
});

describe("종단간 암호화 채팅", () => {
  it("올바른 방 키만 메시지를 복호화한다", async () => {
    const secret = createRoomSecret();
    const message: ChatMessage = {
      id: "message-0123456789",
      scope: "direct",
      roomId: "room-1",
      senderAddress: "0x0000000000000000000000000000000000000001",
      senderName: "나",
      text: "안전한 메시지",
      sentAt: new Date().toISOString()
    };
    const encrypted = await encryptChat(message, secret);
    expect(encrypted).not.toContain(message.text);
    await expect(decryptChat(encrypted, secret)).resolves.toEqual(message);
    await expect(decryptChat(encrypted, createRoomSecret())).rejects.toBeDefined();
  });
});
