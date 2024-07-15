import { DataTable } from '../ui/data-table';
import { verifySession } from '@/lib/session';
import { getAllDevices } from '@/lib/actions/deviceActions';
import { columns } from './columnDefs/adminDeviceTableColumnDefs';

export default async function AdminDeviceTable() {
    const { id, role } = await verifySession();
    const { error, message, data } = await getAllDevices(id);
    return error ? (
        <div>Failed to load devices: {message}</div>
    ) : (
        <div className="w-full ">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
