const vids = {};

function initVids(vidSrcs){

    const wrapper = document.getElementById("loadedVids")

    let i=0;
    for(v of vidSrcs){
        const vElement = document.createElement("video");

        vElement.src = window.location.origin + "/media/" + v;
        vElement.class = "inputSrc";
        vElement.id = "video"+i;
        vElement.width = 720;
        vElement.height = 400;
        vElement.loop = true;
        vElement.autoplay = true;
        vElement.muted = true;

        wrapper.appendChild(vElement);

        vids["video"+i] = v;
        i++;

    }
     console.log(vids);

}

async function route(url){
    const response = await fetch(url);
    var data = await response.json();
    initVids(data);
}

route("/movlist");


// <video id="video2" class="inputSrc" src="https://dl.dropboxusercontent.com/s/n7y86joln4uj4t7/trees.mov?dl=0" width="720" height="400" loop autoplay muted></video>

// INIT MIXER SETTINGS
  const outOn = Array(6).fill(false);
  const outAlpha = Array(6).fill(1);
  var blendMode = "screen";

  function changeBlend() {
    blendMode = document.querySelector("#blendInput").value;
  }

  function toggleBlend(b){
    blendMode = b;
  }

  // GUI listeners
  function toggleSrc(s){
    outOn[s-1] = (document.querySelector(`#on${s}`).checked) ? true : false;
    document.querySelector("#welcome").style = "display:none;";
  }

  // Keyboard listeners
  document.addEventListener('keydown', (event) => {
    if(event.key >= 1 && event.key <=  6){
      outOn[event.key-1] = !(outOn[event.key-1]);
      document.querySelector(`#on${event.key}`).checked = outOn[event.key-1];
      document.querySelector("#welcome").style = "display:none;";
    }
    else if(event.key == 'q'){
      blendMode = "screen"
      document.getElementById("screen").checked = true;
    }
    else if(event.key == 'w'){
      blendMode = "multiply"
      document.getElementById("multiply").checked = true;
    }
    else if(event.key == 'e'){
      blendMode = "difference"
      document.getElementById("difference").checked = true;
    } else if(event.key == 'h'){

    }
  }, false);

  // keep output size = to window size
  function resizeMain() {
    document.getElementById("out1").width = window.innerWidth;
    document.getElementById("out1").height = window.innerHeight;
    document.getElementById("nocursor").style = "cursor:none;width:100%;height:" + window.innerHeight + "px";
  }
  resizeMain();
  window.addEventListener('resize', resizeMain);

  // main update function to run every frame
  function mixem() {

    var out1 = document.getElementById("out1");
    var ctxo1 = out1.getContext('2d');
    /*
    var src1 = document.getElementById("d1").firstChild;
    var src2 = document.getElementById("d2").firstChild;
    var src3 = document.getElementById("hydraCanvas");
    var src4 = document.getElementById("hydraCanvas2");
    var src5 = document.getElementById("video1");
    var src6 = document.getElementById("video2");
    */


    // update hydras
    //hydra.tick(16);
    //hydra2.tick(16);

    // update videos (even if offscreen)
    //src5.play();
    //src6.play();
    for(let k in vids) document.getElementById(k).play();

    // update alphas
    for(let i=0; i<6; i++) outAlpha[i] = document.querySelector(`#alpha${i+1}`).value/100;

    // render 3d hydra canvas to a 2d canvas
    // all other canvas updates are tethered to this to keep them in sync
    /*
    var img = new Image();
    img.onload=function(){
      ctxo1.clearRect(0, 0, out1.width, out1.height);

      if(outOn[0]){
        ctxo1.globalAlpha = outAlpha[0];
        ctxo1.drawImage(src1, 0, 0, out1.offsetWidth, out1.offsetHeight);
      }
      if(outOn[1]){
        ctxo1.globalAlpha = outAlpha[1];
        ctxo1.drawImage(src2, 0, 0, out1.offsetWidth, out1.offsetHeight);
      }
      if(outOn[2]){
        ctxo1.globalAlpha = outAlpha[2];
        ctxo1.drawImage(img,0,0, out1.offsetWidth, out1.offsetHeight);
      }
      if(outOn[3]){
        ctxo1.globalAlpha = outAlpha[3];
        ctxo1.drawImage(img2,0,0, out1.offsetWidth, out1.offsetHeight);
      }
      if(outOn[4]){
        ctxo1.globalAlpha = outAlpha[4];
        ctxo1.drawImage(src5,0,0, out1.offsetWidth, out1.offsetHeight);
      }
      if(outOn[5]){
        ctxo1.globalAlpha = outAlpha[5];
        ctxo1.drawImage(src6,0,0, out1.offsetWidth, out1.offsetHeight);
      }
    }
    img.src = src3.toDataURL('image/jpeg');

    var img2 = new Image();
    img2.src = src4.toDataURL('image/jpeg');
    */

    ctxo1.clearRect(0, 0, out1.width, out1.height);

    let i = 0;
    for(let k in vids){
      if(outOn[i]){
        ctxo1.globalAlpha = outAlpha[i];
        ctxo1.drawImage(document.getElementById(k),0,0, out1.offsetWidth, out1.offsetHeight);
      }
      i++;
    }

    ctxo1.globalCompositeOperation = blendMode;

}
var t=setInterval(mixem,16);
