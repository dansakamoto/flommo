import { createEditorInstance } from "./utils/cmInstance";

export var roomID;
export var activePanel;
export var sources = [];

export var midiActive = false;

export const blendModes = ["source-over", "screen", "multiply", "difference"];
export var blendMode = "source-over";
export var gInvert = false;

const hydraDefault = "osc().out()";
const p5Default =
  "// running in instance mode - functions must start with f.\n\nf.setup = () => " +
  "{\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}";

export const hydraEditor = createEditorInstance("hydraeditor", hydraDefault);
export const p5Editor = createEditorInstance("p5editor", p5Default);

export function init() {
  const params = new URLSearchParams(window.location.search);
  roomID = params.get("room") ? params.get("room") : Date.now();
  if (!params.get("room")) history.pushState({}, "", "?room=" + roomID);
}

export function clearSources() {
  sources.length = 0;
}

export function updateSources(newSources) {
  sources = newSources;
}

export function setBlendMode(mode) {
  if (blendModes.includes(mode)) blendMode = mode;
  else console.error("setBlendMode() error - mode not in list");
}

export function toggleInvert() {
  gInvert = !gInvert;
  return gInvert;
}

export function setMidiActive(val) {
  midiActive = val;
}

export function setActivePanel(val) {
  activePanel = val;
}
