const entryModal = document.getElementById("entry-modal");
const roomInput = document.getElementById("room-input");
const notification = document.getElementById("notification");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
const statusText = document.querySelector(".status-text");

const chatPanel = document.getElementById("chat-panel");
const settingsPanel = document.getElementById("settings-panel");
const cvToggle = document.getElementById("cv-toggle");
const cvMirror = document.getElementById("cv-mirror");

const localOverlay = document.getElementById("local-overlay");
const localCtx = localOverlay.getContext("2d");

let peer = null;
let localStream = null;
let currentCall = null;

/* -------------------- MediaPipe State -------------------- */
let hands = null;
let faceMesh = null;
let cvReady = false;
let cvLoopRunning = false;

/* -------------------- Media -------------------- */
async function getLocalStream() {
  if (localStream) return localStream;

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;
  await localVideo.play();

  // Start CV pipeline once camera is live
  await initMediapipe();
  startCvLoop();

  return localStream;
}

/* -------------------- UI -------------------- */
function notify(msg, time = 2500) {
  notification.textContent = msg;
  notification.hidden = false;
  setTimeout(() => (notification.hidden = true), time);
}

function hideModal() {
  entryModal.style.display = "none";
}

function setStatus(text) {
  statusText.textContent = text;
}

/* -------------------- Peer -------------------- */
function initPeer(id) {
  peer = new Peer(id);

  peer.on("open", () => setStatus("Connected"));

  peer.on("call", async (call) => {
    const stream = await getLocalStream();
    call.answer(stream);
    attachCall(call);
  });

  peer.on("error", (err) => {
    console.error("[Peer] error:", err);
    notify("Peer error: " + (err?.type || "unknown"));
  });
}

/* -------------------- Call -------------------- */
function attachCall(call) {
  currentCall = call;

  call.on("stream", (stream) => {
    remoteVideo.srcObject = stream;
    remoteVideo.play();
  });

  call.on("close", () => {
    remoteVideo.srcObject = null;
    setStatus("Disconnected");
  });
}

/* -------------------- Room -------------------- */
async function createRoom() {
  const roomId = roomInput.value || "wave-" + Math.random().toString(36).slice(2, 8);
  hideModal();
  await getLocalStream();
  initPeer(roomId);
  notify("Room created: " + roomId);
}

async function joinRoom() {
  const roomId = roomInput.value.trim();
  if (!roomId) return notify("Enter a Room ID");

  hideModal();
  await getLocalStream();
  initPeer();

  peer.on("open", () => {
    const call = peer.call(roomId, localStream);
    attachCall(call);
  });
}

/* -------------------- Screen Share -------------------- */
async function startScreenShare() {
  if (!currentCall) return notify("No active call");

  const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const screenTrack = displayStream.getVideoTracks()[0];

  const sender = currentCall.peerConnection
    .getSenders()
    .find((s) => s.track && s.track.kind === "video");

  if (!sender) return notify("No video sender found");

  sender.replaceTrack(screenTrack);
  notify("Screen sharing");

  screenTrack.onended = () => {
    const camTrack = localStream.getVideoTracks()[0];
    sender.replaceTrack(camTrack);
    notify("Camera restored");
  };
}

/* -------------------- Toggles -------------------- */
function toggleMic() {
  if (!localStream) return;
  const t = localStream.getAudioTracks()[0];
  if (!t) return notify("No mic track");
  t.enabled = !t.enabled;
  notify(t.enabled ? "Mic on" : "Mic muted");
}

function toggleCamera() {
  if (!localStream) return;
  const t = localStream.getVideoTracks()[0];
  if (!t) return notify("No camera track");
  t.enabled = !t.enabled;
  notify(t.enabled ? "Camera on" : "Camera off");
}

/* -------------------- Panels -------------------- */
function toggleChat() {
  chatPanel.classList.toggle("open");
}

function toggleSettings() {
  settingsPanel.classList.toggle("open");
}

/* -------------------- Leave -------------------- */
function leaveCall() {
  try {
    if (currentCall) currentCall.close();
    if (peer) peer.destroy();
  } catch {}
  location.reload();
}

/* =========================================================
   MediaPipe Pipeline (Hands + FaceMesh)
   ========================================================= */

async function initMediapipe() {
  if (cvReady) return;

  // Hands
  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  hands.onResults(onHandsResults);

  // FaceMesh
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  faceMesh.onResults(onFaceResults);

  cvReady = true;
  notify("CV pipeline ready");
}

/* Draw buffers so we can combine hand + face output cleanly */
let lastHands = null;
let lastFace = null;

function onHandsResults(results) {
  lastHands = results;
}

function onFaceResults(results) {
  lastFace = results;
}

/* Keep canvas sized to the displayed local video */
function resizeOverlayToVideo() {
  const w = localVideo.videoWidth || 0;
  const h = localVideo.videoHeight || 0;
  if (!w || !h) return;

  if (localOverlay.width !== w) localOverlay.width = w;
  if (localOverlay.height !== h) localOverlay.height = h;
}

async function startCvLoop() {
  if (cvLoopRunning) return;
  cvLoopRunning = true;

  const loop = async () => {
    // Pause CV if disabled or video not ready
    if (!cvToggle?.checked) {
      clearOverlay();
      requestAnimationFrame(loop);
      return;
    }

    if (!cvReady || localVideo.readyState < 2) {
      requestAnimationFrame(loop);
      return;
    }

    resizeOverlayToVideo();

    // Feed frames into MediaPipe (sequential to avoid GPU overload)
    try {
      await hands.send({ image: localVideo });
      await faceMesh.send({ image: localVideo });
      drawCombined();
    } catch (e) {
      // If this throws occasionally on startup, it's fine—just keep looping.
      // Uncomment to debug:
      // console.error("CV loop error:", e);
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

function clearOverlay() {
  if (!localOverlay.width || !localOverlay.height) return;
  localCtx.clearRect(0, 0, localOverlay.width, localOverlay.height);
}

function drawCombined() {
  if (!localOverlay.width || !localOverlay.height) return;

  clearOverlay();

  // Mirror overlay (selfie view) if enabled
  const mirror = !!cvMirror?.checked;

  localCtx.save();
  if (mirror) {
    localCtx.translate(localOverlay.width, 0);
    localCtx.scale(-1, 1);
  }

  // Face landmarks
  if (lastFace && lastFace.multiFaceLandmarks) {
    for (const landmarks of lastFace.multiFaceLandmarks) {
      // A lightweight subset: tesselation is heavy; contours are usually enough.
      drawConnectors(localCtx, landmarks, FACEMESH_CONTOURS, { lineWidth: 1 });
      drawLandmarks(localCtx, landmarks, { radius: 1 });
    }
  }

  // Hand landmarks
  if (lastHands && lastHands.multiHandLandmarks) {
    for (const landmarks of lastHands.multiHandLandmarks) {
      drawConnectors(localCtx, landmarks, HAND_CONNECTIONS, { lineWidth: 2 });
      drawLandmarks(localCtx, landmarks, { radius: 3 });
    }
  }

  localCtx.restore();
}
