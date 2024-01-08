import { toggleSrc, updateAlpha } from "../controllers/mixer";
import { sources } from "../models/sources";

export function refreshToggles() {
  const toggles = document.getElementById("sourceToggles");
  while (toggles.firstChild) toggles.removeChild(toggles.firstChild);

  for (let j = 0; j < sources.length; j++) {
    const s = sources[j];
    const isActive = s.active ? " checked" : "";
    const panelDiv = document.createElement("div");
    panelDiv.classList.add("panel");

    panelDiv.innerHTML = `<input type="checkbox" id="on${j + 1}" name="on${
      j + 1
    }" value="on${j + 1}"${isActive}><label for="on${j + 1}">Send ${
      j + 1
    }</label><br><input type="range" min="0" max="100" value="${
      s.alpha * 100
    }" class="slider" id="alpha${j + 1}"><br></br>`;

    toggles.appendChild(panelDiv);
    document.getElementById(`on${j + 1}`).onchange = () => {
      toggleSrc(j);
    };
    document.getElementById(`alpha${j + 1}`).onpointermove = () => {
      updateAlpha(j);
    };
  }
}
