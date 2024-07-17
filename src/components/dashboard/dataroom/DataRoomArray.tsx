import TimelineChart from '@/components/charts/TimelineChart';
import { DataType } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';

export async function DataRoomArray() {
    return (
        <div className="grid grid-cols-2 p-10 gap-6 w-full h-[850px] mb-10">
            <TimelineChart
                datatype={DataType.TEMPERATURE}
                title="Temperature"
                yAxisLabel="Temperature (F)"
            />
            <TimelineChart datatype={DataType.PH} title="pH" yAxisLabel="pH" />
            <TimelineChart
                datatype={DataType.ALKALINITY}
                title="Alkalinity"
                yAxisLabel="Alkalinity (dKH)"
            />
            <TimelineChart
                datatype={DataType.CONDUCTIVITY}
                title="Conductivity"
                yAxisLabel="Conductivity"
            />
            <TimelineChart
                datatype={DataType.NITRATES}
                title="Nitrates"
                yAxisLabel="Nitrates (ppm)"
            />
            <TimelineChart
                datatype={DataType.NITRATES}
                title="Nitrites"
                yAxisLabel="Nitrites (ppm)"
            />
            <TimelineChart
                datatype={DataType.AMMONIA}
                title="Ammonia"
                yAxisLabel="Ammonia (ppm)"
            />
        </div>
    );
}
