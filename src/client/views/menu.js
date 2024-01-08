import { sources } from "../models/sources";
import { activePanel } from "../models/panels";
import { togglePanel } from "../controllers/panels";

export function refreshSrcButtons() {
  const editLabel = document.querySelector("#editlabel");
  const buttonsDiv = document.querySelector("#srcbuttons");

  editLabel.style.visibility = sources.length === 0 ? "hidden" : "visible";

  while (buttonsDiv.firstChild) buttonsDiv.removeChild(buttonsDiv.firstChild);

  for (let i = 0; i < sources.length; i++) {
    const b = document.createElement("button");
    b.id = "additionalEditor" + i;
    if (i === activePanel) {
      b.classList.add("active");
    }

    b.onclick = () => {
      togglePanel(i);
    };

    if (sources[i].type === "p5") b.classList.add("p5button");
    else if (sources[i].type === "hydra") b.classList.add("hydrabutton");
    else if (sources[i].type === "video") b.classList.add("videobutton");

    b.innerHTML = i + 1;
    buttonsDiv.appendChild(b);
  }
}
