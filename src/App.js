import React, { useState, useEffect, useRef } from 'react';
import { BarcodeDetector } from 'barcode-detector/pure';
import VerdictComponent from './VerdictComponent.js';

function App() {
  const [ean, setEan] = useState('');
  const [scanning, setScanning] = useState(true);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  const handleScan = async () => {
    setScanning(!scanning);
    if (!scanning) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  const handleTakePicture = async () => {
    if (!videoRef.current)
      return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const barcodeDetector = new BarcodeDetector({
      formats: ['ean_13']
    });
    const barcodes = await barcodeDetector.detect(canvas);
    console.log(barcodes[0]?.rawValue)
    if (barcodes.length > 0) {
      setEan(barcodes[0].rawValue);
      setScanning(true);
      stopWebcam();
    }

  };

  useEffect(() => {
    const interval = setInterval(handleTakePicture, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, [])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.srcObject.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      video.srcObject = null;
    }
  };

  useEffect(() => {
    if (videoStream) {
      const video = videoRef.current;
      //video.srcObject = videoStream;
      video.play();
    }
  }, [videoStream]);

  return (
    <div>
      <VerdictComponent ean={ean} setEan={setEan} />
      <h1>Barcode Scanner</h1>
      <button onClick={handleScan}>{scanning ? 'Scan' : 'Stop'}</button>
      {!scanning && (
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      )}
      <button onClick={handleTakePicture} disabled={!videoStream}>
        Take Picture
      </button>
    </div>
  );
}

export default App;
