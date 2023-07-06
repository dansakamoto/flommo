/*
 * @name Bouncy Bubbles
 * @arialabel Grey circles of varying sizes bounce off the sides of the canvas and each other, eventually settling on the bottom of the screen
 * @frame 720,400
 * @description  based on code from Keith Peters. Multiple-object collision..
 */

const s1 = ( sketch ) => {

  let numBalls = 13;
  let spring = 0.05;
  let gravity = 0.03;
  let friction = -0.9;
  let balls = [];

  sketch.setup = () => {
    let cnv = sketch.createCanvas(720, 400);
    //cnv.id('src2');

    for (let i = 0; i < numBalls; i++) {
      balls[i] = new Ball(
        sketch.random(sketch.width),
        sketch.random(sketch.height),
        sketch.random(30, 70),
        i,
        balls,
        numBalls
      );
    }
    sketch.noStroke();
    sketch.fill(255, 204);
  }

  sketch.draw = () => {
    sketch.background(0);
    balls.forEach(ball => {
      ball.collide();
      ball.move();
      ball.display();
    });
  }



  class Ball {
    constructor(xin, yin, din, idin, oin,numBalls) {
      this.x = xin;
      this.y = yin;
      this.vx = 0;
      this.vy = 0;
      this.diameter = din;
      this.id = idin;
      this.others = oin;
      this.numBalls = numBalls;
    }

    collide() {
      for (let i = this.id + 1; i < this.numBalls; i++) {
        // console.log(others[i]);
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
        let distance = sketch.sqrt(dx * dx + dy * dy);
        let minDist = this.others[i].diameter / 2 + this.diameter / 2;
        //   console.log(distance);
        //console.log(minDist);
        if (distance < minDist) {
          //console.log("2");
          let angle = sketch.atan2(dy, dx);
          let targetX = this.x + sketch.cos(angle) * minDist;
          let targetY = this.y + sketch.sin(angle) * minDist;
          let ax = (targetX - this.others[i].x) * spring;
          let ay = (targetY - this.others[i].y) * spring;
          this.vx -= ax;
          this.vy -= ay;
          this.others[i].vx += ax;
          this.others[i].vy += ay;
        }
      }
    }

    move() {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x + this.diameter / 2 > sketch.width) {
        this.x = sketch.width - this.diameter / 2;
        this.vx *= friction;
      } else if (this.x - this.diameter / 2 < 0) {
        this.x = this.diameter / 2;
        this.vx *= friction;
      }
      if (this.y + this.diameter / 2 > sketch.height) {
        this.y = sketch.height - this.diameter / 2;
        this.vy *= friction;
      } else if (this.y - this.diameter / 2 < 0) {
        this.y = this.diameter / 2;
        this.vy *= friction;
      }
    }

    display() {
      sketch.ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }



}






let myp5a = new p5(s1, "d1");
