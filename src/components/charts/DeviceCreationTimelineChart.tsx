'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useEffect, useState } from 'react';
import { getAllDevices } from '@/lib/actions/deviceActions';
import { DeviceT } from '../tables/AdminDeviceTable';
import { verifySession } from '@/lib/session';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
Chart.defaults.borderColor = 'rgb(20 184 166)';
Chart.defaults.color = 'rgb(94 234 212)';

export default function DeviceCreationTimelineChart() {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        async function getDevices() {
            const { id, role } = await verifySession();
            const { error, message, data: devices } = await getAllDevices(id);

            const dataPoints: { [key: string]: number } = {};
            devices?.forEach((device: DeviceT) => {
                const date = new Date(device.createdAt).toLocaleDateString();
                if (!dataPoints[date]) {
                    dataPoints[date] = 0;
                }
                dataPoints[date]++;
            });

            const labels = Object.keys(dataPoints).sort(
                (a, b) => new Date(a).getTime() - new Date(b).getTime()
            );
            const dataValues = labels.map((label) => dataPoints[label]);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Device Creations',
                        data: dataValues,
                        fill: false,
                        borderColor: 'rgb(234 88 12)',
                        tension: 0.1,
                    },
                ],
            });
        }

        getDevices();
    }, []);

    if (!chartData) return <div>Loading...</div>;

    return (
        <div className="bg-white/10 border border-2 w-1/2 border-teal-300 p-2 m-2 rounded-md h-96">
            <Line
                data={chartData}
                options={{
                    scales: {
                        x: {},
                        y: {
                            beginAtZero: true,
                            min: 0,
                            max: 10,
                        },
                    },
                }}
            />
        </div>
    );
}
