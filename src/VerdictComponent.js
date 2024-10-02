import React, { useState } from "react";
import parse from "html-react-parser"
import "./VerdictComponent.css";

const VerdictComponent = ({ ean, setEan }) => {
  const [response, setResponse] = useState(null);
  const [err, setErr] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verdict?ean=${ean}`);
      const data = await res.json();
      setResponse(parse(data.response));
    } catch (error) {
      console.error("Error fetching the verdict:", error);
      setErr(error);
    }
  };

  return (
    <div className="verdict-container">
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={ean}
            onChange={(e) => setEan(e.target.value)}
            placeholder="Enter EAN"
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          {response}
        </div>
      )}
      {err && (
        <div>
          {process.env.TEST}
        </div>
      )}
    </div>
  );
};

export default VerdictComponent;
