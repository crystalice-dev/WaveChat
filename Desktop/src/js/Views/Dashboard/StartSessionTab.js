import React, { useRef, useState } from 'react';
import { StartSessionStyle } from '../../../styles/StartSessionStyle';

function StartSessionTab() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const socket = new WebSocket('wss://10.0.0.164:3000');  // Use your local IP
  const [localStream, setLocalStream] = useState(null);

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  socket.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.offer) {
      await handleReceiveOffer(data.offer);
    } else if (data.answer) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const joinCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;
  
    const pc = new RTCPeerConnection(config);
    setPeerConnection(pc);
  
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
  
    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };
  
    // Just wait for the offer to arrive via socket, handled in socket.onmessage
    // This function sets everything up to be ready when the offer comes
  };
  

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection(config);
    setPeerConnection(pc);

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ offer }));
  };

  const handleReceiveOffer = async (offer) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection(config);
    setPeerConnection(pc);

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.send(JSON.stringify({ answer }));
  };

  return (
    <div style={StartSessionStyle.Container}>
      <div style={StartSessionStyle.SessionBTN} onClick={startCall}>
        <h1>START NEW CALL</h1>
      </div>

      <div style={StartSessionStyle.SessionBTN} onClick={joinCall}>
        <h1>JOIN CALL</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '300px', marginBottom: '10px' }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px' }} />
      </div>
    </div>
  );
}

export default StartSessionTab;
