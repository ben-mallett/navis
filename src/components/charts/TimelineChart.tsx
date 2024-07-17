'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useEffect, useState } from 'react';
import { verifySession } from '@/lib/session';
import { getReadingsOfAllUserDevicesOfType } from '@/lib/actions/readingsActions';
import { DataType } from '@prisma/client';
import { getRandomColor } from '@/lib/utils';

Chart.register(
    CategoryScale,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
Chart.defaults.borderColor = 'rgb(20 184 166)';
Chart.defaults.color = 'rgb(94 234 212)';

export type TimelineChartProps = {
    datatype: DataType;
    title: string;
    yAxisLabel: string;
};

export default function TimelineChart(props: TimelineChartProps) {
    const { datatype, title, yAxisLabel } = props;
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        async function getReadings() {
            const { id, role } = await verifySession();
            const {
                error,
                message,
                data: deviceReadings,
            } = await getReadingsOfAllUserDevicesOfType(id, datatype, id);
            const data = deviceReadings.map((device: any) => {
                return {
                    deviceName: device.name,
                    readings: device.readings.map((reading: any) => {
                        return {
                            x: new Date(reading.takenOn),
                            y: reading.value,
                        };
                    }),
                };
            });

            setChartData({
                datasets: data.map((line: any) => {
                    return {
                        label: line.deviceName,
                        data: line.readings,
                        fill: false,
                        tension: 0.3,
                        borderColor: getRandomColor(),
                    };
                }),
            });
        }

        getReadings();
    }, []);

    if (!chartData) {
        return (
            <div className="w-full rounded-md border border-teal-300 flex justify-centeer items-center text-center">
                <div className="text-center w-full">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white/10 border border-2 w-full border-teal-300 p-2 rounded-md h-96 flex justify-center items-center">
            <Line
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            title: {
                                display: true,
                                text: 'Taken On',
                            },
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: yAxisLabel,
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
