'use client';

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAllUsers } from '@/lib/actions/userActions';
import { useEffect, useState } from 'react';
import { UserT } from '../tables/UserTable';

Chart.register(ArcElement, Tooltip, Legend);
Chart.defaults.borderColor = 'rgb(20 184 166)';
Chart.defaults.color = 'rgb(94 234 212)';

export default function RoleDistributionChart() {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        async function getUsers() {
            const users: UserT[] = await getAllUsers();

            const roleCounts: { [key: string]: number } = {};
            users.forEach((user: { role: string }) => {
                if (!roleCounts[user.role]) {
                    roleCounts[user.role] = 0;
                }
                roleCounts[user.role]++;
            });

            setChartData({
                labels: Object.keys(roleCounts),
                datasets: [
                    {
                        label: 'User Roles',
                        data: Object.values(roleCounts),
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }

        getUsers();
    }, [getAllUsers]);

    if (!chartData) return <div>Loading...</div>;

    return (
        <div className="bg-white/10 border border-2 w-1/2 border-teal-300 p-2 m-2 rounded-md h-96 flex justify-center items-center">
            <Pie
                data={chartData}
                options={{
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}`;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
