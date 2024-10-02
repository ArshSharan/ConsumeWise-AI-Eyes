import React from 'react';
import './Products.css';

const Products = ({ handleScan, handleTakePicture, scanning, videoRef, videoStream, image, ean }) => {
  return (
    <div className="products-container">
      <h2>Our Products</h2>
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

export default Products;
