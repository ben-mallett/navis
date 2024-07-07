'use client';

import Link from 'next/link';
import { ReactElement } from 'react';
import { usePathname } from 'next/navigation';
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from '../ui/tooltip';

export type DashboardNavEntryProps = {
    ChildIcon: ReactElement;
    path: string;
    tooltipMessage: string;
};

export default function DashboardNavEntry(props: DashboardNavEntryProps) {
    const { ChildIcon, path, tooltipMessage } = props;
    const pathname = usePathname();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`${path}`}
                        className={`flex justify-center items-center h-[60px] ${pathname === path && 'bg-white/20'} border-b border-teal-300 w-full hover:cursor-pointer hover:bg-white/40 `}
                    >
                        {ChildIcon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent
                    side="bottom"
                    className="bg-teal-300 rounded-md"
                >
                    <div className="p-2 w-full h-full">{tooltipMessage}</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
