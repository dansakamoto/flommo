import { io } from "socket.io-client";
import { roomID } from "../models/sources";
import { refreshSources } from "../controllers/editor";
import { convertDropboxURL } from "../utils/urlConverter";
import { sources } from "../models/sources";

const socket = io();

export async function fetchSources(roomID) {
  const URL = "/srclist?room=" + roomID;
  const response = await fetch(URL);
  return response.json();
}

export function addSrc(type, data) {
  if (type === "video") data = convertDropboxURL(data);
  socket.emit(
    "uploadSrc",
    { room: roomID, type: type, src: data },
    (status) => {
      if (status.message === "success") refreshSources(roomID);
    }
  );
}
export function updateSrc(id, data, refreshAfter = true) {
  data["id"] = id;

  const source = sources.find((obj) => {
    return obj.type === "video";
  });

  if (source && source.type === "video" && data.src) {
    data.src = convertDropboxURL(data.src);
  }
  socket.emit("updateSrc", data, (status) => {
    if (status.message === "failure")
      console.error("error syncing source state");
    else if (refreshAfter && status.message === "success")
      refreshSources(roomID);
  });
}

export function delSrc(id) {
  socket.emit("delSrc", { id: id }, (status) => {
    if (status.message === "success") refreshSources(roomID);
  });
}
