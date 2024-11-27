import Game from '../Gameplay/game';
import WebSocket from 'ws';
import { GameState } from '../Gameplay/GameState';

class GameManager {
    private ws: WebSocket;
    private game: Game;
    private actions: Map<string, (payload?: any) => Promise<GameState>>;

    constructor(ws: WebSocket, game: Game) {
        this.ws = ws;
        this.game = game;

        this.actions = this.addGameActions();
        // let initialGameState = this.game.initializeGame();

        // if (this.ws.OPEN) {
        //     setTimeout(() => {
        //         this.ws.send(JSON.stringify({ type: initialGameState, state: JSON.stringify(this.game.toJson()) }));
        //     }, 1500);
        // }

        this.ws.on("message", async (message: string) => {
            const { action, payload } = JSON.parse(message);

            // Check if action exists in our game commands
            if (this.actions.has(action)) {
                const method = this.actions.get(action);
                let gameState = GameState.NORMAL;
                if (method) {
                    // Execute game action which results in a modified game state
                    gameState = await method(payload);
                }

                // Send game state to client which could be a final state or a normal state
                this.ws.send(JSON.stringify({ type: gameState, state: JSON.stringify(this.game.toJson()) }));
                return;
            } else {
                console.log('Unknown action received:', action);
            }
        });

        this.ws.on('close', () => {
            console.log('Game disconnected');
        });
    }


    private addGameActions(): Map<string, (payload?: any) => Promise<GameState>> {
        let actions: Map<string, (payload?: any) => Promise<GameState>> = new Map();
        actions.set('HIT_PLAYER', () => {
            console.log("Hitting current player");
            return this.game.hitPlayer();
        });

        actions.set('STAND_PLAYER', () => {
            console.log("Standing current player");
            return this.game.standPlayer();
        });

        actions.set('NEW_ROUND', () => {
            console.log("Starting new round");
            return this.game.startNewRound();
        });

        actions.set('INIT_GAME', async (payload: any) => {
            console.log("Starting new game for", payload.userName);
            this.game.setPlayerUserName(payload?.userName);

            // Adding a timeout here because want to make sure the user name is set
            // Also because it looks cool when it is loading on the frontend screen
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return GameState.INITIAL;
        });

        actions.set('PLACE_BET', (payload: any) => {
            console.log("Placing a bet for player of: " + payload.amount);
            return this.game.placePlayerBet(payload.amount);
        });

        actions.set('DEAL_ROUND', () => {
            console.log("Dealing a new round for players.");
            return this.game.initializeGame();
        });

        return actions;
    }
}

export default GameManager;