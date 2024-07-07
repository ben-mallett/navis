'use server';

import prisma from '../prisma';

export async function getAllDevices() {
    try {
        const devices = await prisma.device.findMany();
        return {
            error: false,
            data: devices,
            message: 'Successfully retrieved all devices.',
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to retrieve all devices: ${error}`,
        };
    }
}

export async function getDevicesOfUser(id: number) {
    try {
        const devices = await prisma.device.findMany({
            where: {
                userId: id,
            },
        });
        return {
            error: false,
            data: devices,
            message: `Successfully retrieved devices from user ${id}`,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to retrieve devices from user ${id}: ${error}`,
        };
    }
}

export async function updateDeviceIp(id: number, ip: string) {
    try {
        const updated = await prisma.device.update({
            where: {
                id: id,
            },
            data: {
                ipAddress: ip,
            },
        });
        return {
            error: false,
            data: updated,
            message: `Successfully updated device ${id} to have IP: ${ip}`,
        };
    } catch (error: any) {
        return {
            error: false,
            message: `Failed to update device ip: ${error}`,
        };
    }
}

export async function deleteDevice(id: number) {
    try {
        const deleted = await prisma.device.delete({
            where: {
                id: id,
            },
        });
        return {
            error: false,
            data: deleted,
            message: `Successfully deleted device: ${id}`,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to delete device ${id}: ${error}`,
        };
    }
}
