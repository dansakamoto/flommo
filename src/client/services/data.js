import { io } from "socket.io-client";
import { convertDropboxURL } from "../utils/urlConverter";
import session from "../session";
import { setupUI } from "../ui/setupUI";

const socket = io();

export async function loadRoomData() {
  let URL = "/srclist";
  if (session.roomID) URL += "?room=" + session.roomID;

  const result = await fetch(URL);
  const roomData = await result.json();
  session.updateSources(roomData.sources);
  session.applyMixerState(roomData.mixerState);

  setupUI();
}

export function addSrc(type, data) {
  if (type === "video") data = convertDropboxURL(data);

  if (!session.verifyInit()) {
    session.addSource({
      room: session.roomID,
      type: type,
      data: data,
      alpha: 1,
      active: true,
    });
    initFromDemo();
    loadRoomData();
  } else {
    socket.emit(
      "uploadSrc",
      { room: session.roomID, type: type, src: data },
      (status) => {
        if (status.message === "success") loadRoomData();
      }
    );
  }
}

export function updateSrc(id, data, refreshAfter = true) {
  if (!session.verifyInit()) {
    initFromDemo();
    loadRoomData();
  } else {
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
}

export function delSrc(id) {
  if (!session.verifyInit()) {
    session.deleteSource(id);
    initFromDemo();
    loadRoomData();
  } else {
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
  if (session.sources.length === 0) return;

  const sources = [];
  for (let s of session.sources) {
    sources.push({
      room: session.roomID,
      type: s.type,
      src: s.data,
      active: s.active,
      alpha: s.alpha,
    });
  }

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
