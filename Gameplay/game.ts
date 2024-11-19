import Card from "./card";
import { DealResult } from "./DealResult";
import { generateShuffledDeck } from "./game-play-utils";
import { GameState } from "./GameState";
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

    public initializeGame(): GameState {
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

        if (this.player.hasBJ) {
            return GameState.PLAYER_BJ;
        } else {
            return GameState.NORMAL;
        }
    }

    public async hitPlayer(): Promise<GameState> {
        let cardToHit = this.deck.pop();
        if (cardToHit) {
            console.log("This is the card that is abt to get dealt: ", cardToHit.toJson());
            if (this.playerTurn && !this.player.hasStood) {
                const result = await this.player.dealCard(cardToHit);
                if (result === DealResult.BLACKJACK) {
                    return GameState.PLAYER_BJ;
                } else if (result === DealResult.OUTSIDE) {
                    return GameState.PLAYER_BUST;
                } else {
                    return GameState.NORMAL;
                }
            } else if (!this.playerTurn && !this.dealer.hasStood) {
                const result = await this.dealer.dealCard(cardToHit);
                if (result === DealResult.BLACKJACK) {
                    return GameState.DEALER_BJ;
                } else if (result === DealResult.OUTSIDE) {
                    return GameState.DEALER_BUST;
                } else {
                    return GameState.NORMAL;
                }
            }

            return GameState.NORMAL;
        } else {
            console.log("No cards left in the deck. Game over.");
            return GameState.FINAL;
        }
    }

    public async standPlayer(): Promise<GameState> {
        if (this.playerTurn && !this.player.hasStood) {
            this.player.hasStood = true;
            this.playerTurn = !this.playerTurn;
            return await this.playDealerRound();
        }

        return GameState.NORMAL;
    }

    private async playDealerRound(): Promise<GameState> {
        if (this.dealer.getScore() >= 16) {
            return GameState.FINAL;
        }

        if (await this.hitPlayer() === GameState.NORMAL) {
            return this.playDealerRound();
        }

        return GameState.FINAL;
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