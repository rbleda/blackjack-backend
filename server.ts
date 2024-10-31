import WebSocket from 'ws';
import http from 'http';
import Game from './Gameplay/game'; // Adjust the path based on your structure
import Player from './Gameplay/player';

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Game server is running!\n');
});

// WebSocket server
const wss = new WebSocket.Server({ server });

// Start game when server is run
const game = new Game(new Player("Rai Bleda"));

// Client actions
const actions: { [key: string]: (payload?: any) => void } = {
    'HIT_PLAYER': () => {
        const playerHit = game.hitPlayer();
        console.log("This player has been hit: ", playerHit);
    },
    'STAND_PLAYER': () => {
        const playerStood = game.standPlayer();
        console.log("This player has been stood: ", playerStood);
    },
};

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected!');
    console.log('Starting game:::>');
    game.initializeGame();
    
    // Send initial game state to the client
    ws.send(JSON.stringify({ type: 'INITIAL_STATE', state: JSON.stringify(game.toJson()) }));

    // Receive and process actions from clients
    ws.on('message', (message: string) => {
        const { action, payload } = JSON.parse(message);

        // Check if action exists in our game commands
        if (actions[action]) {
            actions[action](payload);
            
            // Broadcast updated game state to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'UPDATED_GAME', state: JSON.stringify(game.toJson()) }));
                }
            });
        } else {
            console.log('Unknown action received:', action);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the HTTP server on port 7070
const PORT = 7070;
server.listen(PORT, () => {
    console.log(`Game WebSocket server is listening on ws://localhost:${PORT}`);
});

