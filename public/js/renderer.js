const OCANVAS = document.getElementById("out1");
const OCONTEXT = OCANVAS.getContext('2d');

function mixem() {

  // make sure all sources update
  for(let k in vids) document.getElementById(k).play(); // update videos (even if offscreen)
  for(hi of hydraInstances){ hi.tick(16); } // update hydra instances
  for(let i=0; i<numSources; i++) outAlpha[i] = document.querySelector(`#alpha${i+1}`).value/100; // update alpha levels

  OCONTEXT.clearRect(0, 0, OCANVAS.width, OCANVAS.height);
  let srcNum = 0;

  for(let k in p5s){
    if(outOn[srcNum]){
      OCONTEXT.globalAlpha = outAlpha[srcNum];
      OCONTEXT.drawImage(document.getElementById(k).firstChild,0,0, OCANVAS.offsetWidth, OCANVAS.offsetHeight);
    }
    srcNum++;
  }

  for(let k in hydras){
    if(outOn[srcNum]){
      OCONTEXT.globalAlpha = outAlpha[srcNum];
      OCONTEXT.drawImage(document.getElementById(k),0,0, OCANVAS.offsetWidth, OCANVAS.offsetHeight);
    }
    srcNum++;
  }

  for(let k in vids){
    if(outOn[srcNum]){
      OCONTEXT.globalAlpha = outAlpha[srcNum];
      OCONTEXT.drawImage(document.getElementById(k),0,0, OCANVAS.offsetWidth, OCANVAS.offsetHeight);
    }
    srcNum++;
  }

  if(gInvert) OCONTEXT.filter = 'invert(1)';
    else OCONTEXT.filter = 'invert(0)';
  OCONTEXT.globalCompositeOperation = blendMode;

}
var t=setInterval(mixem,16); // ~60fps

function onWindowResize() {
  document.getElementById("out1").width = window.innerWidth;
  document.getElementById("out1").height = window.innerHeight;
  document.getElementById("nocursor").style.height = window.innerHeight + "px";
  document.getElementById("srcPreviews").style.width = `${Math.max(720,720 * Math.floor(window.innerWidth / 720))}px`;
}
onWindowResize();
window.addEventListener('resize', onWindowResize);
