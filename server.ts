import WebSocket from 'ws';
import http from 'http';
import Game from './Gameplay/game'; // Adjust the path based on your structure
import Player from './Gameplay/player';
import GameManager from './GameManager/game-manager';

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Game server is running!\n');
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected!');
    console.log('Starting game:::>');
    const game = new Game(new Player("Rai Bleda"));
    const gameManager = new GameManager(ws, game);
});

// Start the HTTP server on port 7070
const PORT = 7070;
server.listen(PORT, () => {
    console.log(`Game WebSocket server is listening on ws://localhost:${PORT}`);
});