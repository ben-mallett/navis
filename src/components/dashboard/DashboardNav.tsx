'use server';

import {
    Tv,
    User,
    LineChart,
    UserCog,
    BellDot,
    ServerCog,
    SquareDot,
} from 'lucide-react';
import DashboardNavEntry from './DashboardNavEntry';
import { verifySession } from '@/lib/session';
import { Role } from '@prisma/client';

export default async function DashboardNav() {
    const session = await verifySession();

    return (
        <div className="sticky top-0 flex flex-col items-center justify-start w-[75px] border-r border-teal-300 min-h-screen">
            <DashboardNavEntry
                path="/"
                ChildIcon={
                    <SquareDot color="rgb(94 234 212)" strokeWidth={1.25} />
                }
                tooltipMessage="Home"
            />
            <DashboardNavEntry
                path="/dashboard/account"
                ChildIcon={<User color="rgb(94 234 212)" strokeWidth={1.25} />}
                tooltipMessage="Account Settings"
            />
            <DashboardNavEntry
                path="/dashboard"
                ChildIcon={
                    <LineChart color="rgb(94 234 212)" strokeWidth={1.25} />
                }
                tooltipMessage="View Dashboard"
            />
            <DashboardNavEntry
                path="/dashboard/streaming"
                ChildIcon={<Tv color="rgb(94 234 212)" strokeWidth={1.25} />}
                tooltipMessage="View Streams"
            />
            <DashboardNavEntry
                path="/dashboard/alerting"
                ChildIcon={
                    <BellDot color="rgb(94 234 212)" strokeWidth={1.25} />
                }
                tooltipMessage="Manage Alerting"
            />
            {session?.role !== undefined && session?.role === Role.ADMIN && (
                <DashboardNavEntry
                    path="/dashboard/admin/users"
                    ChildIcon={
                        <UserCog color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="Manage Users"
                />
            )}
            {session?.role !== undefined && session?.role === Role.ADMIN && (
                <DashboardNavEntry
                    path="/dashboard/admin/devices"
                    ChildIcon={
                        <ServerCog color="rgb(94 234 212)" strokeWidth={1.25} />
                    }
                    tooltipMessage="Manage Devices"
                />
            )}
        </div>
    );
}
