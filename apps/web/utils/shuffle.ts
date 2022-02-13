export function shuffle<T extends any[]>(array: T, seed?: string): T {
    const clone = array.slice() as T;
    let random = seed === undefined ? Math.random : getRandomNumberGenerator(seed);
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        const temp = clone[i];
        clone[i] = clone[j];
        clone[j] = temp;
    }
    return clone;
}

export function getRandomNumberGenerator(seed: string): () => number {
    let seedValue = 0;
    for (let i = 0; i < seed.length; i++) {
        seedValue += seed.charCodeAt(i);
    }
    return () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
    };
}