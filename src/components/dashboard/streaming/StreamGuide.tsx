'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';

export function StreamGuide(props: any) {
    const { devices } = props;
    return (
        <div className="grid grid-cols-2 gap-6 w-full h-full p-10">
            {devices.map((device: any, i: number) => {
                return (
                    <div
                        key={i}
                        className="w-full h-[450px] rounded-md bg-white/20 border border-teal-300 text-teal-300 flex flex-col items-center justify-between p-2"
                    >
                        <h4 className="m-2">{device.name}</h4>
                        <Button
                            variant="outline"
                            className="bg-white/30 border-teal-300 text-teal-900"
                            onClick={() => console.log('so humble')}
                        >
                            Connect
                        </Button>
                        <h4 className="m-2">{device.ipAddress}</h4>
                    </div>
                );
            })}
        </div>
    );
}
