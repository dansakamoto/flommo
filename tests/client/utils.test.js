import { test, expect, describe } from "vitest";
import { convertDropboxURL } from "../../src/client/utils/urlConverter";

describe("dropbox url converter", () => {
  test("test with valid URL", () => {
    expect(convertDropboxURL("http://www.dropbox.com/testurl")).toBe(
      "http://dl.dropboxusercontent.com/testurl"
    );
  });

  test("test with invalid URL", () => {
    expect(convertDropboxURL("http://www.example.com/testurl")).toBe(
      "http://www.example.com/testurl"
    );
  });
});
