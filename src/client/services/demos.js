const demoData = {
  sources: [
    {
      id: 37,
      date_created: "2024-04-01T22:52:20.414Z",
      date_modified: "2024-04-01T22:52:20.414Z",
      room: "1711997540390",
      type: "hydra",
      data: "osc().out()",
      alpha: "1",
      active: true,
    },
    {
      id: 38,
      date_created: "2024-04-01T22:52:21.872Z",
      date_modified: "2024-04-01T22:52:21.872Z",
      room: "1711997540390",
      type: "p5",
      data: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}",
      alpha: "1",
      active: true,
    },
  ],
  mixerState: { blend: "screen" },
};
export default demoData;
