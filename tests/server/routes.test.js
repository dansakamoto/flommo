import { describe, test, expect, vi } from "vitest";
import { srcList } from "../../src/server/routes/srcList.js";

vi.mock(
  "../../src/server/utils/data.js",
  vi.fn(() => {
    return {
      getSources: () => {
        return "test response";
      },
    };
  })
);

describe("Test Routes", () => {
  test("Test srcList route", async () => {
    await srcList(mockReq, mockRes);
    expect(mockSend).toHaveBeenCalledWith("test response");
  });
});

const mockSend = vi.fn();

const mockReq = {
  query: {
    room: 1234,
  },
};
const mockRes = {
  send: mockSend,
};
