import { io } from "socket.io-client";
import { room } from "../models/sources";
import { refreshSources } from "../controllers/editor";

const socket = io();

export async function fetchSources(room) {
  const URL = "/srclist?room=" + room;
  const response = await fetch(URL);
  return response.json();
}

export function addSrc(type, data) {
  socket.emit("uploadSrc", { room: room, type: type, src: data }, (status) => {
    if (status.message === "success") refreshSources(room);
  });
}

export function updateSrc(id, data, refreshAfter = true) {
  data["id"] = id;
  socket.emit("updateSrc", data, (status) => {
    if (status.message === "failure")
      console.error("error syncing source state");
    else if (refreshAfter && status.message === "success") refreshSources(room);
  });
}

export function delSrc(id) {
  socket.emit("delSrc", { id: id }, (status) => {
    if (status.message === "success") refreshSources(room);
  });
}
