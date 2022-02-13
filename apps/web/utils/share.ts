import { Letter, Word } from "types";

const winningMap: Record<Letter["isWinning"], string> = {
  empty: "⬜️",
  losing: "⬜️",
  winning: "🟩",
  partialWinning: "🟨",
  undetermined: "⬜️",
};

export function exportToText(words: Word[]) {
  const header = `ווערטער בע"מ`;
  const subHeader = `נסיון ${words.length} מתוך 6`;
  const body = words
    .map((word) => word.map(({ isWinning }) => winningMap[isWinning]).join(""))
    .join("\n");

  const footer = `שחק עכשיו ${location.toString()}`;
  return `${header}\n${subHeader}\n\n${body}\n\n${footer}`;
}
