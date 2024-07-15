import { DataTable } from '../ui/data-table';
import { verifySession } from '@/lib/session';
import { getDevicesOfUser } from '@/lib/actions/deviceActions';
import { columns } from './columnDefs/userDeviceTableColumnDefs';

export default async function UserDeviceTable() {
    const { id, role } = await verifySession();
    const { error, message, data } = await getDevicesOfUser(id, id);
    return error ? (
        <div>Failed to load devices: {message}</div>
    ) : (
        <div className="w-full ">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
