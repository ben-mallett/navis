'use server';

import LogoutButton from '../buttons/LogoutButton';

export default async function DashboardHeader() {
    return (
        <div className="sticky top-0 flex justify-between items-center w-full h-full">
            <h2 className="pl-2">Dashboard</h2>
            <LogoutButton />
        </div>
    );
}
