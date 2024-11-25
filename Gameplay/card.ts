import { CardColor } from "./CardColor";
import { SUIT } from "./Suit"

class Card {
    private numValue: number;
    public strValue: string;
    public suit: SUIT;
    public color: CardColor;

    constructor(numValue: number, strValue: string, suit: SUIT) {
        this.numValue = numValue;
        this.strValue = strValue;
        this.suit = suit;
        if (suit === SUIT.CLUB || suit === SUIT.SPADE) {
            this.color = CardColor.BLACK;
        } else {
            this.color = CardColor.RED;
        }
    }

    public getValue(): number {
        return this.numValue;
    }

    public setValue(newVal: number): void {
        this.numValue = newVal;
    }

    toJson() {
        return {
            value: this.strValue,
            suit: JSON.stringify(this.suit),
            color: JSON.stringify(this.color)
        }
    }
}

export default Card;