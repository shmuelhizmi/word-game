import { Main, TopBar, Keyboard, Container } from "ui";
import { useEffect, useState } from "react";
import { createWordleGame } from "./utils/wordle-core";

interface GameProps {
  word?: string;
}
export function Game(props: GameProps) {
  const [game, setGame] = useState(() => createWordleGame(props.word));
  const [words, setWords] = useState(game.guesses);

  useEffect(() => {
    setGame(createWordleGame(props.word));
    setWords(game.guesses);
  }, [props.word]);

  function onLetterClick(letter: string) {
    const newWords = game.guess(letter);
    setWords([...newWords.guesses]);
  }
  function onLetterDelete() {
    const newWords = game.deleteLastLetter();
    setWords([...newWords.guesses]);
  }
  function onWordSubmit() {
    const success = game.sendGuess();
    setWords([...game.guesses]);
  }
  function onMuteClick() {
    game.speechSynthesisEnabled = !game.speechSynthesisEnabled;
    setWords([...game.guesses]);
  }
  return (
    <Container>
      <TopBar
        newGame={() => (window.location.href = "/create")}
        onMuteClick={onMuteClick}
        muted={!game.speechSynthesisEnabled}
      />
      <Main
        numberOfRows={6}
        words={words}
        isGameOver={game.isGameOver}
        isGameWon={game.isWinning && game.isGameOver}
      />
      <Keyboard
        currectLetters={game.currectLetters}
        partialLetters={game.partialLetters}
        wrongLetters={game.wrongLetters}
        onBackspaceClick={onLetterDelete}
        onLetterClick={onLetterClick}
        onSendClick={onWordSubmit}
      />
    </Container>
  );
}
