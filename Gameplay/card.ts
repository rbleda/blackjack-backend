import { CardColor } from "./CardColor";
import { SUIT } from "./Suit"

class Card {
    private numValue: number;
    public strValue: string;
    public suit: SUIT;
    public color: CardColor;
    public upsideDown: boolean;

    constructor(numValue: number, strValue: string, suit: SUIT) {
        this.numValue = numValue;
        this.strValue = strValue;
        this.suit = suit;
        if (suit === SUIT.CLUB || suit === SUIT.SPADE) {
            this.color = CardColor.BLACK;
        } else {
            this.color = CardColor.RED;
        }
        this.upsideDown = false;
    }

    public getValue(): number {
        return this.numValue;
    }

    public setValue(newVal: number): void {
        this.numValue = newVal;
    }

    public flipCard(): void {
        this.upsideDown = !this.upsideDown;
    }

    toJson() {
        return {
            value: this.strValue,
            suit: JSON.stringify(this.suit),
            color: JSON.stringify(this.color),
            upsideDown: JSON.stringify(this.upsideDown)
        }
    }
}

export default Card;