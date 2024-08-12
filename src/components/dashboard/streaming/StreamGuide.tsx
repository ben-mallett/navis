'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';
import { DeviceT } from '@/components/tables/columnDefs/adminDeviceTableColumnDefs';
import VideoStream from './VideoStream';

export type StreamGuideProps = {
    devices: DeviceT[];
};
export function StreamGuide(props: any) {
    const { devices } = props;
    const initialConnections = devices.reduce((acc: any, device: DeviceT) => {
        acc[device.ipAddress] = false;
        return acc;
    }, {});

    const [connections, setConnections] = useState<{ [key: string]: boolean }>(
        initialConnections
    );

    return (
        <div className="grid grid-cols-2 gap-6 w-full h-full p-10">
            {devices.map((device: DeviceT, i: number) => {
                return (
                    <div
                        key={i}
                        className="w-full h-[450px] rounded-md bg-white/20 border border-teal-300 text-teal-300 flex flex-col items-center justify-between p-2"
                    >
                        <h4 className="m-2">{device.name}</h4>
                        {!connections[device.ipAddress] && (
                            <Button
                                variant="outline"
                                className="bg-white/30 border-teal-300 text-teal-900"
                                onClick={() => {
                                    setConnections((connections) => {
                                        const newConnections = {
                                            ...connections,
                                        };
                                        if (connections[device.ipAddress]) {
                                            newConnections[device.ipAddress] =
                                                false;
                                        } else {
                                            newConnections[device.ipAddress] =
                                                true;
                                        }
                                        return newConnections;
                                    });
                                }}
                            >
                                Connect
                            </Button>
                        )}
                        {connections[device.ipAddress] && (
                            <VideoStream deviceIP={device.ipAddress} />
                        )}
                        <h4 className="m-2">{device.ipAddress}</h4>
                    </div>
                );
            })}
        </div>
    );
}
