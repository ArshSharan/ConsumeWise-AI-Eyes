import React from 'react';
import './Items.css';

const Items = ({ handleScan, handleTakePicture, scanning, videoRef, videoStream, image, ean }) => {
  return (
    <div className="items-container">
      <h2>Our items</h2>
      <p>Click on the button below to scan a barcode.</p>
      <button onClick={handleScan}>{scanning ? 'Stop' : 'Scan'}</button>
      {scanning && <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />}
      <button onClick={handleTakePicture} disabled={!videoStream}>
        Take Picture
      </button>
      {image && <img src={image} alt="Screenshot" style={{ width: '100%' }} />}
      {ean && <p>Scanned EAN: {ean}</p>}
    </div>
  );
};

export default Items;
