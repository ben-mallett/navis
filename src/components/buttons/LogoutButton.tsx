'use client';

import { Button } from '../ui/button';
import { logoutUser } from '@/lib/actions/userActions';

export default function LogoutButton() {
    async function handleLogout() {
        await logoutUser();
    }

    return (
        <Button
            variant="outline"
            className="bg-white/10 border border-teal-300"
            onClick={handleLogout}
        >
            Log Out
        </Button>
    );
}
