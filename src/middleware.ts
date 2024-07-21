import { NextResponse, type NextRequest } from 'next/server';
import { decrypt, revokeSession } from './lib/session';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

function violatesLoginOnlyRoutes(desiredPath: string, session: any) {
    const loggedInOnlyRoutes = [
        '/dashboard',
        '/dashboard/streaming',
        '/dashboard/scheduling',
        '/dashboard/account',
        '/dashboard/admin/users',
        '/dashboard/admin/devices',
    ];
    return loggedInOnlyRoutes.includes(desiredPath) && !session?.id;
}

function violatesAdminOnlyRoutes(desiredPath: string, session: any) {
    const adminOnlyRoutes = [
        '/dashboard/admin/users',
        '/dashboard/admin/devices',
    ];

    return (
        adminOnlyRoutes.includes(desiredPath) && session?.role !== Role.ADMIN
    );
}

export async function middleware(request: NextRequest) {
    const desiredPath = request.nextUrl.pathname;

    const cookie: string = cookies().get('session')?.value as string;
    const session = await decrypt(cookie);

    console.log(session);

    if (violatesLoginOnlyRoutes(desiredPath, session)) {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (violatesAdminOnlyRoutes(desiredPath, session)) {
        return NextResponse.json(
            { error: true, message: 'Not authorized to view this page.' },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
