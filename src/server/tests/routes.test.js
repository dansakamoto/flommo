import { describe, test, expect, vi } from "vitest";
import { srcList } from "../routes/srcList";

describe("Test Routes", () => {
  test("Test srcList route", async () => {
    await srcList(mockReq, mockRes);
    expect(mockSend).toHaveBeenCalledWith("test response");
  });
});

vi.mock(
  "../utils/data.js",
  vi.fn(() => {
    return {
      getSources: () => {
        return "test response";
      },
    };
  })
);

const mockSend = vi.fn();

const mockReq = {
  query: {
    room: 1234,
  },
};
const mockRes = {
  send: mockSend,
};
