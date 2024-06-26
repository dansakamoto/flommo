import { describe, test, expect, vi } from "vitest";
import {
  loadRoomData,
  addSrc,
  updateSrc,
  delSrc,
} from "../../src/client/services/data";

const mocks = vi.hoisted(() => {
  return {
    updateSources: vi.fn(),
    applyMixerState: vi.fn(),
    emit: vi.fn(),
  };
});

vi.mock("socket.io-client", () => {
  return {
    io: () => {
      return {
        emit: mocks.emit,
      };
    },
  };
});
vi.mock("../../src/client/session.js", () => {
  return {
    default: {
      roomID: 1234,
      updateSources: mocks.updateSources,
      applyMixerState: mocks.applyMixerState,
      verifyInit: () => {
        return true;
      },
      addSource: vi.fn(),
      updateSource: vi.fn(),
      deleteSource: vi.fn(),
      sources: [
        { id: 123, type: "hydra" },
        { id: 456, type: "video" },
      ],
    },
  };
});
vi.mock("../../src/client/ui/setupUI", () => {
  return { setupUI: vi.fn().mockName };
});
global.fetch = vi.fn(() => {
  return {
    json: () => {
      return { sources: "test sources", mixerState: "test mixerState" };
    },
  };
});

describe("Test client data functions", () => {
  test("loadRoomData()", async () => {
    await loadRoomData();
    expect(global.fetch).toHaveBeenLastCalledWith("/srclist?room=1234");
    expect(mocks.updateSources).toHaveBeenLastCalledWith("test sources");
    expect(mocks.applyMixerState).toHaveBeenLastCalledWith("test mixerState");
  });

  test("addSrc() non video type", () => {
    addSrc("hydra", "http://www.dropbox.com/testurl");
    expect(mocks.emit).toHaveBeenLastCalledWith(
      "uploadSrc",
      {
        room: 1234,
        src: "http://www.dropbox.com/testurl",
        type: "hydra",
      },
      expect.any(Function)
    );
  });

  test("addSrc() video type", () => {
    addSrc("video", "http://www.dropbox.com/testurl");
    expect(mocks.emit).toHaveBeenLastCalledWith(
      "uploadSrc",
      {
        room: 1234,
        src: "http://dl.dropboxusercontent.com/testurl",
        type: "video",
      },
      expect.any(Function)
    );
  });

  test("updateSrc() non-video", () => {
    mocks.updateSources.mockClear();
    updateSrc(123, { src: "http://www.dropbox.com/testurl" }, false);
    expect(mocks.emit).toHaveBeenLastCalledWith(
      "updateSrc",
      {
        id: 123,
        src: "http://www.dropbox.com/testurl",
      },
      expect.any(Function)
    );
  });

  test("updateSrc() video", () => {
    updateSrc(456, { src: "http://www.dropbox.com/testurl" }, false);
    expect(mocks.emit).toHaveBeenLastCalledWith(
      "updateSrc",
      {
        id: 456,
        src: "http://dl.dropboxusercontent.com/testurl",
      },
      expect.any(Function)
    );
  });

  test("delSrc()", () => {
    delSrc(1234);
    expect(mocks.emit).toHaveBeenLastCalledWith(
      "delSrc",
      {
        id: 1234,
      },
      expect.any(Function)
    );
  });
});
