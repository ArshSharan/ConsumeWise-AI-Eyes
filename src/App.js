import React, { useState, useEffect, useRef } from 'react';
import {BarcodeDetector} from 'barcode-detector/pure';
import VerdictComponent from './VerdictComponent.js';

function App() {
  const [eanNumber, setEanNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);

  const handleScan = async () => {
    setScanning(!scanning);
    if (scanning) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  const handleTakePicture = async () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    const barcodeDetector = new BarcodeDetector({
      formats: ['ean_13']});
    const barcodes = await barcodeDetector.detect(canvas);
    console.log(barcodes[0]?.rawValue);  
    setImage(imageData);
  };

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
    if (videoStream) {
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
      <VerdictComponent />
      <h1>Barcode Scanner</h1>
      <button onClick={handleScan}>{scanning ? 'Stop' : 'Scan'}</button>
      {scanning && (
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      )}
      <button onClick={handleTakePicture} disabled={!videoStream}>
        Take Picture
      </button>
      {image && (
        <img src={image} alt="Screenshot" style={{ width: '100%' }} />
      )}
    </div>
  );
}

export default App;