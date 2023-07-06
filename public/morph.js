/*
 * @name Morph
 * @arialabel On a dark grey background, white outline of a square changes into a circle as the sides of the square curve into a circle shape
 * @frame 720,400
 * @description Changing one shape into another by interpolating vertices from one to another.
 */

const s2 = ( sketch ) => {

  // Two ArrayLists to store the vertices for two shapes
  // This example assumes that each shape will have the same
  // number of vertices, i.e. the size of each ArrayList will be the same
  let circle = [];
  let square = [];

  // An ArrayList for a third set of vertices, the ones we will be drawing
  // in the window
  let morph = [];

  // This boolean variable will control if we are morphing to a circle or square
  let state = false;

  sketch.setup = () => {
    let cnv = sketch.createCanvas(720, 400);
    //cnv.id('src2');

    // Create a circle using vectors pointing from center
    for (let angle = 0; angle < 360; angle += 9) {
      // Note we are not starting from 0 in order to match the
      // path of a circle.
      let v = p5.Vector.fromAngle(sketch.radians(angle - 135));
      v.mult(100);
      circle.push(v);
      // Let's fill out morph ArrayList with blank PVectors while we are at it
      morph.push(sketch.createVector());
    }

    // A square is a bunch of vertices along straight lines
    // Top of square
    for (let x = -50; x < 50; x += 10) {
      square.push(sketch.createVector(x, -50));
    }
    // Right side
    for (let y = -50; y < 50; y += 10) {
      square.push(sketch.createVector(50, y));
    }
    // Bottom
    for (let x = 50; x > -50; x -= 10) {
      square.push(sketch.createVector(x, 50));
    }
    // Left side
    for (let y = 50; y > -50; y -= 10) {
      square.push(sketch.createVector(-50, y));
    }
  }

  sketch.draw = () => {
    sketch.background(51);

    // We will keep how far the vertices are from their target
    let totalDistance = 0;

    // Look at each vertex
    for (let i = 0; i < circle.length; i++) {
      let v1;
      // Are we lerping to the circle or square?
      if (state) {
        v1 = circle[i];
      } else {
        v1 = square[i];
      }
      // Get the vertex we will draw
      let v2 = morph[i];
      // Lerp to the target
      v2.lerp(v1, 0.1);
      // Check how far we are from target
      totalDistance += p5.Vector.dist(v1, v2);
    }

    // If all the vertices are close, switch shape
    if (totalDistance < 0.1) {
      state = !state;
    }

    // Draw relative to center
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.strokeWeight(4);
    // Draw a polygon that makes up all the vertices
    sketch.beginShape();
    sketch.noFill();
    sketch.stroke(255);

    morph.forEach(v => {
      sketch.vertex(v.x, v.y);
    });
    sketch.endShape(sketch.CLOSE);
  }

}


let myp5b = new p5(s2, "d2");
