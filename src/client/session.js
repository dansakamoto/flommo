import { createEditorInstance } from "./utils/cmInstance";

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

function applyBlendMode(mode) {
  session.blendMode = mode;
}

function setFilter(filter, active) {
  if (filter === "invert") session.globalInvert = active;
}

function applyMixerState(mixerState) {
  if (mixerState.blend !== undefined) applyBlendMode(mixerState.blend);
  if (mixerState.invert !== undefined) setFilter("invert", mixerState.invert);
}

function setMidiActive(val) {
  session.midiActive = val;
}

function setActivePanel(val) {
  session.activePanel = val;
}

function setMixerActive() {
  session.mixerInitialized = true;
}

const session = {
  roomID: null,
  mixerInitialized: false,
  sources: [],
  activePanel: "none",
  midiActive: false,
  blendMode: "source-over",
  globalInvert: false,
  allBlendModes: [
    ["source-over", "q"],
    ["screen", "w"],
    ["multiply", "e"],
    ["difference", "r"],
    ["overlay", "t"],
    ["darken", "y"],
    ["lighten", "u"],
    ["color-dodge", "i"],
    ["color-burn", "o"],
    ["hard-light", "p"],
    ["soft-light", "a"],
    ["exclusion", "s"],
    ["hue", "d"],
    ["saturation", "f"],
    ["color", "g"],
    ["luminosity", "h"],
  ],
  newHydraEditor: createEditorInstance("hydraeditor", hydraDefault),
  newP5Editor: createEditorInstance("p5editor", p5Default),
  initFromURL,
  initNewRoom,
  verifyInit,
  updateSources,
  applyBlendMode,
  setFilter,
  applyMixerState,
  setMidiActive,
  setActivePanel,
  setMixerActive,
};
export default session;
