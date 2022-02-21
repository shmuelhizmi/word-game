import { Main, TopBar, Keyboard, Container, SharePanel } from "ui";
import { useState, useMemo } from "react";
import { createWordleGame } from "./utils/wordle-core";
import { useRouter } from "next/router";

interface GameProps {
  word?: string;
}

const isSsr = typeof window === "undefined";

export const useUpdate = () => {
  const update = useState(0)[1];
  return () => update(update => update + 1);
};

export function Game(props: GameProps) {
  const game = useMemo(() => createWordleGame(props.word), [props.word]);
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
        title: "ווערטער",
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

  const cheatsOn = router.query.cheats === "on";

  return (
    <Container>
      <TopBar
        newGame={() => (window.location.href = "/create")}
        onMuteClick={onMuteClick}
        overrideHeader={cheatsOn ? game.word : undefined}
        muted={!game.speechSynthesisEnabled}
      />
      <Main
        numberOfRows={6}
        words={game.guesses}
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
