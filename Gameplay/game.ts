import Card from "./card";
import { generateShuffledDeck } from "./game-play-utils";
import Player from "./player";

class Game {
    private player: Player;
    private dealer: Player;
    private deck: Card[];
    private playerTurn: boolean;

    constructor(player: Player) {
        this.player = player;
        this.dealer = new Player("dealer");
        this.deck = [];
        this.playerTurn = true;
    }

    public initializeGame(): void {
        if (this.deck.length != 0) {
            this.player.reset();
            this.dealer.reset();
            this.deck = [];
            this.playerTurn = true;
        }
        this.deck = generateShuffledDeck();
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
            if (this.playerTurn) {
                this.player.dealCard(cardToHit);
                return this.player.getUserName();
            } else {
                this.dealer.dealCard(cardToHit);
                return this.dealer.getUserName();
            }
        } else {
            console.log("No cards left in the deck. Game over.");
            return '';
        }
    }

    public standPlayer(): string {
        if (this.playerTurn && !this.player.hasStood) {
            this.player.hasStood = true;
            return this.player.getUserName();
        } else if (!this.playerTurn && !this.dealer.hasStood){
            this.dealer.hasStood = true;
            return this.dealer.getUserName();
        }

        return '';
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