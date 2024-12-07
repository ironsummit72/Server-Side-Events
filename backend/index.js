const express = require("express");
const cors = require("cors");
const eventEmmiter=require('events');
const { EventEmitter } = require("stream");
const Stream=new EventEmitter()
const app = express();
const port = 3001;
app.use(cors({
    origin:"http://127.0.0.1:5501",
    credentials:true
}));

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let counter = 0;
  let intervalId = setInterval(() => {
    counter++;
    if (counter >= 1001) {
      clearInterval(intervalId);
      res.end();
      return;
    }

    res.write(`data: ${JSON.stringify(counter)}\n\n`);
  }, 5);
  res.on("close", () => {
    console.log("client is no longer connected");
    clearInterval(intervalId);
    res.end();
  });
});
app.get("/events", (req, res) => {
    // Set the required headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    // Send an initial message
    res.write("data: Connected to SSE\n\n");
  
    // Send periodic updates
    const interval = setInterval(() => {
      const message = { timestamp: new Date(), random: Math.random() };
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    }, 1000);
  
    // Handle client disconnection
    req.on("close", () => {
      console.log("Client disconnected");
      clearInterval(interval);
      res.end();
    });
  });


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
