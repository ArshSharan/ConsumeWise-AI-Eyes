import React, { useState } from "react";
import parse from "html-react-parser"
import "./VerdictComponent.css";

const VerdictComponent = ({ ean, setEan }) => {
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`http://localhost:8008/api/verdict?ean=${ean}`);
      const data = await res.json();
      setResponse(parse(data.response));
    } catch (error) {
      console.error("Error fetching the verdict:", error);
    }
  };

  return (
    <div className="verdict-container">
      <form onSubmit={handleSubmit}>
        <label>
          EAN:
          <input
            type="text"
            value={ean}
            onChange={(e) => setEan(e.target.value)}
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
    </div>
  );
};

export default VerdictComponent;
