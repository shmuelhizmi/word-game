export interface Letter {
    letter?: string;
    isWinning: "winning" | "losing" | "partialWinning" | "undetermined" | "empty";
}

export type Word = Letter[];