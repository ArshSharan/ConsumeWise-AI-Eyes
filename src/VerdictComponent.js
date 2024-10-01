import React, { useState } from "react";

const VerdictComponent = () => {
    const [ean, setEan] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(`http://localhost:8008/api/verdict?ean=${ean}`);
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error("Error fetching the verdict:", error);
        }
    };

    return (
        <div>
            <h1>Verdict API</h1>
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
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default VerdictComponent;
