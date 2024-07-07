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

export function addSrc(type, data, active = true) {
  if (type === "video") data = convertDropboxURL(data);

  const newSource = {
    room: session.roomID,
    type: type,
    data: data,
    alpha: 1,
    active: active,
    id: Date.now(),
  };

  session.addSource(newSource);

  if (!session.verifyInit()) {
    initFromDemo();
  } else {
    socket.emit(
      "uploadSrc",
      { room: session.roomID, type: type, src: data, active: active },
      (status) => {
        if (status.message === "success") {
          newSource.id = status.id;
          setupUI();
        } else console.error("Error adding source to database");
      }
    );
  }
}

export function updateSrc(id, data, refreshAfter = true) {
  data["id"] = id;

  const source = session.sources.find((obj) => {
    return obj.id === id;
  });

  if (source && source.type === "video" && data.src) {
    data.src = convertDropboxURL(data.src);
  }

  source.data = data.src;

  if (!session.verifyInit()) {
    initFromDemo();
  } else {
    setupUI();
    socket.emit("updateSrc", data, (status) => {
      if (status.message !== "success")
        console.error("error syncing source state");
      else if (refreshAfter && status.message === "success") loadRoomData();
    });
  }
}

export function delSrc(id) {
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

  session.deleteSource(id);

  if (!session.verifyInit()) {
    initFromDemo();
  } else {
    setupUI();
    socket.emit("delSrc", { id: id }, (status) => {
      if (status.message !== "success") {
        console.error("error deleting source from database");
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
    if (status.message === "failure") {
      console.error("error initializing from demo");
    } else {
      loadRoomData();
    }
  });
}
