import Game from '../Gameplay/game';
import WebSocket from 'ws';

class GameManager {
    private ws: WebSocket;
    private game: Game;
    private actions: Map<string, (payload?: any) => void>;

    constructor(ws: WebSocket, game: Game) {
        this.ws = ws;
        this.game = game;

        this.actions = this.addGameActions();
        this.game.initializeGame();

        if (this.ws.OPEN) {
            setTimeout(() => {
                this.ws.send(JSON.stringify({ type: 'GAME_STATE', state: JSON.stringify(this.game.toJson()) }));
            }, 1500);
        }

        this.ws.on("message", (message: string) => {
            const { action, payload } = JSON.parse(message);

            // Check if action exists in our game commands
            if (this.actions.has(action)) {
                const method = this.actions.get(action);
                if (method) {
                    // Execute game action which results in a modified game state
                    method(payload);
                }

                if (this.game.isGameOver()) {
                    // Send final state message to client if game is over
                    this.ws.send(JSON.stringify({ type: 'FINAL_STATE', state: JSON.stringify(this.game.toJson()) }));
                    return;
                }

                if (this.game.isGameUpdate()) {
                    // Make sure game has been updated to send data to client
                    this.ws.send(JSON.stringify({ type: 'GAME_STATE', state: JSON.stringify(this.game.toJson()) }));
                    this.game.setGameUpdate(false);
                    return;
                }

                // // Return new game state to client
                // this.ws.send(JSON.stringify({ type: 'GAME_STATE', state: JSON.stringify(this.game.toJson()) }));
            } else {
                console.log('Unknown action received:', action);
            }
        });

        this.ws.on('close', () => {
            console.log('Game disconnected');
        });
    }


    private addGameActions(): Map<string, (payload?: any) => void> {
        let actions: Map<string, (payload?: any) => void> = new Map();
        actions.set('HIT_PLAYER', () => {
            const playerHit = this.game.hitPlayer();
            console.log("This player has been hit: ", playerHit);
        });

        actions.set('STAND_PLAYER', () => {
            const playerStood = this.game.standPlayer();
            console.log("This player has been stood: ", playerStood);
        });

        return actions;
    }
}

export default GameManager;