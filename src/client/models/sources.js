export var room;
export var sources = [];

export function clearSources() {
  sources.length = 0;
}

export function initRoom() {
  const params = new URLSearchParams(window.location.search);
  room = params.get("room") ? params.get("room") : Date.now();
  if (!params.get("room")) history.pushState({}, "", "?room=" + room);
}

export function replaceSources(newSources) {
  sources = newSources;
}
