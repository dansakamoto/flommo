export var roomID;
export var sources = [];

export function clearSources() {
  sources.length = 0;
}

export function initRoom() {
  const params = new URLSearchParams(window.location.search);
  roomID = params.get("room") ? params.get("room") : Date.now();
  if (!params.get("room")) history.pushState({}, "", "?room=" + roomID);
}

export function updateSources(newSources) {
  sources = newSources;
}
