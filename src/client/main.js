import logo from "./assets/FLOMMO_LOGO.png";
import "./style.css";
import { initRoom } from "./models/sources";
import { resizeEditor } from "./views/panels";
//import "./views/uiController";

const versionNum = "0.4.0";

initRoom();
resizeEditor();

document.querySelector("#title").innerHTML = `<img
style="width: 300px"
src="${logo}"
width="300"
height="85"
alt="Flommo"
/><span style="font-family: 'Courier New', Courier, monospace"
>${versionNum}</span
>`;
document.querySelector("#interface").style.opacity = 1;
