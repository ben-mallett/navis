import { PrismaClient } from '@prisma/client';
import { beforeEach, afterAll } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
    mockReset(prisma);
});

afterAll(() => {
    mockReset(prisma);
});

const prisma = mockDeep<PrismaClient>();
export default prisma;
