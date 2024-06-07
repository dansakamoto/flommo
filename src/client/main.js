import logo from "./assets/FLOMMO_LOGO.png";
import "./main.css";
import session from "./session";
import { loadRoomData } from "./services/data";

const versionNum = "0.13.1";

session.initFromURL();
loadRoomData();

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
