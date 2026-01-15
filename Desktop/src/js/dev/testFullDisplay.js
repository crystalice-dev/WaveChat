import React, { useEffect, useRef, useState } from 'react';
import { osName } from 'react-device-detect';

const TestFullDisplay = () => {
  const videoRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('pending'); // 'pending' | 'granted' | 'denied'
  const [isLoading, setIsLoading] = useState(true);

  // Request camera permission
  const requestCameraAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 1️⃣ Request permission with getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      // Stop the initial stream (we'll restart with selected camera)
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      
      // 2️⃣ Enumerate devices after permission granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');

      console.log('Available cameras:', videoDevices);
      setCameras(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      } else {
        setError('No cameras found on this device');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setPermissionStatus('denied');
      setIsLoading(false);
      
      // Provide user-friendly error messages
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions in your browser/app settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
    }
  };

  // Initial permission request on mount
  useEffect(() => {
    requestCameraAccess();
    
    // Cleanup on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera when selected camera changes
  useEffect(() => {
    if (!selectedCamera || permissionStatus !== 'granted') return;

    async function startCamera() {
      try {
        // Stop any existing stream
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: selectedCamera },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error starting camera:', err);
        setError(`Failed to start camera: ${err.message}`);
      }
    }

    startCamera();
  }, [selectedCamera, permissionStatus]);

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>WaveChat Camera Test</h1>
      <p style={{ marginBottom: '1rem', color: '#888' }}>OS: {osName}</p>

      {/* Loading State */}
      {isLoading && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#222', 
          borderRadius: '8px',
          marginBottom: '1rem' 
        }}>
          <p>🔄 Requesting camera access...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#331111', 
          borderRadius: '8px',
          marginBottom: '1rem',
          maxWidth: '640px'
        }}>
          <p style={{ color: '#ff6666', marginBottom: '0.5rem' }}>❌ {error}</p>
          {permissionStatus === 'denied' && (
            <button
              onClick={requestCameraAccess}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Permission Granted - Show Controls */}
      {permissionStatus === 'granted' && cameras.length > 0 && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Select Camera:</label>
            <select
              style={{ 
                padding: '0.5rem',
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onChange={e => setSelectedCamera(e.target.value)}
              value={selectedCamera || ''}
            >
              {cameras.map((cam, i) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            border: '2px solid #333',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#000'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '640px',
                height: '480px',
                display: 'block'
              }}
            />
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem',
            backgroundColor: '#113311',
            borderRadius: '4px'
          }}>
            <p style={{ color: '#66ff66', margin: 0 }}>
              ✅ Camera Active: {cameras.find(c => c.deviceId === selectedCamera)?.label || 'Unknown'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TestFullDisplay;