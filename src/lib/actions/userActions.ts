'use server';

import { Role } from '@prisma/client';
import { UserT } from '@/components/tables/UserTable';
import { RegisterFormData } from '@/components/forms/RegisterForm';
import { hashPassword, checkPassword } from '../auth';
import prisma from '../prisma';
import { createSession, revokeSession } from '../session';
import { LoginFormData } from '@/components/forms/LoginForm';

export async function createUser(formData: RegisterFormData) {
    let user = undefined;

    try {
        const { name, email, password } = formData;

        const hashed = await hashPassword(password, 10);

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
        console.log(error);
        return {
            data: undefined,
            error: true,
            message: error?.message,
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
        },
    };
}

export async function loginUser(formData: LoginFormData) {
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

export async function logoutUser() {
    await revokeSession();
}

export async function getAllUsers(): Promise<UserT[]> {
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
    return filteredUsers;
}

export async function handlePermissionChange(userId: number) {
    try {
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
        };
    }
}

export async function handleUserDelete(userId: number) {
    try {
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
        };
    }
}

export async function getUserById(userId: number) {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        return {
            error: false,
            message: 'Got User',
            data: {
                id: user?.id,
                email: user?.email,
                name: user?.name,
                role: user?.role,
            },
        };
    } catch (error: any) {
        return {
            error: true,
            message: error,
        };
    }
}
