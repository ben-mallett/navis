'use server';

import { Role } from '@prisma/client';
import { DataTable } from '../ui/data-table';
import { verifySession } from '@/lib/session';
import { getAllUsers } from '@/lib/actions/userActions';
import { columns } from './columnDefs/adminUserTableColumnDefs';

export default async function AdminUserTable() {
    const { id, role } = await verifySession();
    const { error, message, data } = await getAllUsers(id);
    return error || role !== Role.ADMIN ? (
        <div>Failed to load devices: {message}</div>
    ) : (
        <div className="w-full ">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
