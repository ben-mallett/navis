import { expect, test, vi, describe } from 'vitest';
import {
    createUser,
    getAllUsers,
    getUserById,
    handlePermissionChange,
    handleUserDelete,
    loginUser,
} from '../../../src/lib/actions/userActions';
import * as sessionModule from '../../../src/lib/session';
import * as authModule from '../../../src/lib/auth';
import prisma from '../../../src/lib/prisma/__mocks__/prisma';
import { Role, User } from '@prisma/client';
import { logoutUser } from '../../../src/lib/actions/userActions';

vi.mock('../../../src/lib/prisma/prisma');

describe('createUser', () => {
    test('createUser should return the generated user upon success', async () => {
        const newUser = {
            email: 'user@xyz.com',
            name: 'Dummy',
            password: '11111111',
        };
        const createSessionMock = vi
            .spyOn(sessionModule, 'createSession')
            .mockImplementation(async () => {});
        prisma.user.create.mockResolvedValue({
            ...newUser,
            id: 1,
            role: Role.USER,
            createdAt: new Date(),
        });

        const { error, message, data } = await createUser(newUser);
        expect(createSessionMock).toHaveBeenCalled();
        expect(error).toBeFalsy();
        expect(data).toBeDefined();
        expect(data?.id).toEqual(1);

        createSessionMock.mockRestore();
    });

    test('createUser should return an error on creation failures', async () => {
        const newUser = {
            email: 'user@xyz.com',
            name: 'Dummy',
            password: '11111111',
        };
        const createSessionMock = vi
            .spyOn(sessionModule, 'createSession')
            .mockImplementation(async () => {});
        prisma.user.create.mockImplementation(() => {
            throw new Error('Sample error from prisma');
        });

        const { error, message, data } = await createUser(newUser);
        expect(error);
        expect(data).toBeUndefined();
        expect(message).toBe('Failed to create user');
        expect(createSessionMock).not.toHaveBeenCalled();

        createSessionMock.mockRestore();
    });
});

describe('loginUser', () => {
    test('loginUser should login a user correctly given good login info', async () => {
        const loginInfo = {
            email: 'user@xyz.com',
            password: '11111111',
        };
        const createSessionMock = vi
            .spyOn(sessionModule, 'createSession')
            .mockImplementation(async () => {});
        const checkPasswordMock = vi
            .spyOn(authModule, 'checkPassword')
            .mockImplementation((_: string, __: string) => {
                return true;
            });
        prisma.user.findUniqueOrThrow.mockResolvedValue({
            ...loginInfo,
            name: 'sampleUser',
            id: 1,
            role: Role.USER,
            createdAt: new Date(),
        });

        const { error, message, data } = await loginUser(loginInfo);
        expect(!error);
        expect(data).toBeDefined();
        expect(createSessionMock).toHaveBeenCalled();

        createSessionMock.mockRestore();
        checkPasswordMock.mockRestore();
    });

    test('loginUser should fail on invalid login info', async () => {
        const loginInfo = {
            email: 'user@xyz.com',
            password: '11111111',
        };
        const createSessionMock = vi
            .spyOn(sessionModule, 'createSession')
            .mockImplementation(async () => {});
        prisma.user.findUniqueOrThrow.mockImplementation(() => {
            throw new Error('Could not find user');
        });

        const { error, message, data } = await loginUser(loginInfo);
        expect(error);
        expect(data).toBeUndefined();
        expect(createSessionMock).not.toHaveBeenCalled();

        createSessionMock.mockRestore();
    });
});

describe('logoutUser', () => {
    test('logoutUser should call revoke utility', async () => {
        const revokeSessionMock = vi
            .spyOn(sessionModule, 'revokeSession')
            .mockImplementation(async () => {});

        await logoutUser();

        expect(revokeSessionMock).toHaveBeenCalled();

        revokeSessionMock.mockRestore();
    });
});

describe('getAllUsers', () => {
    test('getAllUsers should return all users and only non-sensitive information', async () => {
        const returnedUsers: User[] = [
            {
                id: 1,
                name: 'user1',
                email: 'user1@xyz.com',
                createdAt: new Date(),
                role: Role.ADMIN,
                password: 'shouldNotBeInFinalResult',
            },
            {
                id: 2,
                name: 'user2',
                email: 'user2@xyz.com',
                createdAt: new Date(),
                role: Role.ADMIN,
                password: 'shouldNotBeInFinalResult',
            },
            {
                id: 3,
                name: 'user3',
                email: 'user3@xyz.com',
                createdAt: new Date(),
                role: Role.USER,
                password: 'shouldNotBeInFinalResult',
            },
        ];

        prisma.user.findUniqueOrThrow.mockResolvedValue(returnedUsers[0]);
        prisma.user.findMany.mockResolvedValue(returnedUsers);

        const { error, message, data } = await getAllUsers(returnedUsers[0].id);

        expect(!error);
        expect(data).toHaveLength(3);
        data.forEach((element: any) =>
            expect(element.password).toBeUndefined()
        );
    });

    test('getAllUsers should fail if the requesting user is not an admin', async () => {
        const returnedUsers: User[] = [
            {
                id: 1,
                name: 'user1',
                email: 'user1@xyz.com',
                createdAt: new Date(),
                role: Role.USER,
                password: 'shouldNotBeInFinalResult',
            },
        ];

        prisma.user.findUniqueOrThrow.mockResolvedValue(returnedUsers[0]);
        prisma.user.findMany.mockResolvedValue(returnedUsers);

        const { error, message, data } = await getAllUsers(returnedUsers[0].id);

        expect(error);
        expect(data).toBeUndefined();
        expect(message).toBe('Failed to get all users');
    });

    test('getAllUsers should fail if there is an error finding users', async () => {
        const returnedUsers: User[] = [
            {
                id: 1,
                name: 'user1',
                email: 'user1@xyz.com',
                createdAt: new Date(),
                role: Role.ADMIN,
                password: 'shouldNotBeInFinalResult',
            },
        ];

        prisma.user.findUniqueOrThrow.mockResolvedValue(returnedUsers[0]);
        prisma.user.findMany.mockImplementation(() => {
            throw new Error('Database Error');
        });

        const { error, message, data } = await getAllUsers(returnedUsers[0].id);

        expect(error);
        expect(data).toBeUndefined();
        expect(message).toBe('Failed to get all users');
    });
});

describe('handlePermissionChange', () => {
    test('handlePermissionChange should update a permission to admin if original is user and there is an admin requester', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const changingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow
            .mockResolvedValueOnce(requestingUser)
            .mockResolvedValueOnce(changingUser);

        prisma.user.update.mockResolvedValue({
            ...changingUser,
            role: Role.ADMIN,
        });

        const { error, message, data } = await handlePermissionChange(
            changingUser.id,
            requestingUser.id
        );

        expect(!error);
        expect(message).toBe('Updated user permission');
        expect(data).toBe(changingUser.id);
        expect(prisma.user.update).toHaveBeenCalled();
    });

    test('handlePermissionChange should update a permission to user if original is admin and there is an admin requester', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const changingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow
            .mockResolvedValueOnce(requestingUser)
            .mockResolvedValueOnce(changingUser);

        prisma.user.update.mockResolvedValue({
            ...changingUser,
            role: Role.USER,
        });

        const { error, message, data } = await handlePermissionChange(
            changingUser.id,
            requestingUser.id
        );

        expect(!error);
        expect(message).toBe('Updated user permission');
        expect(data).toBe(changingUser.id);
        expect(prisma.user.update).toHaveBeenCalled();
    });

    test('handlePermissionChange should fail if user cannot be updated', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const changingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow
            .mockResolvedValueOnce(requestingUser)
            .mockResolvedValueOnce(changingUser);

        prisma.user.update.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await handlePermissionChange(
            changingUser.id,
            requestingUser.id
        );

        expect(error);
        expect(message).toBe('Failed to update user permission');
        expect(data).toBeUndefined();
    });

    test('handlePermissionChange should fail if requesting user is not admin', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const changingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow
            .mockResolvedValueOnce(requestingUser)
            .mockResolvedValueOnce(changingUser);

        prisma.user.update.mockResolvedValue({
            ...changingUser,
            role: Role.ADMIN,
        });

        const { error, message, data } = await handlePermissionChange(
            changingUser.id,
            requestingUser.id
        );

        expect(error);
        expect(message).toBe('Failed to update user permission');
        expect(data).toBeUndefined();
        expect(prisma.user.update).not.toHaveBeenCalled();
    });
});

describe('handleUserDelete', () => {
    test('handleUserDelete works when given a valid user and the requester is an admin', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const deletingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(requestingUser);

        prisma.user.delete.mockResolvedValue(deletingUser);

        const { error, message, data } = await handleUserDelete(
            deletingUser.id,
            requestingUser.id
        );

        expect(!error);
        expect(message).toBe('Deleted User');
        expect(data).toBe(deletingUser.id);
        expect(prisma.user.delete).toHaveBeenCalled();
    });

    test('handleUserDelete fails when user cannot be deleted', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const deletingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(requestingUser);

        prisma.user.delete.mockImplementation(() => {
            throw new Error('Database Error');
        });

        const { error, message, data } = await handleUserDelete(
            deletingUser.id,
            requestingUser.id
        );

        expect(error);
        expect(message).toBe('Failed to delete user');
        expect(data).toBeUndefined();
    });

    test('handleUserDelete fails when the requesting user is not an admin', async () => {
        const requestingUser: User = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const deletingUser: User = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(requestingUser);

        prisma.user.delete.mockResolvedValue(deletingUser);

        const { error, message, data } = await handleUserDelete(
            deletingUser.id,
            requestingUser.id
        );

        expect(error);
        expect(message).toBe('Failed to delete user');
        expect(data).toBeUndefined();
        expect(prisma.user.delete).not.toHaveBeenCalled();
    });
});

describe('getUserById', () => {
    test('getUserById gets a user given a valid user id and the user is the requester', async () => {
        const user = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(user);

        const { error, message, data } = await getUserById(user.id, user.id);

        expect(!error);
        expect(message).toBe('Retrieved User');
        expect(data).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            role: user.role,
        });
    });

    test('getUserById gets a user when given a valid user id and the requester is an admin', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const user = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow
            .mockResolvedValueOnce(requester)
            .mockResolvedValueOnce(user);

        const { error, message, data } = await getUserById(
            user.id,
            requester.id
        );

        expect(!error);
        expect(message).toBe('Retrieved User');
        expect(data).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            role: user.role,
        });
    });

    test('getUserById fails when user cannot be found', async () => {
        const user = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockImplementation(() => {
            throw new Error('Database Error');
        });

        const { error, message, data } = await getUserById(user.id, user.id);

        expect(error);
        expect(message).toBe('Failed to get user 2');
        expect(data).toBeUndefined();
    });

    test('getUserById fails when the requester id does not match the user id and is not admin', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const user = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow
            .mockResolvedValueOnce(requester)
            .mockResolvedValueOnce(user);

        const { error, message, data } = await getUserById(
            user.id,
            requester.id
        );

        expect(error);
        expect(message).toBe('Failed to get user 2');
        expect(data).toBeUndefined();
        expect(prisma.user.findUniqueOrThrow).not.toHaveBeenCalledTimes(2);
    });
});
