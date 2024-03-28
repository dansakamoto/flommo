import { createEditorInstance } from "./utils/cmInstance";
import { saveMixerState } from "./services/data";

const hydraDefault = "osc().out()";
const p5Default =
  "// running in instance mode - functions must start with f.\n\nf.setup = () => " +
  "{\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}";

function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("room")) session.roomID = params.get("room");
}

function initNewRoom() {
  session.sources.length = 0;
  initRoomID();
}

function initRoomID() {
  session.roomID = Date.now();
  history.pushState({}, "", "?room=" + session.roomID);
}

function verifyInit() {
  if (!session.roomID) {
    initRoomID();
    // TO DO: check for existing demo sources + add to DB
  }
}

function updateSources(newSources) {
  session.sources = newSources;
}

function applyMixerState(mixerState) {
  if (mixerState.blendMode !== undefined)
    setBlendMode(mixerState.blendMode, false);
  if (mixerState.invert !== undefined) session.globalInvert = mixerState.invert;
}

function setBlendMode(mode, updateDB = true) {
  if (session.allBlendModes.includes(mode)) {
    session.blendMode = mode;
    if (updateDB) saveMixerState({ blend: mode });
  } else console.error("setBlendMode() error - mode not in list");
}

function toggleInvert(updateDB = true) {
  session.globalInvert = !session.globalInvert;
  if (updateDB) saveMixerState({ invert: session.globalInvert });
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
  initFromURL,
  initNewRoom,
  verifyInit,
  setBlendMode,
  updateSources,
  applyMixerState,
  toggleInvert,
  setMidiActive,
  setActivePanel,
};
export default session;
