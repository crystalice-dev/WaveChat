/* ================================
   WaveChat – script.js
   PeerJS-based P2P video session
   ================================ */

/* ---------- DOM ELEMENTS ---------- */
const entryModal = document.getElementById("entry-modal");
const roomInput = document.getElementById("room-input");
const notification = document.getElementById("notification");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");

const roomChipValue = document.getElementById("room-chip-value");
const statusText = document.querySelector(".status-text");

/* ---------- GLOBAL STATE ---------- */
let peer = null;
let localStream = null;
let currentCall = null;
let currentRoomId = null;

/* ---------- MEDIA ---------- */
async function getLocalStream() {
  if (localStream) return localStream;

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  localVideo.srcObject = localStream;
  localVideo.muted = true;
  await localVideo.play();

  return localStream;
}

/* ---------- UI HELPERS ---------- */
function showNotification(msg, timeout = 3000) {
  notification.textContent = msg;
  notification.hidden = false;

  if (timeout) {
    setTimeout(() => {
      notification.hidden = true;
    }, timeout);
  }
}

function hideEntryModal() {
  entryModal.style.display = "none";
}

function setStatus(text) {
  if (statusText) statusText.textContent = text;
}

function setRoomChip(roomId) {
  if (roomChipValue) roomChipValue.textContent = roomId;
}

/* ---------- PEER SETUP ---------- */
function createPeer(roomId) {
  peer = new Peer(roomId);

  peer.on("open", id => {
    console.log("[Peer] Opened with ID:", id);
    setStatus("Connected");
    setRoomChip(id);
  });

  peer.on("call", async call => {
    console.log("[Peer] Incoming call");

    const stream = await getLocalStream();
    call.answer(stream);
    handleCall(call);
  });

  peer.on("error", err => {
    console.error("[Peer] Error:", err);
    showNotification("Peer error: " + err.type);
  });
}

/* ---------- CALL HANDLING ---------- */
function handleCall(call) {
  if (currentCall) {
    currentCall.close();
  }

  currentCall = call;

  call.on("stream", remoteStream => {
    console.log("[Call] Receiving remote stream");
    remoteVideo.srcObject = remoteStream;
    remoteVideo.play();
  });

  call.on("close", () => {
    console.log("[Call] Call closed");
    remoteVideo.srcObject = null;
    setStatus("Disconnected");
  });
}

/* ---------- ROOM ACTIONS ---------- */
async function createRoom() {
  const roomId = roomInput.value.trim() || generateRoomId();
  startSession(roomId, true);
}

async function joinRoom() {
  const roomId = roomInput.value.trim();
  if (!roomId) {
    showNotification("Please enter a Room ID");
    return;
  }
  startSession(roomId, false);
}

async function startSession(roomId, isCreator) {
  currentRoomId = roomId;
  hideEntryModal();
  showNotification("Joining room: " + roomId, 2000);
  setStatus("Connecting…");

  await getLocalStream();
  createPeer(isCreator ? roomId : undefined);

  if (!isCreator) {
    peer.on("open", async id => {
      console.log("[Peer] Calling room:", roomId);
      const call = peer.call(roomId, localStream);
      handleCall(call);
    });
  }
}

/* ---------- SCREEN SHARE ---------- */
async function startScreenShare() {
  if (!currentCall) {
    showNotification("No active call to share screen");
    return;
  }

  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = currentCall.peerConnection
      .getSenders()
      .find(s => s.track.kind === "video");

    if (sender) {
      sender.replaceTrack(screenTrack);
      showNotification("Screen sharing started");
    }

    screenTrack.onended = async () => {
      const camTrack = localStream.getVideoTracks()[0];
      sender.replaceTrack(camTrack);
      showNotification("Screen sharing stopped");
    };

  } catch (err) {
    console.error("[ScreenShare] Error:", err);
    showNotification("Screen share failed");
  }
}

/* ---------- UTIL ---------- */
function generateRoomId() {
  return "wave-" + Math.random().toString(36).substring(2, 8);
}

/* ---------- DEBUG ---------- */
window._wavechat = {
  get peer() { return peer; },
  get call() { return currentCall; }
};
