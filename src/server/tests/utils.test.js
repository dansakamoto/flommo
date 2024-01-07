import { describe, test, expect, vi } from "vitest";
import { addSrc, delSrc, updateSrc, getSources } from "../utils/data";

describe("Test database interactions", async () => {
  test("Test getSources", async () => {
    const result = await getSources(1234);
    expect(mockQuery).toHaveBeenLastCalledWith(
      "SELECT * FROM sources WHERE room = '1234'"
    );
    expect(result).toEqual(["test"]);
  });

  test("Test addSrc", async () => {
    await addSrc(
      {
        room: 1234,
        type: "testType",
        src: "test source",
      },
      mockCallback
    );
    expect(mockQuery).toHaveBeenLastCalledWith({
      text: `INSERT INTO sources(room, type, data) VALUES($1, $2, $3)`,
      values: [1234, "testType", "test source"],
    });
    expect(mockCallback).toHaveBeenLastCalledWith({ message: "success" });
  });

  test("Test delSrc", async () => {
    await delSrc(
      {
        id: 4567,
      },
      mockCallback
    );
    expect(mockQuery).toHaveBeenLastCalledWith({
      text: `DELETE FROM sources WHERE id = $1`,
      values: [4567],
    });
    expect(mockCallback).toHaveBeenLastCalledWith({ message: "success" });
  });

  test("Test updateSrc with valid input", async () => {
    await updateSrc(
      {
        id: 4567,
        src: "test source",
        alpha: 0.75,
        active: false,
      },
      mockCallback
    );
    expect(mockQuery).toHaveBeenLastCalledWith({
      text: "UPDATE sources SET data = $1,alpha = $2,active = $3 WHERE id = $4",
      values: ["test source", 0.75, false, 4567],
    });
    expect(mockCallback).toHaveBeenLastCalledWith({ message: "success" });
  });

  test("Test updateSrc with invalid input", async () => {
    await updateSrc({}, mockCallback);
    expect(mockCallback).toHaveBeenLastCalledWith({ message: "failure" });
  });
});

const mockQuery = vi.fn(() => {
  return { rows: ["test"] };
});

vi.mock("pg", () => {
  class Pool {
    on = vi.fn();
    connect = async () => {
      return {
        query: mockQuery,
        release: vi.fn(),
      };
    };
  }
  return { default: { Pool: Pool } };
});

const mockCallback = vi.fn();
