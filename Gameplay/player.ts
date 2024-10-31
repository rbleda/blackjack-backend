import Card from "./card";

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
    public dealCard(card: Card) {
        const potentialScore = this.score + card.getValue();
        if (potentialScore === 21) {
            this.hasBJ = true;
            return
        } else if (potentialScore > 21) {
            this.inGame = false;
            return;
        }

        const updatedHand = [...this.hand, card];
        this.hand = updatedHand;
        this.setNewScore(updatedHand);
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