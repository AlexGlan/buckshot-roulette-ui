// @vitest-environment node
import generateRandomID from "../../src/utils/generateRandomID";

describe('generateRandomID', () => {
    it('Should generate unique alphanumeric id of specified length', () => {
        const idLength: number = 16;
        const uid = generateRandomID(idLength);
        expect(uid).toBeTypeOf('string');
        expect(uid.length).toBe(idLength);
    });

    it('Should handle empty arguments', () => {
        const uid = generateRandomID();
        expect(uid).toBeTypeOf('string');
        expect(uid.length).toBeGreaterThan(5);
    });

    it('Should handle decimal arguments', () => {
        const decimalLength: number = 15.6372;
        const uid = generateRandomID(decimalLength);
        expect(uid.length).toBe(Math.ceil(decimalLength));
    });

    it('Should handle wrong argument types', () => {
        // @ts-expect-error
        const stringArg = generateRandomID('16');
        // @ts-expect-error
        const arrArg = generateRandomID([]);
        // @ts-expect-error
        const objArg = generateRandomID({});
        // @ts-expect-error
        const nullArg = generateRandomID(null);

        expect(stringArg.length).toBeGreaterThan(5);
        expect(arrArg.length).toBeGreaterThan(5);
        expect(objArg.length).toBeGreaterThan(5);
        expect(nullArg.length).toBeGreaterThan(5);
        expect(stringArg.length === arrArg.length).toBe(true);
        expect(stringArg.length === objArg.length).toBe(true);
        expect(stringArg.length === nullArg.length).toBe(true);
    });
});
