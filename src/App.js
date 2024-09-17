import React, { useState, useEffect } from "react";
import "./App.css"; // Custom CSS file
import Cursor from "./Cursor.js";
import Particles from "./Particle.js";

const App = () => {
  const [productName, setProductName] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [productIngredients, setProductIngredients] = useState("");
  const [formCompletion, setFormCompletion] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 200; // Maximum characters allowed for ingredients
  const [isDarkMode, setIsDarkMode] = useState(true); // Light/Dark mode toggle

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Dynamically calculate form completion based on input length
    let filledFields = 0;
    if (productName) filledFields++;
    if (productNumber) filledFields++;
    if (productIngredients) filledFields++;

    setFormCompletion((filledFields / 3) * 100); // Form completion percentage
  }, [productName, productNumber, productIngredients]);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const handleIngredientsChange = (e) => {
    const value = e.target.value;
    setProductIngredients(value);
    setCharCount(value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Product Name: ${productName}\nProduct Number: ${productNumber}\nIngredients: ${productIngredients}`);
  };

  return (
    <div className="container">
      <Particles/>
      {/* Cursor component for custom cursor */}
      <Cursor />
      
      {/* Scroll bar */}
      <div className="scroll-bar" style={{ width: `${formCompletion}%` }}></div>

      {/* Switch for light/dark mode */}
      <div className="toggle-switch">
        <label className="switch">
          <input type="checkbox" onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
        <span className="mode-label">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
      </div>

      <h1 className="title">Product Information</h1>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${formCompletion}%` }}></div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productNumber">Product Number:</label>
          <input
            type="text"
            id="productNumber"
            value={productNumber}
            onChange={(e) => setProductNumber(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productIngredients">Product Ingredients:</label>
          <textarea
            id="productIngredients"
            value={productIngredients}
            onChange={handleIngredientsChange}
            className="textarea-field"
            maxLength={maxCharCount}
            required
          />
          <p className="char-counter">{charCount}/{maxCharCount} characters</p>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default App;
