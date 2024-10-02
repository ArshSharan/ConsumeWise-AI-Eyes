import React, { useState, useEffect, useRef } from 'react';
import { BarcodeDetector } from 'barcode-detector/pure';
import VerdictComponent from './VerdictComponent.js';
import Home from './Home.js';
import About from './About.js';
import Items from './Items.js';
import Contact from './Contact.js';
import './App.css';

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
    console.log(barcodes[0]?.rawValue);
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
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
      video.srcObject.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
      video.srcObject = null;
    }
  };

  useEffect(() => {
    if (videoStream) {
      const video = videoRef.current;
      video.play();
    }
  }, [videoStream]);

  return (
    <div>
      <header>
        <h1 onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
          GenZ-AI
        </h1>
        <nav>
          <button onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}>Home</button>
          <button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</button>
          <button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>Scanner</button>
          <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</button>
        </nav>
      </header>
      <main>
        <section id="home">
          <Home />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="products">

          <VerdictComponent ean={ean} setEan={setEan} />
          <div className="verdict-container">

            <div >Scan Your Barcode Here</div>
            <button class="scan-button" onClick={handleScan}>{scanning ? 'Scan' : 'Stop'}</button>
            {!scanning && (
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
            )}

          </div>

        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>

    </div>
  );
}

export default App;
