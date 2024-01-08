import { io } from "socket.io-client";
import { convertDropboxURL } from "../utils/urlConverter";
import * as session from "../session";
import { setupUI } from "../ui/setupUI";

const socket = io();

export async function loadSources() {
  const URL = "/srclist?room=" + session.roomID;
  const result = await fetch(URL);
  const newSources = await result.json();
  session.updateSources(newSources);
  setupUI();
}

export function addSrc(type, data) {
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
  socket.emit("delSrc", { id: id }, (status) => {
    if (status.message === "success") loadSources();
  });
}
