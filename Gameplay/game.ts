import Card from "./card";
import { DealResult } from "./DealResult";
import { generateShuffledDeck } from "./game-play-utils";
import Player from "./player";

class Game {
    private player: Player;
    private dealer: Player;
    private deck: Card[];
    private playerTurn: boolean;
    private gameUpdate: boolean;
    private gameOver: boolean;

    constructor(player: Player) {
        this.player = player;
        this.dealer = new Player("Dealer");
        this.deck = generateShuffledDeck();
        this.playerTurn = true;
        this.gameUpdate = false;
        this.gameOver = false;
    }

    public initializeGame(): void {
        let dealCount = 0;
        while (dealCount <= 3) {
            const cardToDeal = this.deck.pop();
            if (cardToDeal) {
                if (this.playerTurn) {
                    this.player.dealCard(cardToDeal);
                    this.playerTurn = false;
                } else {
                    this.dealer.dealCard(cardToDeal);
                    this.playerTurn = true;
                }
            }

            dealCount++;
        }
    }

    public hitPlayer(): string {
        let cardToHit = this.deck.pop();
        if (cardToHit) {
            console.log("This is the card that is abt to get dealt. ", cardToHit.toJson());
            if (this.playerTurn && !this.player.hasStood) {
                const result = this.player.dealCard(cardToHit);
                if (result === DealResult.BLACKJACK || result === DealResult.OUTSIDE) {
                    this.gameOver = true;
                }
                this.setGameUpdate(true);
                return this.player.getUserName();
            } else if (!this.playerTurn && !this.dealer.hasStood) {
                const result = this.dealer.dealCard(cardToHit);
                if (result === DealResult.BLACKJACK || result === DealResult.OUTSIDE) {
                    this.gameOver = true;
                }
                this.setGameUpdate(true);
                return this.dealer.getUserName();
            }

            return 'Nobody';
        } else {
            console.log("No cards left in the deck. Game over.");
            return '';
        }
    }

    public standPlayer(): string {
        if (this.playerTurn && !this.player.hasStood) {
            this.player.hasStood = true;
            this.playerTurn = !this.playerTurn;
            this.playDealerRound();
            return this.player.getUserName();
        }

        return '';
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public isGameUpdate(): boolean {
        return this.gameUpdate;
    }

    public setGameUpdate(val: boolean): void {
        this.gameUpdate = val;
    }

    private playDealerRound() {
        if (this.dealer.getScore() >= 16) {
            this.gameOver = true;
            return;
        }

        while (!this.gameOver) {
            const dealerHit = this.hitPlayer();
            console.log("Hitting the dealer again_", dealerHit);

            this.playDealerRound();
        }
    }

    toJson() {
        return {
            player: this.player.toJson(),
            dealer: this.dealer.toJson(),
            playerTurn: this.playerTurn
        }
    }
}

export default Game;