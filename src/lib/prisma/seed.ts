import { PrismaClient, Role, DataType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.deleteMany({});
    await prisma.device.deleteMany({});
    await prisma.sensorReading.deleteMany({});
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@admin.io',
            password:
                '$2a$10$a3hqUKvcar52yVRRAehVReArIO06rUg48836hEAWwu1z5A6PFD532',
            name: 'Ben',
            role: Role.ADMIN,
            createdAt: new Date(),
            devices: {
                create: generateDevices(),
            },
        },
    });

    const user1 = await prisma.user.create({
        data: {
            email: 'bob@pontus.io',
            password:
                '$2a$10$a3hqUKvcar52yVRRAehVReArIO06rUg48836hEAWwu1z5A6PFD532',
            name: 'Bob',
            role: Role.USER,
            createdAt: new Date(new Date().setDate(new Date().getDate() + 1)),
            devices: {
                create: generateDevices(),
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'alice@pontus.io',
            password:
                '$2a$10$a3hqUKvcar52yVRRAehVReArIO06rUg48836hEAWwu1z5A6PFD532',
            name: 'Alice',
            role: Role.USER,
            createdAt: new Date(new Date().setDate(new Date().getDate() + 2)),
            devices: {
                create: generateDevices(),
            },
        },
    });

    console.log({ adminUser, user1, user2 });
}

function generateDevices() {
    const devices = [];
    for (let i = 1; i <= 3; i++) {
        devices.push({
            name: `Device ${i}`,
            balenaId: `u${i}${5 + i}ky6`,
            ipAddress: `192.168.0.${i}`,
            createdAt: new Date(new Date().setDate(new Date().getDate() + i)),
            sensorReadings: {
                create: generateSensorReadings(),
            },
        });
    }
    return devices;
}

function generateSensorReadings() {
    const sensorReadings = [];
    let currentDate = new Date();
    for (let i = 1; i <= 10; i++) {
        for (const dataType of Object.values(DataType)) {
            sensorReadings.push({
                takenOn: new Date(currentDate),
                dataType: dataType,
                value: Math.random() * 10,
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return sensorReadings;
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
