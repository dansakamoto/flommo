import { createEditorInstance } from "./utils/cmInstance";

const hydraDefault = "osc().out()";
const p5Default =
  "// running in instance mode - functions must start with f.\n\nf.setup = () => " +
  "{\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}";

function init() {
  const params = new URLSearchParams(window.location.search);
  session.roomID = params.get("room") ? params.get("room") : Date.now();
  if (!params.get("room")) history.pushState({}, "", "?room=" + session.roomID);
}

function clearSources() {
  session.sources.length = 0;
}

function updateSources(newSources) {
  session.sources = newSources;
}

function setBlendMode(mode) {
  if (session.allBlendModes.includes(mode)) session.blendMode = mode;
  else console.error("setBlendMode() error - mode not in list");
}

function toggleInvert() {
  session.globalInvert = !session.globalInvert;
  return session.globalInvert;
}

function setMidiActive(val) {
  session.midiActive = val;
}

function setActivePanel(val) {
  session.activePanel = val;
}

const session = {
  roomID: null,
  sources: [],
  activePanel: "none",
  midiActive: false,
  blendMode: "source-over",
  globalInvert: false,
  allBlendModes: ["source-over", "screen", "multiply", "difference"],
  newHydraEditor: createEditorInstance("hydraeditor", hydraDefault),
  newP5Editor: createEditorInstance("p5editor", p5Default),
  init,
  setBlendMode,
  updateSources,
  clearSources,
  toggleInvert,
  setMidiActive,
  setActivePanel,
};
export default session;
