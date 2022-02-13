import { shuffle } from "./shuffle";
import popularWords from "./words.json";
import { Word } from "types";
import { allWords } from "./words";

const words = shuffle(popularWords, "wordle-games").filter((word) =>
  allWords.includes(word)
);

// days since 13/02/2022
const day =
  (new Date().getTime() - new Date("2022-02-13").getTime()) /
    (1000 * 60 * 60 * 24) +
  1;

export function addHebrewLastLetter(word) {
    const map = {
        "נ": "ן",
        "פ": "ף",
        "צ": "ץ",
        "כ": "ך",
    };
    const lastLetter = word[word.length - 1];
    if (map[lastLetter]) {
        return word.slice(0, -1) + map[lastLetter];
    }
    return word;
}

const speechSynthesisNotSupported = () => (
  typeof window.speechSynthesis === "undefined" ||
    typeof window.speechSynthesis.speak === "undefined"
);

export function textToSpeach(text: string) {
  if (
    speechSynthesisNotSupported()
  ) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "he";
  window.speechSynthesis.speak(utterance);
}

export function createWordleGame(word?: string) {
  // select word for every day
  const currentWord = word || words[Math.floor(day % words.length)];
  const wordLength = currentWord.length;
  const gusses: Word[] = [[]];
  let currectLetters = "";
  let partialLetters = "";
  let wrongLetters = "";
  let enableSpeechSynthesis = false;

  const self = {
    get guesses() {
      return gusses;
    },
    get speechSynthesisEnabled() {
      return enableSpeechSynthesis && !speechSynthesisNotSupported();
    },
    set speechSynthesisEnabled(value) {
      enableSpeechSynthesis = value;
    },
    get currectLetters() {
        return currectLetters;
    },
    get partialLetters() {
        return partialLetters;
    },
    get wrongLetters() {
        return wrongLetters;
    },
    word: currentWord,
    guess(letter: string) {
      const lastGuess = gusses[gusses.length - 1];
      if (lastGuess.length < wordLength) {
        lastGuess.push({ letter, isWinning: "undetermined" });
      }
      return self;
    },
    sendGuess() {
      const lastGuess = gusses[gusses.length - 1];
      if (lastGuess.length === wordLength) {
        const word = lastGuess.map((letter) => letter.letter).join("");
        const wordWithHebrewLastLetter = addHebrewLastLetter(word);
        if (!allWords.includes(word) && !allWords.includes(wordWithHebrewLastLetter)) {
          return false;
        }
        if (enableSpeechSynthesis) textToSpeach(word);
        let wordWithoutCurrentGuess = currentWord;
        lastGuess.forEach((letter, index) => {
          if (letter.letter === currentWord[index] || wordWithHebrewLastLetter[index] === currentWord[index]) {
            letter.isWinning = "winning";
            currectLetters += letter.letter;
            wordWithoutCurrentGuess =
              wordWithoutCurrentGuess.substring(0, index) +
              wordWithoutCurrentGuess.substring(index + 1);
          }
        });
        lastGuess.forEach((letter, index) => {
          if (letter.isWinning === "undetermined") {
            if (wordWithoutCurrentGuess.includes(letter.letter) || wordWithoutCurrentGuess.includes(wordWithHebrewLastLetter[index])) {
              letter.isWinning = "partialWinning";
              partialLetters += letter.letter;
            } else {
              letter.isWinning = "losing";
              wrongLetters += letter.letter;
            }
          }
        });
        if (gusses.length < 6) {
            gusses.push([]);
        }
        return true;
      }
      return false;
    },
    deleteLastGuess() {
      const lastGuess = gusses[gusses.length - 1];
      lastGuess.slice(0, -1);
      return self;
    },
    deleteLastLetter() {
      const lastGuess = gusses[gusses.length - 1];
      if (lastGuess.length > 0) {
        lastGuess.pop();
      }
      return self;
    },
    get isWinning() {
      const lastGuess = gusses[gusses.length - 1];
      if (lastGuess.length !== wordLength) {
        return false;
      }
      for (const letter of lastGuess) {
        if (letter.isWinning !== "winning") {
          return false;
        }
      }
      return true;
    },
    get isGameOver() {
      return !self.isWinning && gusses.length === 6 && gusses[gusses.length - 1].length === wordLength;
    },
  };
  return self;
}
