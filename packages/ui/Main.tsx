import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import _ from "lodash";
import { Letter, Word } from "types";
import { useEffect, useState } from "react";

const Container = styled.div`
  font-family: "Secular One";
  font-size: clamp(1vw, 10vw, 2em);
`;

const Row = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
`;

const Tile = styled.div`
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: solid rgb(212, 212, 212);
  border-width: 3px;
  border-radius: 5px;
  vertical-align: top;
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const flipIn = keyframes`
    0% {
        transform: rotate(0deg);
    }
    50% {
        transform: rotateX(90deg) rotateY(90deg) rotateZ(45deg);
    }
    100% {
        transform: rotate(0deg);
    }
`;

const WinningTile = styled(Tile)`
  background-color: rgb(98, 159, 91);
  border-color: rgb(98, 159, 91);
  animation: ${flipIn} 0.7s linear;
`;

const LosingTile = styled(Tile)`
  background-color: rgb(109, 113, 115);
  border-color: rgb(109, 113, 115);
  animation: ${flipIn} 0.7s linear;
`;

const PartialWinningTile = styled(Tile)`
  background-color: rgb(194, 170, 82);
  border-color: rgb(194, 170, 82);
  animation: ${flipIn} 0.7s linear;
`;

const UndeterminedTile = styled(Tile)`
  border-color: rgb(34, 34, 34);
  @media (prefers-color-scheme: dark) {
    border-color: white;
  }
`;

// fall animation
const losseAnimation = keyframes`
    0% {
        transform: translate(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translate(0, var(--item-drop)) rotate(var(--item-rotate));
        opacity: 0.2;
    }
`;

const LossingContainer = styled(Container)`
  > div > div {
    animation: ${losseAnimation} 1.5s ease-in-out alternate;
    animation-fill-mode: forwards;
  }
`;

const UnlossingContainer = styled(LossingContainer)`
  > div > div {
    animation: ${losseAnimation} 1.5s ease-in-out alternate;
    animation-fill-mode: forwards;
    animation-direction: reverse;
  }
`;

interface MainInterfaceProps {
  words: Word[];
  word: string;
  numberOfRows: number;
  isGameOver: boolean;
  isGameWon: boolean;
}

export function fillMissingWords(_words: Word[], numberOfRows: number) {
  const words = _.cloneDeep(_words);
  const wordSize = 5;
  for (const word of words) {
    while (word.length < wordSize) {
      word.push({
        isWinning: "empty",
      });
    }
  }
  while (words.length < numberOfRows) {
    words.push(Array(wordSize).fill({ isWinning: "empty" }));
  }
  return words;
}

const defaultLossingText = "המילה איננה נכונה המילה איננה";

function lossingWords(word: string, lossingText = defaultLossingText): Word[] {
  return lossingText.split(" ").map((word, i) =>
    word.split("").map((letter) => ({
      isWinning: (i + 1) % 2 === 0 ? "losing" : "partialWinning",
      letter,
    } as Letter))
  ).concat([word.split("").map((letter) => ({
    isWinning: "winning",
    letter,
  } as Letter))]);
}

export function createDeterministicRandom(): () => number {
  let seed = 0x2f6e2b1;
  return function () {
    // Robert Jenkins’ 32 bit integer hash function
    seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff;
    seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff;
    seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff;
    seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
    seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff;
    seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff;
    return (seed & 0xfffffff) / 0x10000000;
  };
}
const random = createDeterministicRandom();

const styles = Array(10)
  .fill(0)
  .map(() =>
    Array(10)
      .fill(0)
      .map(() => ({
        ["--item-drop" as string]: `${Math.floor(random() * 2000)}%`,
        ["--item-rotate" as string]: `${Math.floor(random() * 360)}deg`,
      }))
  );

export const Main = (props: MainInterfaceProps) => {
  const [useLossingWords, setUseLossingWords] = useState(false);
  const words = fillMissingWords(props.words, props.numberOfRows);
  const lost = props.isGameOver && !props.isGameWon;
  const Wrapper = lost
    ? useLossingWords
      ? UnlossingContainer
      : LossingContainer
    : Container;
  useEffect(() => {
    if (lost) {
      setTimeout(() => {
        setUseLossingWords(true);
      }, 1500);
    }
  }, [props.isGameOver]);
  return (
    <Wrapper>
      {(useLossingWords ? lossingWords(props.word) : words).map((word, columnIndex) => (
        <Row key={columnIndex}>
          {word.map((letter, rowIndex) => {
            let CurrentTile = UndeterminedTile;
            if (letter.isWinning === "winning") {
              CurrentTile = WinningTile;
            }
            if (letter.isWinning === "losing") {
              CurrentTile = LosingTile;
            }
            if (letter.isWinning === "partialWinning") {
              CurrentTile = PartialWinningTile;
            }
            if (letter.isWinning === "empty") {
              CurrentTile = Tile;
            }
            return (
              <CurrentTile style={styles[columnIndex][rowIndex]} key={rowIndex}>
                {letter.letter}
              </CurrentTile>
            );
          })}
        </Row>
      ))}
    </Wrapper>
  );
};
