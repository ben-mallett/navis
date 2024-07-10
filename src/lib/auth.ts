import bcrypt from 'bcryptjs';

/**
 * Hashes a password
 * @param {string} password password to hash
 * @param {number} saltRounds number of rounds to salt with
 * @returns {string} a hashed password
 */
export function hashPassword(password: string, saltRounds: number): string {
    return bcrypt.hashSync(password, saltRounds);
}

/**
 * Compares a candidate string with a hashed password and returns whether they match
 * @param {string} candidate candidate string for comparison
 * @param {string} actual actual hashed password for comparison
 * @returns {boolean} true if the passwords match, false if not
 */
export function checkPassword(candidate: string, actual: string): boolean {
    return bcrypt.compareSync(candidate, actual);
}
