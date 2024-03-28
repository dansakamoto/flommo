import "./mixer.css";
import { toggleSrc, updateAlpha } from "./mixerListeners";
import session from "../session";

export function updateMixer() {
  const toggles = document.getElementById("sourceToggles");
  while (toggles.firstChild) toggles.removeChild(toggles.firstChild);

  for (let i = 0; i < session.sources.length; i++) {
    const s = session.sources[i];

    const toggleDiv = document.createElement("div");
    toggleDiv.classList.add("panel");

    const isChecked = s.active ? " checked" : "";

    toggleDiv.innerHTML = `<input type="checkbox" id="on${i + 1}" name="on${
      i + 1
    }" value="on${i + 1}"${isChecked}><label for="on${i + 1}">Send ${
      i + 1
    }</label><br><input type="range" min="0" max="100" value="${
      s.alpha * 100
    }" class="slider" id="alpha${i + 1}"><br></br>`;

    toggles.appendChild(toggleDiv);

    document.getElementById(`on${i + 1}`).onchange = () => {
      toggleSrc(i);
    };
    document.getElementById(`alpha${i + 1}`).onpointermove = () => {
      updateAlpha(i);
    };
  }

  const activeBlendmode = document.getElementById(session.blendMode);
  activeBlendmode.checked = true;

  const invertButton = document.getElementById("invert");
  invertButton.checked = session.globalInvert;
}
