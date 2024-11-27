import Card from "./card";
import { DealResult } from "./DealResult";
import { generateShuffledDeck } from "./game-play-utils";
import { GameState } from "./GameState";
import Player from "./player";

class Game {
    private player!: Player;
    private dealer!: Player;
    private deck!: Card[];
    private playerTurn!: boolean;
    private playerBank!: number;
    private playerBet!: number;

    constructor(player: Player) {
        this.player = player;
        this.dealer = new Player("Dealer");
        this.deck = generateShuffledDeck();
        this.playerTurn = true;
        this.playerBank = 100;
        this.playerBet = 0;
    }

    public async initializeGame(): Promise<GameState> {
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

    public async startNewRound(): Promise<GameState> {
        this.setNewRoundVars();
        return this.initializeGame();
    }

    public setPlayerUserName(username: string) {
        this.player.setUserName(username);
    }

    public async placePlayerBet(betAmount: number): Promise<GameState> {
        if (this.playerBank - betAmount >= 0) {
            this.playerBank = this.playerBank - betAmount;
            this.playerBet = this.playerBet + betAmount;
            return GameState.NORMAL;
        }

        return GameState.FINAL;
    }

    private async playDealerRound(): Promise<GameState> {
        if (this.dealer.getScore() >= 17 && this.dealer.getScore() <= 20) {
            return GameState.FINAL;
        } else if (this.dealer.getScore() === 21) {
            return GameState.DEALER_BJ;
        } else if (this.dealer.getScore() > 21) {
            return GameState.DEALER_BUST;
        }

        const hitDealerResult = await this.hitPlayer();
        return this.playDealerRound();
    }

    private setNewRoundVars(): void {
        this.player.reset();
        this.dealer.reset();
        this.deck = generateShuffledDeck();
        this.playerTurn = true;
    }

    toJson() {
        return {
            player: this.player.toJson(),
            dealer: this.dealer.toJson(),
            playerTurn: this.playerTurn,
            playerBank: this.playerBank,
            playerBet: this.playerBet,
        }
    }
}

export default Game;