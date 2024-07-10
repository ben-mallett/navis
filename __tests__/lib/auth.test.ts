import { checkPassword, hashPassword } from '../../src/lib/auth';
import { expect, test } from 'vitest';

test('hashPassword should return a hashed password', async () => {
    const samplePassword = 'samplePassword';
    const hashed = hashPassword(samplePassword, 10);
    const expected =
        '$2a$10$cUjnyqj6nBHNqfvhpYhu1OCtKcrdkK8kebkAPJXGB9HPLcbECW5VS';

    expect(hashed === expected);
    expect(hashed === samplePassword).toBe(false);
});

test('A password compared to the hashed version of itself should return true', async () => {
    const samplePassword = 'samplePassword';
    const hashed = hashPassword(samplePassword, 10);
    const isSame = checkPassword(hashed, 'samplePassword');

    expect(isSame);
});

test('A hashed password compared to an unmatching unhashed password should return false', async () => {
    const samplePassword = 'samplePassword';
    const hashed = hashPassword(samplePassword, 10);
    const compared = checkPassword(hashed, 'notTheRightPassword');

    expect(compared === false);
});
