import Card from "./card";
import { DealResult } from "./DealResult";
import { getHandScore } from "./game-play-utils";

class Player {
    private userName: string;
    private score: number;
    private hand: Card[];
    public inGame: boolean;
    public hasBJ: boolean;
    public hasStood: boolean;

    constructor(userName: string) {
        this.userName = userName;
        this.hand = [];
        this.score = 0;
        this.inGame = true;
        this.hasBJ = false;
        this.hasStood = false;
    }

    public getScore(): number {
        return this.score;
    }

    public getUserName(): string {
        return this.userName;
    }

    public reset(): void {
        this.hand = [];
        this.score = 0;
        this.inGame = true;
        this.hasBJ = false;
        this.hasStood = false;
    }

    // Deal a card to the player, if that player goes over 21
    // he is out of the game.
    public async dealCard(card: Card): Promise<DealResult> {
        let potentialScore = this.score + card.getValue();
        let updatedHand = [...this.hand, card];
        const aces = updatedHand.filter(card => card.strValue === "A");
        if (aces.length > 0 && potentialScore > 21 ) {
            updatedHand.forEach(card => {
                if (getHandScore(updatedHand) <= 21) {
                    return;
                }

                if (card.strValue === "A") {
                    card.setValue(1);
                }
            });

            potentialScore = getHandScore(updatedHand);
        }

        this.hand = updatedHand;
        this.setNewScore(updatedHand);
        if (potentialScore === 21) {
            this.hasBJ = true;
            return DealResult.BLACKJACK;
        } else if (potentialScore > 21) {
            this.inGame = false;
            return DealResult.OUTSIDE;
        } else {
            return DealResult.INSIDE;
        }
    }

    // Set new score for player based on updated hand
    private setNewScore(updatedHand: Card[]): void {
        let score: number = 0;
        updatedHand.forEach(card => {
            score += card.getValue();
        })

        this.score = score;
    }

    toJson() {
        return {
            userName: this.userName,
            hand: this.hand.map(card => card.toJson())
        }
    }
}

export default Player;