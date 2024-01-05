import "./main.css";
import logo from "./assets/FLOMMO_LOGO.png";
import "./components/uiController";

const versionNum = "0.2.0";

document.querySelector("#title").innerHTML = `<img
style="width: 300px"
src="${logo}"
width="300"
height="85"
alt="Flommo"
/><span style="font-family: 'Courier New', Courier, monospace"
>${versionNum}</span
>`;
