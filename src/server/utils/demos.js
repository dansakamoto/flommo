const demoData = [
  {
    sources: [
      {
        id: 37,
        type: "hydra",
        data: "osc().out()",
        alpha: "1",
        active: true,
      },
      {
        id: 38,
        type: "p5",
        data: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}",
        alpha: "1",
        active: true,
      },
    ],
    mixerState: { blend: "screen" },
  },
  {
    sources: [
      {
        id: 37,
        type: "hydra",
        data: "noise().out()",
        alpha: "1",
        active: true,
      },
      {
        id: 38,
        type: "p5",
        data: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(150,f.sin(f.millis()/1000)*255,100)\n}",
        alpha: "1",
        active: true,
      },
    ],
    mixerState: { blend: "screen" },
  },
];

export function getDemo() {
  return demoData[Math.floor(Math.random() * demoData.length)];
}
