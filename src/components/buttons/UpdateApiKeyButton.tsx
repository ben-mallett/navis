'use client';

import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import { useState } from 'react';
import ApiKeyUpdateForm from '../forms/ApiKeyUpdateForm';

export default function UpdateApiKeyButton() {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="bg-blue-400/30 border-teal-300 border rounded-md hover:cursor-pointer hover:bg-blue-300/60 h-10 px-4 py-2 flex items-center gap-2">
                    Add API Key
                </div>
            </DialogTrigger>
            <DialogContent className="text-slate-600 ">
                <ApiKeyUpdateForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
