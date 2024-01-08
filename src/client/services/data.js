import { io } from "socket.io-client";
import { room } from "../models/sources";
import { refreshSources } from "../controllers/editor";
const socket = io();

export async function fetchSources(room) {
  const URL = "/srclist?room=" + room;
  const response = await fetch(URL);
  return await response.json();
}

export function uploadP5(code) {
  socket.emit("uploadSrc", { room: room, type: "p5", src: code }, (status) => {
    if (status.message === "success") refreshSources(room);
  });
}

export function uploadHydra(code) {
  socket.emit(
    "uploadSrc",
    { room: room, type: "hydra", src: code },
    (status) => {
      if (status.message === "success") refreshSources(room);
    }
  );
}

export function uploadVid(url) {
  socket.emit(
    "uploadSrc",
    { room: room, type: "video", src: url },
    (status) => {
      if (status.message === "success") refreshSources(room);
    }
  );
}

export function updateSrc(id, data) {
  socket.emit("updateSrc", { id: id, src: data }, (status) => {
    if (status.message === "success") refreshSources(room);
  });
}

export function bgUpdateSrc(id, data) {
  socket.emit("updateSrc", { id: id, active: data }, (status) => {
    if (status.message === "failure")
      console.error("error syncing source state");
  });
}

export function delSrc(id) {
  socket.emit("delSrc", { id: id }, (status) => {
    if (status.message === "success") refreshSources(room);
  });
}
