export const useFakeDecks = () => {
  const docDeck = accessDocDeck();
  const noteDeck = accessNoteDeck();
  return { docDeck, noteDeck };
};
