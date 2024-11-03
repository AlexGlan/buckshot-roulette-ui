// @vitest-environment node
import {
    generateLives,
    generateItems,
    generateShells,
    usePhone
} from "../src/utils/gameUtils";

describe('generateLives', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const MIN: number = 2;
    const MAX: number = 5;

    it('Should generate random amount of lives within a given range', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
        const lives = generateLives(MIN, MAX);
        expect(lives).toBeTypeOf('number');
        expect(lives).toBeGreaterThan(MIN);
        expect(lives).toBeLessThan(MAX);
    });

    it('Should return the maximum provided number of lives (inclusive) at the upper bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.9);
        const lives = generateLives(MIN, MAX);
        expect(lives).toBeTypeOf('number');
        expect(lives).toEqual(MAX);
    });

    it('Should return the minimum provided number of lives (inclusive) at the lower bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0);
        const lives = generateLives(MIN, MAX);
        expect(lives).toBeTypeOf('number');
        expect(lives).toEqual(MIN);
    });
});
