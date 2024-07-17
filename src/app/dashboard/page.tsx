'use server';

import { DataRoomArray } from '@/components/dashboard/dataroom/DataRoomArray';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function Dashboard() {
    return (
        <ScrollArea className="flex flex-col justify-start items-start p-10 w-full h-[850px]">
            <h2 className="mb-10">Data Room</h2>
            <DataRoomArray />
        </ScrollArea>
    );
}
