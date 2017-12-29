const record = require("node-record-lpcm16");
const { Detector, Models } = require("snowboy");
const resource = require.resolve("snowboy/resources/common.res");

const models = new Models();

models.add({
  file: "resources/model.pmdl",
  sensitivity: "0.5",
  hotwords: "COMPUTER"
});

const detector = new Detector({
  resource,
  models: models,
  audioGain: 2.0
});

let record = false;
let recordBuffer;

detector.on("silence", function() {
  console.log("silence");
  if (record) {
    record = false;
    console.log("Got recording");
    console.log(recordBuffer);
  }
});

detector.on("sound", function(buffer) {
  // <buffer> contains the last chunk of the audio that triggers the "sound"
  // event. It could be written to a wav stream.
  console.log("sound");
  if (record) {
    recordBuffer = recordBuffer.concat(buffer);
  }
});

detector.on("error", function() {
  console.log("error");
});

detector.on("hotword", function(index, hotword, buffer) {
  // <buffer> contains the last chunk of the audio that triggers the "hotword"
  // event. It could be written to a wav stream. You will have to use it
  // together with the <buffer> in the "sound" event if you want to get audio
  // data after the hotword.
  console.log(buffer);
  console.log("hotword", index, hotword);
  if (recording) return;
  record = true;
  recordBuffer = new Buffer();
});

const mic = record.start({
  threshold: 0,
  verbose: true
});

mic.pipe(detector);
