import { useState } from "react";
import { Letter } from "types";
import { Container, Keyboard, Main, MiniTopBar } from "ui";
import { addHebrewLastLetter } from "../utils/wordle-core";
import { allWords } from "../utils/words";

export default function CreateGame() {
  const [newWord, setNewWord] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  function AddLetter(letter: string) {
    if (newWord.length < 5) {
      setNewWord(newWord + letter);
    }
  }
  function DeleteLetter() {
    if (newWord.length > 0) {
      setNewWord(newWord.slice(0, -1));
      setInvalidWord(false);
    }
  }

  function onSubmit() {
    const index = allWords.indexOf(newWord);
    const withLastLetter = addHebrewLastLetter(newWord);
    const indexWithLastLetter = allWords.indexOf(withLastLetter);
    if (index >= 0) {
      window.location.href = `/custom/${index}`;
    } else if (indexWithLastLetter >= 0) {
      window.location.href = `/custom/${indexWithLastLetter}`;
    } else {
        setInvalidWord(true);
    }
  }

  return (
    <Container>
      <MiniTopBar />
      <Main
        numberOfRows={1}
        isGameOver={false}
        isGameWon={false}
        words={[
          newWord.split("").map(
            (letter) =>
              ({
                letter: letter,
                isWinning: invalidWord ? "partialWinning" : "winning",
              } as Letter)
          ),
        ]}
      />
      <Keyboard
        currectLetters={invalidWord ? newWord : ""}
        onBackspaceClick={DeleteLetter}
        onLetterClick={AddLetter}
        onSendClick={onSubmit}
        partialLetters=""
        wrongLetters=""
      />
    </Container>
  );
}
