/* =========================================================
   WaveChat – PeerJS + MediaPipe + Drawer + Chat
   ========================================================= */

/* ---------- DOM ---------- */
const entryModal = document.getElementById("entry-modal");
const roomInput = document.getElementById("room-input");
const notification = document.getElementById("notification");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
const statusText = document.querySelector(".status-text");

const btnMic = document.getElementById("btn-mic");
const btnCam = document.getElementById("btn-cam");

const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawer-title");

const cvToggle = document.getElementById("cv-toggle");
const cvMirror = document.getElementById("cv-mirror");

const localOverlay = document.getElementById("local-overlay");
const localCtx = localOverlay.getContext("2d");

const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");

/* ---------- GLOBAL STATE ---------- */
let peer = null;
let localStream = null;
let currentCall = null;

let uid = null;                 // hidden uid (not displayed)
let drawerDisplayIndex = 0;     // 0 closed, 1 share, 2 chat, 3 settings, 4 leave confirm

/* ---------- CV STATE ---------- */
let hands = null;
let faceMesh = null;
let cvReady = false;
let cvLoopRunning = false;
let lastHands = null;
let lastFace = null;

/* ---------- CHAT STATE ---------- */
const chatMessages = []; // local-only for now

/* =========================================================
   Utilities
   ========================================================= */
function makeUid() {
  // short, unique enough for session use (not displayed)
  return "u_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now().toString(36);
}

function notify(msg, time = 2200) {
  notification.textContent = msg;
  notification.hidden = false;
  setTimeout(() => (notification.hidden = true), time);
}

function setStatus(text) {
  statusText.textContent = text;
}

/* =========================================================
   Drawer
   ========================================================= */
function setDrawer(index) {
  drawerDisplayIndex = index;

  // 0 => close
  if (drawerDisplayIndex === 0) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    setDrawerViews(0);
    return;
  }

  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");

  setDrawerViews(drawerDisplayIndex);
}

function setDrawerViews(activeIndex) {
  // hide all
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`drawer-view-${i}`);
    if (el) el.classList.remove("active");
  }

  if (activeIndex >= 1 && activeIndex <= 4) {
    const active = document.getElementById(`drawer-view-${activeIndex}`);
    if (active) active.classList.add("active");
  }

  // title
  const titles = {
    0: "Drawer",
    1: "Share",
    2: "Chat",
    3: "Settings",
    4: "Leave"
  };
  drawerTitle.textContent = titles[activeIndex] || "Drawer";
}

function confirmLeave(yes) {
  if (yes) {
    hardResetToRoomPage();
  } else {
    setDrawer(0);
  }
}

/* =========================================================
   Media / WebRTC
   ========================================================= */
async function getLocalStream() {
  if (localStream) return localStream;

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;
  await localVideo.play();

  // Initialize button state on start
  updateMicButtonState();
  updateCamButtonState();

  // Start CV pipeline once camera is live
  await initMediapipe();
  startCvLoop();

  return localStream;
}

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

/* Room flow */
async function createRoom() {
  uid = makeUid();

  const roomId = roomInput.value || "wave-" + Math.random().toString(36).slice(2, 8);
  entryModal.style.display = "none";

  await getLocalStream();
  initPeer(roomId);

  notify("Room created: " + roomId);
}

async function joinRoom() {
  uid = makeUid();

  const roomId = roomInput.value.trim();
  if (!roomId) return notify("Enter a Room ID");

  entryModal.style.display = "none";

  await getLocalStream();
  initPeer(); // random peer id

  peer.on("open", () => {
    const call = peer.call(roomId, localStream);
    attachCall(call);
  });

  notify("Joining room: " + roomId);
}

/* Screen share */
async function startScreenShare() {
  if (!currentCall) {
    notify("No active call to share");
    return;
  }

  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = displayStream.getVideoTracks()[0];

    const sender = currentCall.peerConnection
      .getSenders()
      .find((s) => s.track && s.track.kind === "video");

    if (!sender) return notify("No video sender found");

    sender.replaceTrack(screenTrack);
    notify("Screen sharing started");

    screenTrack.onended = () => {
      const camTrack = localStream.getVideoTracks()[0];
      sender.replaceTrack(camTrack);
      notify("Screen sharing stopped");
    };
  } catch (e) {
    notify("Screen share canceled");
  }
}

/* =========================================================
   Mic / Camera toggles with red state + toast
   ========================================================= */
function updateMicButtonState() {
  if (!localStream) return;
  const t = localStream.getAudioTracks()[0];
  if (!t) return;

  const off = !t.enabled;
  btnMic.classList.toggle("btn-off", off);
}

function updateCamButtonState() {
  if (!localStream) return;
  const t = localStream.getVideoTracks()[0];
  if (!t) return;

  const off = !t.enabled;
  btnCam.classList.toggle("btn-off", off);
}

function toggleMic() {
  if (!localStream) return;
  const t = localStream.getAudioTracks()[0];
  if (!t) return notify("No mic track");

  t.enabled = !t.enabled;
  updateMicButtonState();

  notify(t.enabled ? "Mic on" : "Mic off");
}

function toggleCamera() {
  if (!localStream) return;
  const t = localStream.getVideoTracks()[0];
  if (!t) return notify("No camera track");

  t.enabled = !t.enabled;
  updateCamButtonState();

  notify(t.enabled ? "Camera on" : "Camera off");
}

/* =========================================================
   Single drawer actions
   ========================================================= */
function toggleChat() { setDrawer(drawerDisplayIndex === 2 ? 0 : 2); }
function toggleSettings() { setDrawer(drawerDisplayIndex === 3 ? 0 : 3); }

/* Leave button now opens drawer confirm view */
function leaveCall() { setDrawer(4); }

/* Hard reset back to room page */
function hardResetToRoomPage() {
  try {
    if (currentCall) currentCall.close();
    if (peer) peer.destroy();
    if (localStream) localStream.getTracks().forEach((t) => t.stop());
  } catch {}

  // reset UI
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;

  localStream = null;
  currentCall = null;
  peer = null;

  setDrawer(0);
  setStatus("Ready");

  // show entry again
  entryModal.style.display = "flex";
  roomInput.value = "";
  notify("Left session");
}

/* =========================================================
   Chat (local-only for now)
   ========================================================= */
function renderChat() {
  chatLog.innerHTML = "";

  for (const m of chatMessages) {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg";

    const meta = document.createElement("div");
    meta.className = "chat-meta";
    meta.textContent = `${m.sender === uid ? "You" : "Peer"} • ${new Date(m.ts).toLocaleTimeString()}`;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble" + (m.sender === uid ? " me" : "");
    bubble.textContent = m.text;

    wrap.appendChild(meta);
    wrap.appendChild(bubble);
    chatLog.appendChild(wrap);
  }

  chatLog.scrollTop = chatLog.scrollHeight;
}

function sendChat() {
  const text = (chatInput.value || "").trim();
  if (!text) return;

  chatMessages.push({
    sender: uid,
    text,
    ts: Date.now()
  });

  chatInput.value = "";
  renderChat();

  // Next step: send via data channel to peer(s)
  // For now, local only.
}

/* Send on Enter */
document.addEventListener("keydown", (e) => {
  if (drawerDisplayIndex === 2 && e.key === "Enter") {
    const active = document.activeElement;
    if (active && active.id === "chat-input") {
      sendChat();
    }
  }
});

/* =========================================================
   MediaPipe Pipeline (Hands + FaceMesh)
   ========================================================= */
async function initMediapipe() {
  if (cvReady) return;

  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  hands.onResults((results) => (lastHands = results));

  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  faceMesh.onResults((results) => (lastFace = results));

  cvReady = true;
  notify("MediaPipe is ready");
}

function resizeOverlayToVideo() {
  const w = localVideo.videoWidth || 0;
  const h = localVideo.videoHeight || 0;
  if (!w || !h) return;

  if (localOverlay.width !== w) localOverlay.width = w;
  if (localOverlay.height !== h) localOverlay.height = h;
}

function clearOverlay() {
  if (!localOverlay.width || !localOverlay.height) return;
  localCtx.clearRect(0, 0, localOverlay.width, localOverlay.height);
}

function drawCombined() {
  if (!localOverlay.width || !localOverlay.height) return;

  clearOverlay();

  const mirror = !!cvMirror?.checked;

  localCtx.save();
  if (mirror) {
    localCtx.translate(localOverlay.width, 0);
    localCtx.scale(-1, 1);
  }

  if (lastFace && lastFace.multiFaceLandmarks) {
    for (const landmarks of lastFace.multiFaceLandmarks) {
      drawConnectors(localCtx, landmarks, FACEMESH_CONTOURS, { lineWidth: 1 });
      drawLandmarks(localCtx, landmarks, { radius: 1 });
    }
  }

  if (lastHands && lastHands.multiHandLandmarks) {
    for (const landmarks of lastHands.multiHandLandmarks) {
      drawConnectors(localCtx, landmarks, HAND_CONNECTIONS, { lineWidth: 2 });
      drawLandmarks(localCtx, landmarks, { radius: 3 });
    }
  }

  localCtx.restore();
}

async function startCvLoop() {
  if (cvLoopRunning) return;
  cvLoopRunning = true;

  const loop = async () => {
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

    try {
      await hands.send({ image: localVideo });
      await faceMesh.send({ image: localVideo });
      drawCombined();
    } catch {
      // ignore transient startup hiccups
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* Ensure settings toggles close/open drawer without breaking */
if (cvToggle) {
  cvToggle.addEventListener("change", () => {
    notify(cvToggle.checked ? "Tracking on" : "Tracking off");
  });
}
if (cvMirror) {
  cvMirror.addEventListener("change", () => {
    notify(cvMirror.checked ? "Mirror on" : "Mirror off");
  });
}

/* Expose a tiny debug handle */
window._wavechat = {
  get uid() { return uid; },
  get drawerDisplayIndex() { return drawerDisplayIndex; }
};
