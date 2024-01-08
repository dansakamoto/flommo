export var midiActive = false;
export var blendMode = "source-over";
export var gInvert = false;

export const blendModes = ["source-over", "screen", "multiply", "difference"];

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
