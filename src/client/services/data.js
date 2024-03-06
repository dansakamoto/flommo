import { io } from "socket.io-client";
import { convertDropboxURL } from "../utils/urlConverter";
import session from "../session";
import { setupUI } from "../ui/setupUI";

const socket = io();

export async function loadSources() {
  if (session.roomID) {
    const URL = "/srclist?room=" + session.roomID;
    const result = await fetch(URL);
    const newSources = await result.json();
    session.updateSources(newSources);
  }
  setupUI();
}

export function addSrc(type, data) {
  session.verifyInit();
  if (type === "video") data = convertDropboxURL(data);
  socket.emit(
    "uploadSrc",
    { room: session.roomID, type: type, src: data },
    (status) => {
      if (status.message === "success") loadSources();
    }
  );
}

export function updateSrc(id, data, refreshAfter = true) {
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
    else if (refreshAfter && status.message === "success") loadSources();
  });
}

export function delSrc(id) {
  session.verifyInit();
  socket.emit("delSrc", { id: id }, (status) => {
    if (status.message === "success") loadSources();
  });
}
