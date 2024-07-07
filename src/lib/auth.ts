import bcrypt from 'bcryptjs';

export async function hashPassword(
    password: string,
    saltRounds: number
): Promise<string> {
    return await bcrypt.hashSync(password, saltRounds);
}

export function checkPassword(candidate: string, actual: string): boolean {
    return bcrypt.compareSync(candidate, actual);
}
