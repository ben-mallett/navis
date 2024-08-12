import balena from '../balena/balena';
import prisma from '../prisma/prisma';
import { DiagnosticReturn, verifyAdmin } from '../utils';

export async function setDeviceCron(
    deviceId: number,
    cron: string,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        const device = await prisma.device.findUniqueOrThrow({
            where: {
                id: deviceId,
            },
        });
        if (device.userId !== requesterId) {
            await verifyAdmin(requesterId);
        }
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: device.userId,
            },
        });
        if (user.balenaApiKey === null || user.balenaApiKey === undefined) {
            throw new Error(`API key for user ${user.id} not registered`);
        }

        await balena.auth
            .loginWithToken(user.balenaApiKey)
            .then(() =>
                balena.models.device.configVar.set(
                    device.balenaId,
                    'CRON_SCHEDULE',
                    cron
                )
            )
            .finally(() => balena.auth.logout());

        return {
            error: false,
            message: 'Successfully updated Balena cron schedule',
            data: device.id,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to set device schedule: ${error}`,
            data: undefined,
        };
    }
}

export async function setDeviceDatabaseId(
    deviceId: number,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        const device = await prisma.device.findUniqueOrThrow({
            where: {
                id: deviceId,
            },
        });
        if (device.userId !== requesterId) {
            await verifyAdmin(requesterId);
        }
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: device.userId,
            },
        });
        if (user.balenaApiKey === undefined || user.balenaApiKey === null) {
            throw new Error(`API key for user ${user.id} not registered`);
        }

        await balena.auth
            .loginWithToken(user.balenaApiKey)
            .then(() =>
                balena.models.device.configVar.set(
                    device.balenaId,
                    'DATABASE_ID',
                    `${device.id}`
                )
            )
            .finally(() => balena.auth.logout());

        return {
            error: false,
            message: 'Successfully updated Balena device database ID',
            data: device.id,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to set device database ID: ${error}`,
            data: undefined,
        };
    }
}
