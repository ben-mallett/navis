'use server';

import { Role } from '@prisma/client';
import { UserT } from '@/components/tables/UserTable';
import { RegisterFormData } from '@/components/forms/RegisterForm';
import { hashPassword, checkPassword } from '../auth';
import prisma from '../prisma';
import { createSession, revokeSession } from '../session';
import { LoginFormData } from '@/components/forms/LoginForm';
import { DiagnosticReturn, verifyAdmin } from '../utils';

/**
 * Creates a user from the given registration information and adds a session
 *
 * @param {RegisterFormData} formData data containing user name, email, and password
 * @returns {Promise<DiagnosticReturn>} data and error information
 */
export async function createUser(
    formData: RegisterFormData
): Promise<DiagnosticReturn> {
    let user = undefined;

    try {
        const { name, email, password } = formData;

        const hashed = hashPassword(password, 10);

        user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashed,
                role:
                    email === process.env.ADMIN_EMAIL ? Role.ADMIN : Role.USER,
            },
        });
    } catch (error: any) {
        return {
            data: undefined,
            error: true,
            message: 'Failed to create user',
        };
    }

    await createSession(user?.id, user?.role);

    return {
        error: false,
        message: 'Successfully created new user',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    };
}

/**
 * Validates login information and adds session on success
 *
 * @param {LoginFormData} formData login form data including email and password
 * @returns {Promise<DiagnosticReturn>} data and error information
 */
export async function loginUser(
    formData: LoginFormData
): Promise<DiagnosticReturn> {
    let user = undefined;

    try {
        const { email, password } = formData;

        user = await prisma.user.findUniqueOrThrow({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error('Invalid Credentials');
        }

        const validPassword = checkPassword(password, user?.password);

        if (!validPassword) {
            throw new Error('Invalid Credentials');
        }
    } catch (error: any) {
        return {
            data: undefined,
            error: true,
            message: error?.message,
        };
    }

    await createSession(user?.id, user?.role);

    return {
        data: user?.name,
        error: false,
        message: `Welcome back ${user?.name}`,
    };
}

/**
 * Logs out a user by revoking their session
 */
export async function logoutUser() {
    await revokeSession();
}

/**
 * Gets a list of all users
 *
 * @param {number} requesterId id of person requesting information
 * @returns {Promise<DiagnosticReturn>} user information
 */
export async function getAllUsers(
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        await verifyAdmin(requesterId);
        const users = await prisma.user.findMany();
        const filteredUsers: UserT[] = users.map((user) => {
            return {
                id: user.id,
                createdAt: user.createdAt,
                name: user.name,
                email: user.email,
                role: user.role,
            };
        });
        return {
            error: false,
            message: 'Successfully got all users',
            data: filteredUsers,
        };
    } catch (error: any) {
        return {
            error: true,
            message: 'Failed to get all users',
            data: undefined,
        };
    }
}

/**
 * Toggles the role of the given user, either ADMIN or USER
 * @param {number} userId id of user to update
 * @param {number} requesterId id of user requesting action
 * @returns {Promise<DiagnosticReturn>} diagnostic info containing update user id
 */
export async function handlePermissionChange(
    userId: number,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        await verifyAdmin(requesterId);
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        const updated = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role: user?.role == Role.ADMIN ? Role.USER : Role.ADMIN,
            },
        });
        return {
            error: false,
            data: updated?.id,
            message: 'Updated user permission',
        };
    } catch (error: any) {
        return {
            error: true,
            message: 'Failed to update user permission',
            data: undefined,
        };
    }
}

/**
 * Deletes the user associated with the given id
 * @param {number} userId id of user to delete
 * @param {number} requesterId id of user requesting action
 * @returns {Promise<DiagnosticReturn>} diagnostic information containing deleted user id
 */
export async function handleUserDelete(
    userId: number,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        await verifyAdmin(requesterId);
        const user = await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        return {
            error: false,
            data: user?.id,
            message: 'Deleted User',
        };
    } catch (error: any) {
        return {
            error: true,
            message: 'Failed to delete user',
            data: undefined,
        };
    }
}

/**
 * Returns a single user from its id
 * @param {number} userId id of user to get
 * @param {numer} requesterId id of user requesting action
 * @returns {Promise<DiagnosticReturn>} user information
 */
export async function getUserById(
    userId: number,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        if (userId !== requesterId) {
            await verifyAdmin(requesterId);
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        return {
            error: false,
            message: 'Retrieved User',
            data: {
                id: user?.id,
                email: user?.email,
                name: user?.name,
                role: user?.role,
                createdAt: user?.createdAt,
            },
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to get user ${userId}`,
            data: undefined,
        };
    }
}
