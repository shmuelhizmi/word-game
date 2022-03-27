import { Main, TopBar, Keyboard, Container, SharePanel } from "ui";
import { useState, useMemo } from "react";
import { createWordleGame, createExtreamWordleGame } from "./utils/wordle-core";
import { useRouter } from "next/router";

interface GameProps {
  word?: string;
  hardMode?: boolean;
}

const isSsr = typeof window === "undefined";

export const useUpdate = () => {
  const update = useState(0)[1];
  return () => update(update => update + 1);
};

export function Game(props: GameProps) {
  const createGame = props.hardMode ? createExtreamWordleGame : createWordleGame;
  const game = useMemo(() => createGame(props.word, 3), [props.word]);
  const update = useUpdate();
  const router = useRouter();

  function onLetterClick(letter: string) {
    game.guess(letter);
    update();
  }
  function onLetterDelete() {
    game.deleteLastLetter();
    update();
  }
  function onWordSubmit() {
    game.sendGuess();
    update();
  }
  function onMuteClick() {
    game.speechSynthesisEnabled = !game.speechSynthesisEnabled;
    update();
  }
  function onShareClick() {
    if (window.navigator?.share) {
      window.navigator.share({
        title: "יום הולדת 40 ליפית 🥳",
        url: window.location.toString(),
      });
    } else {
      navigator.clipboard.writeText(window.location.toString()).then(() => {
        alert("לינק לשיתוף הועתק");
      });
    }
  }

  if (isSsr) {
    return null;
  }


  return (
    <Container>
      <TopBar image={router.query.image as string} />
      <Main
        numberOfRows={3}
        words={game.guesses}
        word={game.word}
        isGameOver={game.isGameOver}
        isGameWon={game.isWinning && game.isGameOver}
      />
      {game.isGameOver ? (
        <SharePanel shareData={game.resultText} won={game.isWinning} />
      ) : (
        <Keyboard
          currectLetters={game.currectLetters}
          partialLetters={game.partialLetters}
          wrongLetters={game.wrongLetters}
          onShareClick={onShareClick}
          onBackspaceClick={onLetterDelete}
          onLetterClick={onLetterClick}
          onSendClick={onWordSubmit}
        />
      )}
    </Container>
  );
}
