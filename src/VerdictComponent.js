import React, { useState } from "react";
import parse from "html-react-parser"
import "./VerdictComponent.css";

const VerdictComponent = ({ ean, setEan }) => {
  const [response, setResponse] = useState(null);
  const [err, setErr] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErr(null)
    try {
      if (!ean) {
        throw new Error("Please enter an Ean number");
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verdict?ean=${ean}`);
      const data = await res.json();
      setResponse(parse(data.response));
    } catch (error) {
      console.error("Error fetching the verdict:", error);
      setErr(error.message);
    }
  };

  return (
    <div className="verdict-container">
      <div className="submit-form">
        <form>
          <label>
            <input
              type="text"
              value={ean}
              onChange={(e) => setEan(e.target.value)}
              placeholder="Enter EAN"
              required
            />
          </label>
        </form>
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </div>
      {response && (
        <div className="response-container">
          {response}
        </div>
      )}
      {err && (
        <div>
          {err}
        </div>
      )}
    </div>
  );
};

export default VerdictComponent;
