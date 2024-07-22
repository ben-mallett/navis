'use server';

import prisma from '../prisma/prisma';
import { DiagnosticReturn, verifyAdmin } from '../utils';
import { DataType } from '@prisma/client';

/**
 * Gets all sensor readings associated with a given user
 *
 * @param userId id of user to get readings from
 * @param requesterId id of requesting user
 */
export async function getReadingsOfAllUserDevicesOfType(
    userId: number,
    type: DataType,
    requesterId: number
): Promise<DiagnosticReturn> {
    try {
        if (requesterId !== userId) {
            verifyAdmin(requesterId);
        }
        const userWithReadings = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include: {
                devices: {
                    include: {
                        sensorReadings: {
                            where: {
                                dataType: type,
                            },
                        },
                    },
                },
            },
        });
        const readings = userWithReadings.devices.map((device) => {
            return {
                name: device.name,
                readings: device.sensorReadings,
            };
        });
        return {
            error: false,
            message: 'Got readings from user',
            data: readings,
        };
    } catch (error: any) {
        return {
            error: true,
            message: 'Failed to get sensor readings associated with user.',
            data: undefined,
        };
    }
}
