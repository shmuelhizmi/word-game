import { shuffle } from "./shuffle";
import popularWords from "./words.json";
import { Word } from "types";
import { allWords } from "./words";
import { exportToText } from "./share";

const words = shuffle(popularWords, "wordle-games").filter((word) =>
  allWords.includes(word)
);

// days since 13/02/2022
const day =
  (new Date().getTime() - new Date("2022-02-13").getTime()) /
    (1000 * 60 * 60 * 24) +
  1;

const lastLetterMap = {
    נ: "ן",
    פ: "ף",
    צ: "ץ",
    כ: "ך",
    מ: "ם",
  };
export function addHebrewLastLetter(word) {
  const lastLetter = word[word.length - 1];
  if (lastLetterMap[lastLetter]) {
    return word.slice(0, -1) + lastLetterMap[lastLetter];
  }
  return word;
}

const speechSynthesisNotSupported = () =>
  typeof window.speechSynthesis === "undefined" ||
  typeof window.speechSynthesis.speak === "undefined";

export function textToSpeach(text: string) {
  if (speechSynthesisNotSupported()) {
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
  const localStorageKey = `guesses_${Buffer.from(currentWord).toString(
    "base64"
  )}`;
  const read = () =>
    JSON.parse(globalThis.localStorage?.getItem(localStorageKey) || "null") || [
      [],
    ];
  const write = (guesses) =>
    globalThis.localStorage?.setItem(localStorageKey, JSON.stringify(guesses));
  const guesses: Word[] = read();
  let currectLetters = "";
  let partialLetters = "";
  let wrongLetters = "";
  let enableSpeechSynthesis = false;

  for (const guess of guesses) {
    for (const letter of guess) {
      switch (letter.isWinning) {
        case "winning":
          currectLetters += letter.letter;
          break;
        case "partialWinning":
          partialLetters += letter.letter;
          break;
        case "losing":
          wrongLetters += letter.letter;
          break;
      }
    }
  }

  const self = {
    guesses,
    get resultText() {
      return exportToText(guesses);
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
    get word() {
      return currentWord
    },
    get currentGuess() {
      const lastGuess = guesses[guesses.length - 1];
      return lastGuess.map((letter) => letter.letter || "").join("");
    },
    guess(letter: string) {
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.length < wordLength) {
        lastGuess.push({ letter, isWinning: "undetermined" });
      }
      if (self.currentGuess === "יולי") {
        self.guess("❤️");
      }
      return self;
    },
    validateGuess() {
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.length === wordLength) {
        const word = lastGuess.map((letter) => letter.letter).join("");
        const wordWithHebrewLastLetter = addHebrewLastLetter(word);
        if (
          !allWords.includes(word) &&
          !allWords.includes(wordWithHebrewLastLetter)
        ) {
          return false;
        }
        if (enableSpeechSynthesis) textToSpeach(word);
        let wordWithoutCurrentGuess = currentWord;
        lastGuess.forEach((letter, index) => {
          if (
            letter.letter === currentWord[index] ||
            wordWithHebrewLastLetter[index] === currentWord[index]
          ) {
            letter.isWinning = "winning";
            currectLetters += letter.letter;
            wordWithoutCurrentGuess =
              wordWithoutCurrentGuess.substring(0, index) +
              wordWithoutCurrentGuess.substring(index + 1);
          }
        });
        lastGuess.forEach((letter, index) => {
          if (letter.isWinning === "undetermined") {
            if (
              wordWithoutCurrentGuess.includes(letter.letter) ||
              wordWithoutCurrentGuess.includes(wordWithHebrewLastLetter[index])
            ) {
              letter.isWinning = "partialWinning";
              partialLetters += letter.letter;
            } else {
              letter.isWinning = "losing";
              wrongLetters += letter.letter;
            }
          }
        });
        if (guesses.length < 6 && !self.isWinning) {
          guesses.push([]);
        }
        write(guesses);
        return true;
      }
      return false;
    },
    sendGuess() {
      if (self.validateGuess()) {
        return true;
      }
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      return false;
    },
    deleteLastGuess() {
      const lastGuess = guesses[guesses.length - 1];
      lastGuess.slice(0, -1);
      return self;
    },
    deleteLastLetter() {
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.length > 0) {
        lastGuess.pop();
      }
      return self;
    },
    get isWinning() {
      const lastGuess = guesses[guesses.length - 1];
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
      return (
        (guesses.length === 6 &&
          guesses[guesses.length - 1].length === wordLength &&
          !guesses[guesses.length - 1].find(
            (letter) => letter.isWinning === "undetermined"
          )) ||
        self.isWinning
      );
    },
  };
  return self;
}

export type WordCore = ReturnType<typeof createWordleGame>;

export function createExtreamWordleGame(): WordCore {
  // select word for every day
  let currentWord = words[0];
  const wordLength = currentWord.length;
  const guesses: Word[] = [[]];
  let currectLetters = "";
  let partialLetters = "";
  let wrongLetters = "";
  let enableSpeechSynthesis = false;

  const self = {
    guesses,
    get resultText() {
      return exportToText(guesses);
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
    get word() {
      return currentWord
    },
    get currentGuess() {
      const lastGuess = guesses[guesses.length - 1];
      return lastGuess.map((letter) => letter.letter || "").join("");
    },
    guess(letter: string) {
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.length < wordLength) {
        lastGuess.push({ letter, isWinning: "undetermined" });
      }
      return self;
    },
    findHarderWord() {
      let bestWord = "";
      let bestWordScore = 0;
      const scores = new Map<number, string>();
      for (const possibleWord of allWords) {
        let score = 0;
        if (!possibleWord) {
          continue;
        }
        if (possibleWord.includes('\'')) {
          continue;
        }
        const matchAllGuesses = guesses.every((guess) =>
          guess.every((letter, index) => {
            const lastLetter = lastLetterMap[letter.letter] as string;
            if (letter.isWinning === "winning" && (lastLetter !== possibleWord[index] || letter.letter !== possibleWord[index])) {
              return false;
            }
            if (letter.isWinning === "losing"  && (possibleWord.includes(letter.letter) || possibleWord.includes(lastLetter))) {
              return false;
            }
            if (letter.isWinning === "undetermined") {
              if (!possibleWord.includes(letter.letter) && !possibleWord.includes(lastLetter)) {
                score+= 10;
              } else if (possibleWord[index] !== letter.letter && possibleWord[index] !== lastLetter) {
                score+= 5;
              }
            }
            return true;
          }));
        if (!matchAllGuesses) {
          continue;
        }
        scores.set(score, possibleWord);
        if (possibleWord.length !== new Set(possibleWord).size) {
          score += 10;
        }
        const randomness = Math.random() * 5;
        score -= randomness;
        if (score > bestWordScore) {
          bestWord = possibleWord;
          bestWordScore = score;
        }
      }
      console.log(scores);
      return bestWord || currentWord;
    },
    validateGuess() {
      currentWord = self.findHarderWord();
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.length === wordLength) {
        const word = lastGuess.map((letter) => letter.letter).join("");
        const wordWithHebrewLastLetter = addHebrewLastLetter(word);
        if (
          !allWords.includes(word) &&
          !allWords.includes(wordWithHebrewLastLetter)
        ) {
          return false;
        }
        if (enableSpeechSynthesis) textToSpeach(word);
        let wordWithoutCurrentGuess = currentWord;
        lastGuess.forEach((letter, index) => {
          if (
            letter.letter === currentWord[index] ||
            wordWithHebrewLastLetter[index] === currentWord[index]
          ) {
            letter.isWinning = "winning";
            currectLetters += letter.letter;
            wordWithoutCurrentGuess =
              wordWithoutCurrentGuess.substring(0, index) +
              wordWithoutCurrentGuess.substring(index + 1);
          }
        });
        lastGuess.forEach((letter, index) => {
          if (letter.isWinning === "undetermined") {
            if (
              wordWithoutCurrentGuess.includes(letter.letter) ||
              wordWithoutCurrentGuess.includes(wordWithHebrewLastLetter[index])
            ) {
              letter.isWinning = "partialWinning";
              partialLetters += letter.letter;
            } else {
              letter.isWinning = "losing";
              wrongLetters += letter.letter;
            }
          }
        });
        if (guesses.length < 6 && !self.isWinning) {
          guesses.push([]);
        }
        return true;
      }
      return false;
    },
    sendGuess() {
      if (self.validateGuess()) {
        return true;
      }
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      return false;
    },
    deleteLastGuess() {
      const lastGuess = guesses[guesses.length - 1];
      lastGuess.slice(0, -1);
      return self;
    },
    deleteLastLetter() {
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.length > 0) {
        lastGuess.pop();
      }
      return self;
    },
    get isWinning() {
      const lastGuess = guesses[guesses.length - 1];
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
      return (
        (guesses.length === 6 &&
          guesses[guesses.length - 1].length === wordLength &&
          !guesses[guesses.length - 1].find(
            (letter) => letter.isWinning === "undetermined"
          )) ||
        self.isWinning
      );
    },
  };
  return self;
}
