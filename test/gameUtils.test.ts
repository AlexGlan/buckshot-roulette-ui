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
        expect(generateLives(MIN, MAX)).toEqual(MAX);
    });

    it('Should return the minimum provided number of lives (inclusive) at the lower bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0);
        expect(generateLives(MIN, MAX)).toEqual(MIN);
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

describe('generateShells', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const MIN: number = 2;
    const MAX: number = 8;

    it('Should generate a random loadout with live and blank rounds', () => {
        const loadout = generateShells(MIN, MAX);
        let liveRounds: number = 0;
        let blankRounds: number = 0;
        for (const shell of loadout) {
            if (shell.type === 'live') {
                liveRounds++;
            } else {
                blankRounds++;
            }
        }
        expect(liveRounds).toBeGreaterThan(0);
        expect(blankRounds).toBeGreaterThan(0);
    });

    it('Should generate random loadout length within a given range', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
        const loadout = generateShells(MIN, MAX);        
        expect(loadout.length).toBeGreaterThan(MIN);
        expect(loadout.length).toBeLessThan(MAX);
    });

    it('Should generate loadout with maximum provided length (inclusive) at the upper bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.9);
        expect(generateShells(MIN, MAX).length).toEqual(MAX);
    });

    it('Should generate loadout with minimum provided length (inclusive) at the lower bound', () => {
        vi.spyOn(globalThis.Math, 'random').mockReturnValue(0);
        expect(generateShells(MIN, MAX).length).toEqual(MIN);
    });

    it('Should always generate a different loadout from the previous result if previous length is provided', () => {
        const prevLoadoutLength: number = MIN;
        vi.spyOn(globalThis.Math, 'random').mockReturnValueOnce(0);
        const newLoadoutLength: number = generateShells(MIN, MAX, prevLoadoutLength).length
        expect(newLoadoutLength).not.toEqual(prevLoadoutLength);
    });

    it('Should shuffle shells in a loadout to simulate inserting them in a hidden sequence ', () => {
        // Create two loadouts with the same number and type of shells
        vi.spyOn(globalThis.Math, 'random').mockReturnValueOnce(0.9);
        const firstLoadout = generateShells(MIN, MAX);
        vi.spyOn(globalThis.Math, 'random').mockReturnValueOnce(0.9);
        const secondLoadout = generateShells(MIN, MAX);
        
        let isShellOrderDifferent: boolean = false;
        for (let i = 0; i < firstLoadout.length; i++) {
            if (firstLoadout[i].type !== secondLoadout[i].type) {
                isShellOrderDifferent = true;
                break;
            }
        }
        // Even though the shells in both loadouts are the same, the order should be different
        expect(isShellOrderDifferent).toBe(true);
    });
});
