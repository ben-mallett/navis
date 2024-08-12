'use client';

import { useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { setDeviceCron } from '@/lib/actions/balenaActions';

export type CronSetterProps = {
    balenaId: string;
    initialValue: string;
};

export function CronSetter(props: CronSetterProps) {
    const { toast } = useToast();
    const { balenaId, initialValue } = props;
    const [value, setValue] = useState(initialValue);

    return (
        <div className="flex flex-col justify-center items-start w-full p-2 gap-2">
            <Cron
                value={value}
                setValue={setValue}
                clearButton={false}
                className="w-full"
            />
            <div className="flex justify-start items-center full gap-2">
                <Button
                    variant="outline"
                    className="bg-red-400/60 border border-teal-300 hover:bg-red-300/60 min-w-1/2"
                    onClick={() => {
                        setValue('* * * * *');
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant="outline"
                    className="bg-emerald-400/60 border border-teal-300 hover:bg-emerald-300/60 min-w-1/2"
                    onClick={() => {
                        try {
                            toast({
                                title: 'Success',
                                description: 'Updated device cron',
                            });
                        } catch (error: any) {
                            toast({
                                title: 'Uh oh...',
                                description:
                                    'Failed to update cron. Try again later',
                                variant: 'destructive',
                            });
                        }
                    }}
                >
                    Update Schedule
                </Button>
            </div>
        </div>
    );
}
