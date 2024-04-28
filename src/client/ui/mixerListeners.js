import { updateSrc, toggleInvert, setBlendMode } from "../services/data";
import { togglePanel } from "./menuListeners";
import session from "../session";

export { updateAlpha, toggleSrc };

export function initMixerListeners() {
  if ("requestMIDIAccess" in navigator) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }
  for (const b of session.allBlendModes) {
    document.getElementById(b[0]).onchange = () => {
      setBlendMode(b[0]);
    };
  }
  document.getElementById("invert").onchange = () => {
    toggleInvert();
  };
  document.getElementById("midion").onchange = () => {
    toggleMidi();
  };
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.ctrlKey && event.shiftKey) {
        if (event.key === "Z") {
          togglePanel("video");
        } else if (event.key === "X") {
          togglePanel("hydra");
        } else if (event.key === "C") {
          togglePanel("p5");
        } else if (event.key === "/") {
          togglePanel("info");
        } else if (event.key === ".") {
          togglePanel("title");
        }
      } else if (event.getModifierState("CapsLock")) {
        if (event.code !== "Space" && event.key >= 0 && event.key <= 9) {
          event.preventDefault();

          session.sources[event.key - 1].active =
            !session.sources[event.key - 1].active;
          updateSrc(
            session.sources[event.key - 1].id,
            { active: session.sources[event.key - 1].active },
            false
          );
          document.querySelector(`#on${event.key}`).checked =
            session.sources[event.key - 1].active;
          document.getElementById("welcome-panel").style.cursor = "none";
        } else if (event.key === "[") {
          event.preventDefault();
          document.getElementById("invert").checked = toggleInvert();
        } else {
          for (let b of session.allBlendModes) {
            if (event.key === b[1]) {
              event.preventDefault();
              setBlendMode(b[0]);
              document.getElementById(b[0]).checked = true;
              break;
            }
          }
        }
      }
    },
    false
  );
}

function updateAlpha(id) {
  let newAlpha = document.querySelector(`#alpha${id + 1}`).value / 100;
  session.sources[id].alpha = newAlpha;
  if (session.roomID)
    updateSrc(session.sources[id].id, { alpha: newAlpha }, false);
}

function toggleSrc(id) {
  const s = session.sources[id];
  s.active = document.querySelector(`#on${id + 1}`).checked ? true : false;
  if (session.roomID)
    updateSrc(
      session.sources[id].id,
      { active: session.sources[id].active },
      false
    );
}

function onMIDISuccess(midiAccess) {
  const midi = midiAccess;
  const inputs = midi.inputs.values();
  let input = inputs.next();
  while (input.value) {
    input.value.onmidimessage = onMIDIMessage;
    input = inputs.next();
  }
}

function onMIDIFailure(e) {
  console.error("Could not access your MIDI devices: ", e);
}

function toggleMidi() {
  const mSwitch = document.getElementById("midion");
  session.setMidiActive(mSwitch.checked);
}

function onMIDIMessage(message) {
  if (!session.midiActive) return;
  const data = message.data; // [command/channel, note, velocity]
  if (data[0] != 248) console.log(data);
  if (data[0] != 248) {
    const note = data[1];
    const velocity = data[2];
    if (velocity == 127) {
      if (note >= 60 && note <= 69) {
        let n = note - 60;
        session.sources[n].active = !session.sources[n].active;
        document.querySelector(`#on${n + 1}`).checked =
          session.sources[n].active;
      } else if (note == 70) {
        document.getElementById("invert").checked = toggleInvert();
      } else {
        const base = 71;
        const offset = note - base;
        if (offset >= 0 && offset < session.allBlendModes.length) {
          const blendName = session.allBlendModes[offset][0];
          setBlendMode(blendName);
          document.getElementById(blendName).checked = true;
        }
      }
    }
  }
}
