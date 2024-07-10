'use client';

import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import { Plus } from 'lucide-react';
import CreateDeviceForm from '../forms/AddDeviceForm';
import { useState } from 'react';

export type AddDeviceButtonProps = {
    id: number;
};

export default function AddDeviceButton(props: AddDeviceButtonProps) {
    const { id } = props;
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="bg-green-400/60 border-teal-300 border rounded-md hover:cursor-pointer hover:bg-green-300/60 h-10 px-4 py-2 flex items-center gap-2">
                    <Plus color="rgb(94 234 212)" strokeWidth={1.25} />
                    Add Device
                </div>
            </DialogTrigger>
            <DialogContent className="text-slate-600 ">
                <CreateDeviceForm id={id} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
