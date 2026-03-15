import { useState, useRef, useCallback } from 'react';

const useLiveAPI = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isGreenMode, setIsGreenMode] = useState(false);
  
  const streamRef = useRef(null);
  const wsRef = useRef(null);

  const toggleGreenMode = () => setIsGreenMode(!isGreenMode);

  const startCapture = useCallback(async () => {
    try {
      // 1. React hooks to capture display media (Browser Tab, 1fps)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 1 }
      });
      
      // 2. Capture microphone for Audio stream (Int16 PCM)
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000
        }
      });
      
      streamRef.current = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
      
      setIsCapturing(true);
      
      // Connect to WebSocket with Google Gemini 2.0 Flash Live API bridging
      const wssUrl = `ws://localhost:8000/ws?green_mode=${isGreenMode}`;
      wsRef.current = new WebSocket(wssUrl);
      
      wsRef.current.onopen = () => {
        console.log("WebSocket connected to LegacyBridge Ultra WebSocket Handler");
        // Logic to stream Int16 PCM and JPEG chunks 
      };
      
      wsRef.current.onmessage = (event) => {
        console.log("Response from Gemini Live SDK:", event.data);
      };
      
      displayStream.getVideoTracks()[0].onended = () => {
         stopCapture();
      };
      
    } catch (err) {
      console.error("Error starting stream capture:", err);
    }
  }, [isGreenMode]);

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (wsRef.current) {
        wsRef.current.close();
    }
    setIsCapturing(false);
  }, []);

  return { startCapture, stopCapture, streamUrl, isCapturing, isGreenMode, toggleGreenMode };
};

export default useLiveAPI;
