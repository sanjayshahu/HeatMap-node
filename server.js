const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
 const getRandomTimestamp = () => {
    const start = new Date(new Date().getFullYear(), 0, 1);
    const end = new Date(new Date().getFullYear(), 11, 31);
    const randomTimestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomTimestamp;
  };

  // Periodically send events to the client
  const sendEvent = () => {
    const event = {
      timestamp: getRandomTimestamp(),
      intensity: Math.floor(Math.random() * 10) + 1,
    };
    ws.send(JSON.stringify(event));
  };

  const intervalId = setInterval(sendEvent, 300); 

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
