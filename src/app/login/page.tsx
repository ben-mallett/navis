'use server';

import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import LoginForm from '@/components/forms/LoginForm';

export default async function Login() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="mx-10 w-full md:w-[600px] h-1/2 flex flex-col justify-between items-center shadow-xl">
                <CardHeader>
                    <h1 className="pt-4 pb-4 px-4 text-bold bg-gradient-animated-text text-transparent">
                        Login
                    </h1>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter>
                    <span className="text-sm mb-4">
                        Don&#39;t have an account yet?{' '}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:cursor-pointer "
                        >
                            Register Here
                        </Link>{' '}
                        or{' '}
                        <Link
                            href="/"
                            className="text-blue-600 hover:cursor-pointer"
                        >
                            Go Home
                        </Link>
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
}
