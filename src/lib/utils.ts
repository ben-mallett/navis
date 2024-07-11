import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Role } from '@prisma/client';
import prisma from './prisma/prisma';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Type of server action return
 */
export type DiagnosticReturn = {
    error: boolean;
    message: string;
    data: any | undefined;
};

/**
 * Exits cleanly if the given user is an admin, throws otherwise
 * @param {number} id id of user to check
 */
export async function verifyAdmin(id: number) {
    const requester = await prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    if (requester.role !== Role.ADMIN) {
        throw new Error(
            'Requester does not have permissions to perform this operation'
        );
    }
}
