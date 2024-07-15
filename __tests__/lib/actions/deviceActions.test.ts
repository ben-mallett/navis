import { expect, test, vi, describe } from 'vitest';
import { Role, Device } from '@prisma/client';
import prisma from '../../../src/lib/prisma/__mocks__/prisma';
import {
    createDevice,
    deleteDevice,
    getAllDevices,
    getDevicesOfUser,
    privelegedDeleteDevice,
    updateDeviceIp,
} from '../../../src/lib/actions/deviceActions';

vi.mock('../../../src/lib/prisma/prisma');

describe('createDevice', () => {
    test('createDevice succeeds when given valid device information and the owning user matches the requesting user', async () => {
        const owner = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: owner.id,
        };
        const formData = {
            name: device.name,
            balenaId: device.balenaId,
            ipAddress: device.ipAddress,
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(owner);
        prisma.device.create.mockResolvedValue(device);

        const { error, message, data } = await createDevice(
            owner.id,
            formData,
            owner.id
        );

        expect(!error);
        expect(message).toBe('Successfully created new device');
        expect(data).toStrictEqual(device);
    });

    test('createDevice succeeds when given valid device information and the owning user user does not match the requesting user but the requesting user is an admin', async () => {
        const admin = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const owner = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: owner.id,
        };
        const formData = {
            name: device.name,
            balenaId: device.balenaId,
            ipAddress: device.ipAddress,
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(admin);
        prisma.device.create.mockResolvedValue(device);

        const { error, message, data } = await createDevice(
            owner.id,
            formData,
            admin.id
        );

        expect(!error);
        expect(message).toBe('Successfully created new device');
        expect(data).toStrictEqual(device);
    });

    test('createDevice fails when given valid information but a non-admin user who is not the owning user is the requesting user', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const owner = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: owner.id,
        };
        const formData = {
            name: device.name,
            balenaId: device.balenaId,
            ipAddress: device.ipAddress,
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);

        const { error, message, data } = await createDevice(
            owner.id,
            formData,
            requester.id
        );

        expect(error);
        expect(message).toBe('Failed to create device');
        expect(data).toBeUndefined();
        expect(prisma.device.create).not.toHaveBeenCalled();
    });

    test('createDevice fails when given invalid information for creation', async () => {
        const owner = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: owner.id,
        };
        const formData = {
            name: device.name,
            balenaId: device.balenaId,
            ipAddress: device.ipAddress,
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(owner);
        prisma.device.create.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await createDevice(
            owner.id,
            formData,
            owner.id
        );

        expect(error);
        expect(message).toBe('Failed to create device');
        expect(data).toBeUndefined();
    });
});

describe('getAllDevices', () => {
    test('getAllDevices succeeds when devices are found and the requester is an admin', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const devices = [
            {
                id: 1,
                name: 'sampleDevice',
                balenaId: 'uuuuuu',
                ipAddress: '192.168.1.1',
                userId: requester.id,
            },
        ];

        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.findMany.mockResolvedValue(devices);

        const { error, message, data } = await getAllDevices(requester.id);

        expect(!error);
        expect(message).toBe('Successfully retrieved all devices.');
        expect(data).toHaveLength(1);
        expect(data[0].id).toBe(1);
    });

    test('getAllDevices succeeds when no devices are found and the requester is an admin', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };
        const devices: Device[] = [];

        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.findMany.mockResolvedValue(devices);

        const { error, message, data } = await getAllDevices(requester.id);

        expect(!error);
        expect(message).toBe('Successfully retrieved all devices.');
        expect(data).toHaveLength(0);
    });

    test('getAllDevices fails when the requester is not an admin', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const devices: Device[] = [];

        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.findMany.mockResolvedValue(devices);

        const { error, message, data } = await getAllDevices(requester.id);

        expect(error);
        expect(message).toBe('Failed to retrieve all devices');
        expect(data).toBeUndefined();
        expect(prisma.device.findMany).not.toHaveBeenCalled();
    });

    test('getAllDevices fails on database error', async () => {
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const devices: Device[] = [];

        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.findMany.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await getAllDevices(requester.id);

        expect(error);
        expect(message).toBe('Failed to retrieve all devices');
        expect(data).toBeUndefined();
    });
});

describe('getDevicesOfUser', () => {
    test('getDevicesOfUser succeeds when given a valid user id and the requester is the requested user', async () => {
        const user = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findMany.mockResolvedValue([]);

        const { error, message, data } = await getDevicesOfUser(
            user.id,
            user.id
        );

        expect(!error);
        expect(message).toBe('Successfully retrieved devices from user 1');
        expect(data).toHaveLength(0);
    });

    test('getDevicesOfUser succeeds when given a valid user id and the requester is an admin', async () => {
        const user = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const admin = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(admin);
        prisma.device.findMany.mockResolvedValue([]);

        const { error, message, data } = await getDevicesOfUser(
            user.id,
            admin.id
        );

        expect(!error);
        expect(message).toBe('Successfully retrieved devices from user 1');
        expect(data).toHaveLength(0);
    });

    test('getDevicesOfUser fails when requester is not owner of devices or admin', async () => {
        const user = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const admin = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(admin);
        prisma.device.findMany.mockResolvedValue([]);

        const { error, message, data } = await getDevicesOfUser(
            user.id,
            admin.id
        );

        expect(error);
        expect(message).toBe('Failed to retrieve devices from user 1');
        expect(data).toBeUndefined();
        expect(prisma.device.findMany).not.toHaveBeenCalled();
    });

    test('getDevicesOfUser fails on database error', async () => {
        const user = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };
        const admin = {
            id: 2,
            name: 'user2',
            email: 'user2@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };

        prisma.user.findUniqueOrThrow.mockResolvedValue(admin);
        prisma.device.findMany.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await getDevicesOfUser(
            user.id,
            admin.id
        );

        expect(error);
        expect(message).toBe('Failed to retrieve devices from user 1');
        expect(data).toBeUndefined();
    });
});

describe('updateDeviceIp', () => {
    test('updateDeviceIp successfully updates IP when requester owns the device', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };
        const updatedDevice = {
            ...device,
            ipAddress: '192.168.1.2',
        };
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.update.mockResolvedValue(updatedDevice);

        const { error, message, data } = await updateDeviceIp(
            device.id,
            '192.168.1.2',
            requester.id
        );
        expect(!error);
        expect(message).toBe(
            'Successfully updated device 1 to have IP: 192.168.1.2'
        );
        expect(data).toStrictEqual(updatedDevice);
    });

    test('updateDeviceIp succeeds when requester is an admin', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };
        const updatedDevice = {
            ...device,
            ipAddress: '192.168.1.2',
        };
        const requester = {
            id: 2,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.update.mockResolvedValue(updatedDevice);

        const { error, message, data } = await updateDeviceIp(
            device.id,
            '192.168.1.2',
            requester.id
        );
        expect(!error);
        expect(message).toBe(
            'Successfully updated device 1 to have IP: 192.168.1.2'
        );
        expect(data).toStrictEqual(updatedDevice);
    });

    test('updateDeviceIp fails when requester is not device owner or admin', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };
        const updatedDevice = {
            ...device,
            ipAddress: '192.168.1.2',
        };
        const requester = {
            id: 2,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.update.mockResolvedValue(updatedDevice);

        const { error, message, data } = await updateDeviceIp(
            device.id,
            '192.168.1.2',
            requester.id
        );
        expect(error);
        expect(message).toBe('Failed to update device IP');
        expect(data).toBeUndefined();
        expect(prisma.device.update).not.toHaveBeenCalled();
    });

    test('updateDeviceIp fails when update fails', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };
        const updatedDevice = {
            ...device,
            ipAddress: '192.168.1.2',
        };
        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.update.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await updateDeviceIp(
            device.id,
            '192.168.1.2',
            requester.id
        );
        expect(error);
        expect(message).toBe('Failed to update device IP');
        expect(data).toBeUndefined();
    });
});

describe('deleteDevice', () => {
    test('deleteDevice succeeds when given a valid device ID and the requester owns the device', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };

        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.delete.mockResolvedValue(device);

        const { error, message, data } = await deleteDevice(
            device.id,
            requester.id
        );

        expect(!error);
        expect(message).toBe('Successfully deleted device: 1');
        expect(data.id).toBe(1);
    });

    test('deleteDevice succeeds when the requester is an admin', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };

        const requester = {
            id: 2,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.ADMIN,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.delete.mockResolvedValue(device);

        const { error, message, data } = await deleteDevice(
            device.id,
            requester.id
        );

        expect(!error);
        expect(message).toBe('Successfully deleted device: 1');
        expect(data.id).toBe(1);
    });

    test('deleteDevice fails when the requester does not own the device and is not an admin', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };

        const requester = {
            id: 2,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.delete.mockResolvedValue(device);

        const { error, message, data } = await deleteDevice(
            device.id,
            requester.id
        );

        expect(error);
        expect(message).toBe('Failed to delete device 1');
        expect(data).toBeUndefined();
        expect(prisma.device.delete).not.toHaveBeenCalled();
    });

    test('deleteDevice fails on failure to delete device', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };

        const requester = {
            id: 1,
            name: 'user1',
            email: 'user1@xyz.com',
            createdAt: new Date(),
            role: Role.USER,
            password: 'sample',
        };

        prisma.device.findUniqueOrThrow.mockResolvedValue(device);
        prisma.user.findUniqueOrThrow.mockResolvedValue(requester);
        prisma.device.delete.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await deleteDevice(
            device.id,
            requester.id
        );

        expect(error);
        expect(message).toBe('Failed to delete device 1');
        expect(data).toBeUndefined();
    });
});

describe('privelegedDeleteDevice', () => {
    test('privelegedDeleteDevice succeeds when given a valid device ID', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
            createdAt: new Date(),
        };
        prisma.device.delete.mockResolvedValue(device);

        const { error, message, data } = await privelegedDeleteDevice(
            device.id
        );

        expect(!error);
        expect(message).toBe('Successfully deleted device: 1');
        expect(data.id).toBe(1);
    });

    test('privelegedDeleteDevice fails on failure to delete device in database', async () => {
        const device = {
            id: 1,
            name: 'sampleDevice',
            balenaId: 'uuuuuu',
            ipAddress: '192.168.1.1',
            userId: 1,
        };

        prisma.device.delete.mockImplementation(() => {
            throw new Error('Database error');
        });

        const { error, message, data } = await privelegedDeleteDevice(
            device.id
        );

        expect(error);
        expect(message).toBe('Failed to delete device 1');
        expect(data).toBeUndefined();
    });
});
