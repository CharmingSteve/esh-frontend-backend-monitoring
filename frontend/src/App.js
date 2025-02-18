import React, { useEffect, useState } from "react";
import log from 'loglevel';

log.setLevel('debug');
log.debug('App started');

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    log.debug("Fetching /api/message...");
    
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => {
        log.debug("Received response:", data);
        setMessage(data.message);
      })
      .catch((err) => {
        log.error("Failed to load message", err);
        setMessage("Failed to load message");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
