function mixem() {

    var out1 = document.getElementById("out1");
    var ctxo1 = out1.getContext('2d');

    // update videos (even if offscreen)
    for(let k in vids) document.getElementById(k).play();

    // update alphas
    for(let i=0; i<numSources; i++) outAlpha[i] = document.querySelector(`#alpha${i+1}`).value/100;

    ctxo1.clearRect(0, 0, out1.width, out1.height);

    for(hi of hydraInstances){
      hi.tick(16);
    }

    let i = 0;
    for(let k in p5s){
      if(outOn[i]){
        ctxo1.globalAlpha = outAlpha[i];
        ctxo1.drawImage(document.getElementById(k).firstChild,0,0, out1.offsetWidth, out1.offsetHeight);
      }
      i++;
    }

    for(let k in hydras){
      if(outOn[i]){
        ctxo1.globalAlpha = outAlpha[i];
        ctxo1.drawImage(document.getElementById(k),0,0, out1.offsetWidth, out1.offsetHeight);
      }
      i++;
    }

    for(let k in vids){
      if(outOn[i]){
        ctxo1.globalAlpha = outAlpha[i];
        ctxo1.drawImage(document.getElementById(k),0,0, out1.offsetWidth, out1.offsetHeight);
      }
      i++;
    }

    if(gInvert) ctxo1.filter = 'invert(1)'
    else ctxo1.filter = 'invert(0)'
    ctxo1.globalCompositeOperation = blendMode;

  }
  var t=setInterval(mixem,16);
