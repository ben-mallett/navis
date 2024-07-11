import { expect, test, vi } from 'vitest';
import { Role } from '@prisma/client';
import prisma from '../../src/lib/prisma/__mocks__/prisma';
import { verifyAdmin } from '../../src/lib/utils';

vi.mock('../../src/lib/prisma/prisma');

test('verifyAdmin returns with no error when a user is admin', async () => {
    const candidateAdminUser = {
        id: 1,
        email: 'user@xyz.com',
        name: 'Dummy',
        password: '11111111',
        role: Role.ADMIN,
        createdAt: new Date(),
    };
    prisma.user.findUniqueOrThrow.mockResolvedValue(candidateAdminUser);
    // when the user is an admin the function should exit cleanly so just verify it was called
    await verifyAdmin(candidateAdminUser.id);

    // assert that we haven't errored in our test and this code is reachable
    expect(1 == 1);
});

test('verifyAdmin throws an error when the user is not an admin', async () => {
    const candidateUser = {
        id: 1,
        email: 'user@xyz.com',
        name: 'Dummy',
        password: '11111111',
        role: Role.USER,
        createdAt: new Date(),
    };
    prisma.user.findUniqueOrThrow.mockResolvedValue(candidateUser);

    expect(async () => {
        await verifyAdmin(candidateUser.id);
    }).rejects.toThrowError(
        'Requester does not have permissions to perform this operation'
    );
});

test('verifyAdmin throws an error when there is no matching user', async () => {
    const candidateUser = {
        id: 1,
        email: 'user@xyz.com',
        name: 'Dummy',
        password: '11111111',
        role: Role.USER,
        createdAt: new Date(),
    };
    prisma.user.findUniqueOrThrow.mockImplementation(() => {
        throw new Error('Database error');
    });

    expect(async () => {
        await verifyAdmin(candidateUser.id);
    }).rejects.toThrowError('Database error');
});
