import { expect, test, vi } from 'vitest';
import { createUser } from '../../../src/lib/actions/userActions';
import * as createSessionModule from '../../../src/lib/session';
import prisma from '../../../src/lib/__mocks__/prisma';
import { Role } from '@prisma/client';

vi.mock('../../../src/lib/prisma');

test('createUser should return the generated user', async () => {
    const newUser = {
        email: 'user@pxyz.com',
        name: 'Dummy',
        password: '11111111',
    };
    const createSessionMock = vi
        .spyOn(createSessionModule, 'createSession')
        .mockImplementation(async () => {});
    prisma.user.create.mockResolvedValue({
        ...newUser,
        id: 1,
        role: Role.USER,
        createdAt: new Date(),
    });

    const { error, message, data } = await createUser(newUser);
    console.log(message);
    expect(error).toBeFalsy();
    expect(data).toBeDefined();
    expect(data?.id).toEqual(1);
});
