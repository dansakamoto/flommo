import { io } from "socket.io-client";
import { convertDropboxURL } from "../utils/urlConverter";
import session from "../session";
import { setupUI } from "../ui/setupUI";
import demoData from "./demos";

const socket = io();

export async function loadRoomData() {
  if (session.roomID) {
    const URL = "/srclist?room=" + session.roomID;
    const result = await fetch(URL);
    const roomData = await result.json();
    session.updateSources(roomData.sources);
    session.applyMixerState(roomData.mixerState);
  } else {
    session.updateSources(demoData.sources);
    session.applyMixerState(demoData.mixerState);
  }
  setupUI();
}

export function addSrc(type, data) {
  console.log("addSrc() run");
  if (!session.verifyInit()) initFromDemo();

  if (type === "video") data = convertDropboxURL(data);
  socket.emit(
    "uploadSrc",
    { room: session.roomID, type: type, src: data },
    (status) => {
      if (status.message === "success") loadRoomData();
    }
  );
}

export function updateSrc(id, data, refreshAfter = true) {
  console.log("updateSrc() run");
  if (!session.verifyInit()) initFromDemo();

  data["id"] = id;

  const source = session.sources.find((obj) => {
    return obj.id === id;
  });

  if (source && source.type === "video" && data.src) {
    data.src = convertDropboxURL(data.src);
  }
  socket.emit("updateSrc", data, (status) => {
    if (status.message === "failure")
      console.error("error syncing source state");
    else if (refreshAfter && status.message === "success") loadRoomData();
  });
}

export function delSrc(id) {
  console.log("delSrc() run");
  if (!session.verifyInit()) initFromDemo();

  socket.emit("delSrc", { id: id }, (status) => {
    if (status.message === "success") {
      let panelNum;
      for (let i = 0; i < session.sources.length; i++) {
        if (session.sources[i].id === id) {
          panelNum = i;
          break;
        }
      }
      if (
        typeof session.activePanel === "number" &&
        session.activePanel > panelNum
      ) {
        session.setActivePanel(session.activePanel - 1);
      }
      loadRoomData();
    }
  });
}

export function setBlendMode(blendMode) {
  for (let b of session.allBlendModes) {
    if (blendMode === b[0]) {
      session.applyBlendMode(blendMode);
      if (session.roomID) {
        socket.emit(
          "updateMixer",
          { room: session.roomID, blend: blendMode },
          (status) => {
            if (status.message === "failure")
              console.error("error syncing mixer state");
          }
        );
      }
      break;
    }
  }
}

export function toggleInvert() {
  session.setFilter("invert", !session.globalInvert);
  if (session.roomID) {
    socket.emit(
      "updateMixer",
      { room: session.roomID, invert: session.globalInvert },
      (status) => {
        if (status.message === "failure")
          console.error("error syncing source state");
      }
    );
  }

  return session.globalInvert;
}

export function initFromDemo() {
  console.log("initFromDemo() called");
  if (session.sources.length === 0) return;

  const sources = session.sources;
  const mixerState = {
    room: session.roomID,
    blend: session.blendMode,
    invert: session.invert,
  };
  const roomState = { sources: sources, mixerState: mixerState };

  socket.emit("initFromDemo", roomState, (status) => {
    if (status.message === "failure")
      console.error("error initializing from demo");
  });
}
