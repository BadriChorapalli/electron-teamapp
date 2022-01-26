const {desktopCapturer} = require('electron');

let desktopSharing = false;
let localStream;

function refresh() {
 /*$('select').imagepicker({
    hide_select : true
  });*/
}
function addSource(source) {
  $('select').append($('<option>', {
    value: source.id.replace(":", ""),
    text: source.name
  }));
  $('select option[value="' + source.id.replace(":", "") + '"]').attr('data-img-src', source.thumbnail.toDataURL());
  refresh();
}

function showSources() {
	console.log(desktopCapturer);
  desktopCapturer.getSources({ types:['screen','window','desktop'] }).then(async sources => {
    for (let source of sources) {
      console.log("Name: " + source.name);
      addSource(source);
    }
  });
}

function toggle() {
  if (!desktopSharing) {
    var id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
    onAccessApproved(id);
  } else {
    desktopSharing = false;

    if (localStream)
      localStream.getTracks()[0].stop();
    localStream = null;

    document.querySelector('button').innerHTML = "Enable Capture";

    $('select').empty();
    showSources();
    refresh();
  }
}

function onAccessApproved(desktop_id) {
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  desktopSharing = true;
  document.querySelector('button').innerHTML = "Disable Capture";
  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: desktop_id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720
      }
    }
  }, gotStream, getUserMediaError);

  function gotStream(stream) {
	  console.log(stream)
    localStream = stream;
    let video = document.querySelector('video');
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
    stream.onended = function() {
      if (desktopSharing) {
        toggle();
      }
    };
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }
}

$(document).ready(function() {
	console.log("I am testing")
  showSources();
  refresh();
});

document.querySelector('button').addEventListener('click', function(e) {
  toggle();
});

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
  var socket = io('http://localhost:7000');
function getData() {
 // socket.emit('test','hai')
 console.log()
}

document.querySelector('#btnEd').addEventListener('click', () => {
    getData()
})
socket.on('welcome', () => {
  console.log('on welcome : welcome received renderer'); // displayed
  socket.emit('test')
});
socket.on('error', (e) => {
  console.log(e); // not displayed
});
socket.on('ok', () => {
  console.log("OK received renderer"); // not displayed
});
socket.on('connect', () => {
  console.log("connected renderer"); // displayed
  socket.emit('test');
});
function printMousePos(event) {
 var t =
    "clientX: " + event.clientX +
    " - clientY: " + event.clientY;
	console.log(t)
	//socket.emit('mouseEvent',event.clientX,event.clientY)
}

document.addEventListener("click", printMousePos);
const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);
async function startCapture() {
  logElem.innerHTML = "";
  console.log(navigator.mediaDevices)

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
  } catch(err) {
    console.error("Error: " + err);
  }
}
function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}
function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}