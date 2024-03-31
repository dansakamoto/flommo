import { io } from "socket.io-client";
import { convertDropboxURL } from "../utils/urlConverter";
import session from "../session";
import { setupUI } from "../ui/setupUI";

const socket = io();

export async function loadRoomData() {
  if (session.roomID) {
    const URL = "/srclist?room=" + session.roomID;
    const result = await fetch(URL);
    const roomData = await result.json();
    session.updateSources(roomData.sources);
    session.applyMixerState(roomData.mixerState);
  }
  setupUI();
}

export function addSrc(type, data) {
  // TO DO (5 of 7): update to take demo init into account
  session.verifyInit();
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
  // TO DO (6 of 7): update to take demo init into account
  session.verifyInit();
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
  // TO DO (7 of 7): update to take  demo init into account
  session.verifyInit();
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

// TO DO (3 of 7): initialize room from demo - function
// get all sources and mixer state
// package into object containing:
//   array of sources
//   object for mixer settings
// send via socket
