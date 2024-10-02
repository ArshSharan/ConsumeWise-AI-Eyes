import React, { useState, useEffect, useRef } from 'react';
import { BarcodeDetector } from 'barcode-detector/pure';
import VerdictComponent from './VerdictComponent.js';
import Home from './Home.js';
import About from './About.js';
import Products from './Products.js';
import Contact from './Contact.js';
import './App.css';

function App() {
  const [ean, setEan] = useState('');
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
    const barcodeDetector = new BarcodeDetector({ formats: ['ean_13'] });
    const barcodes = await barcodeDetector.detect(canvas);
    console.log(barcodes[0]?.rawValue);
    if (barcodes.length > 0) {
      setEan(barcodes[0].rawValue);
    }
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
        <h1 onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}>
          Barcode Scanner
        </h1>
        <nav>
          <button onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}>Home</button>
          <button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</button>
          <button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>Products</button>
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
          <Products
            handleScan={handleScan}
            handleTakePicture={handleTakePicture}
            scanning={scanning}
            videoRef={videoRef}
            videoStream={videoStream}
            image={image}
            ean={ean}
          />
          <VerdictComponent ean={ean} setEan={setEan} />
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
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </div>
  );
}

export default App;
