'use server';

import prisma from '../prisma/prisma';
import { DeviceT } from '@/components/tables/columnDefs/adminDeviceTableColumnDefs';
import { CreateDeviceFormData } from '@/components/forms/AddDeviceForm';
import { DiagnosticReturn, verifyAdmin } from '../utils';

/**
 * Creates a device from the given form
 * @param {number} owningId user id who owns the device
 * @param {CreateDeviceFormData} formData data containing information of device
 * @returns {Promise<DiagnosticReturn>}
 */
export async function createDevice(
    owningId: number,
    formData: CreateDeviceFormData,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        if (owningId !== requesterId) {
            await verifyAdmin(requesterId);
        }
        const newDevice = await prisma.device.create({
            data: {
                name: formData.name,
                balenaId: formData.balenaId,
                ipAddress: formData.ipAddress,
                userId: owningId,
            },
        });
        return {
            error: false,
            message: 'Successfully created new device',
            data: newDevice,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to create device`,
            data: undefined,
        };
    }
}

/**
 * Gets a list of all devices
 * @param {number} requesterId id of user who requested the action
 * @returns {Promise<DiagnosticReturn>}
 */
export async function getAllDevices(
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        await verifyAdmin(requesterId);
        const devices = await prisma.device.findMany();
        return {
            error: false,
            data: devices,
            message: 'Successfully retrieved all devices.',
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to retrieve all devices`,
            data: undefined,
        };
    }
}

/**
 * Gets devices of the given user
 *
 * @param {number} userId id of user to get devices of
 * @param {number} requesterId id of user requesting action
 * @returns {Promise<DiagnosticReturn>}
 */
export async function getDevicesOfUser(
    userId: number,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        if (requesterId !== userId) {
            await verifyAdmin(requesterId);
        }
        const devices: DeviceT[] = await prisma.device.findMany({
            where: {
                userId: userId,
            },
        });
        return {
            error: false,
            data: devices,
            message: `Successfully retrieved devices from user ${userId}`,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to retrieve devices from user ${userId}`,
            data: undefined,
        };
    }
}

/**
 * Updates the given device's ip to the given IP
 * @param {number} deviceId id of device to update
 * @param {string} ip ip address to update with
 * @param {number} requesterId id of user requesting action
 * @returns {Promise<DiagnosticReturn>}
 */
export async function updateDeviceIp(
    deviceId: number,
    ip: string,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        const deviceToUpdate = await prisma.device.findUniqueOrThrow({
            where: {
                id: deviceId,
            },
        });
        if (deviceToUpdate.userId !== requesterId) {
            await verifyAdmin(requesterId);
        }
        const updated = await prisma.device.update({
            where: {
                id: deviceId,
            },
            data: {
                ipAddress: ip,
            },
        });
        return {
            error: false,
            data: updated,
            message: `Successfully updated device ${deviceId} to have IP: ${ip}`,
        };
    } catch (error: any) {
        return {
            error: false,
            message: `Failed to update device IP`,
            data: undefined,
        };
    }
}

/**
 * Deletes the device with the given id
 * @param {number} deviceId id of device to delete
 * @param {number} requesterId id of user requesting action
 * @returns {DiagnosticReturn}
 */
export async function deleteDevice(
    deviceId: number,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        const deviceToDelete = await prisma.device.findUniqueOrThrow({
            where: {
                id: deviceId,
            },
        });
        if (deviceToDelete.userId !== requesterId) {
            await verifyAdmin(requesterId);
        }
        const deleted = await prisma.device.delete({
            where: {
                id: deviceId,
            },
        });

        return {
            error: false,
            data: deleted,
            message: `Successfully deleted device: ${deviceId}`,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to delete device ${deviceId}`,
            data: undefined,
        };
    }
}

/**
 * Deletes the device with the given id. To be called in priveleged contexts
 * @param {number} deviceId id of device to delete
 * @returns {DiagnosticReturn}
 */
export async function privelegedDeleteDevice(
    deviceId: number
): Promise<DiagnosticReturn> {
    try {
        const deleted = await prisma.device.delete({
            where: {
                id: deviceId,
            },
        });

        return {
            error: false,
            data: deleted,
            message: `Successfully deleted device: ${deviceId}`,
        };
    } catch (error: any) {
        return {
            error: true,
            message: `Failed to delete device ${deviceId}`,
            data: undefined,
        };
    }
}
