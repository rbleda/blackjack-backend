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
        this.dealer = new Player("Dealer");
        this.deck = generateShuffledDeck();
        this.playerTurn = true;
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
                this.player.dealCard(cardToHit);
                return this.player.getUserName();
            } else if (!this.dealer.hasStood) {
                this.dealer.dealCard(cardToHit);
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
            return this.player.getUserName();
        } else if (!this.playerTurn && !this.dealer.hasStood){
            this.dealer.hasStood = true;
            this.playerTurn = !this.playerTurn;
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