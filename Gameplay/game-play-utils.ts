import Card from "./card";
import { SUIT } from "./Suit";

export const generateShuffledDeck = () : Card[] => {
    const cardArray : Array<Card> = [];
    const cardMap: Map<string, number> = getCards();
    const strCardValues = Array.from(cardMap.keys());
    Object.values(SUIT).forEach((suit) => {
        strCardValues.forEach((value: string) => {
            const numCardValue = cardMap.get(value);
            if (numCardValue) {
                const theCard = new Card(numCardValue, value, suit);
                cardArray.push(theCard);
            }
        });
    })

    return shuffleCards(cardArray);
}

const shuffleCards = (array: Card[]): Card[] => {
    const shuffledArray = [...array]; // Make a copy to avoid mutating the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
}

export const getCards = () : Map<string, number> => {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardValues = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const theCards = new Map();
    for (let i=0; i < cards.length; i++) {
        theCards.set(cards[i], cardValues[i]);
    }

    return theCards;
}