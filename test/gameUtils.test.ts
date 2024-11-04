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

describe('generateItems', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const MIN: number = 2;
    const MAX: number = 4;
    const defaultLoadout: number = 5;

    it('Should generate random amount of items within a given range', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
        const items = generateItems(MIN, MAX, defaultLoadout);
        expect(items).toBeTypeOf('number');
        expect(items).toBeGreaterThan(MIN);
        expect(items).toBeLessThan(MAX);
    });

    it('Should return the maximum provided number of items (inclusive) at the upper bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.9);
        expect(generateItems(MIN, MAX, defaultLoadout)).toEqual(MAX);
    });

    it('Should return the minimum provided number of items (inclusive) at the lower bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0);
        expect(generateItems(MIN, MAX, defaultLoadout)).toEqual(MIN);
    });

    it('Should always return a different amount of items from the previous result', () => {
        const prevItems: number = MIN;
        vi.spyOn(globalThis.Math, 'random').mockReturnValueOnce(0);
        expect(generateItems(MIN, MAX, defaultLoadout, MIN)).not.toEqual(prevItems);
    });

    it.each([
        { case: 'loadout length <= 6', loadoutLength: 5, expected: MAX },
        { case: 'loadout length <= 6', loadoutLength: 6, expected: MAX },
        { case: 'loadout length > 6', loadoutLength: 7, expected: MAX + 1 },
        { case: 'loadout length > 6', loadoutLength: 8, expected: MAX + 1 }
    ])('Should return $expected items if $case', ({ loadoutLength, expected }) => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.9);
        expect(generateItems(MIN, MAX, loadoutLength)).toEqual(expected);
    });
});
