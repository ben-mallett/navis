import { getDevicesOfUser } from '@/lib/actions/deviceActions';
import { verifySession } from '@/lib/session';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamGuide } from '@/components/dashboard/streaming/StreamGuide';

export default async function DashboardStreamingPage() {
    const { id, role } = await verifySession();
    const { error, message, data: devices } = await getDevicesOfUser(id, id);
    return (
        <ScrollArea className="flex flex-col justify-start items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Streaming Center</h2>
            <StreamGuide devices={devices} />
        </ScrollArea>
    );
}
