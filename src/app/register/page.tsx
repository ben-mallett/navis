'use server';

import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import RegisterForm from '@/components/forms/RegisterForm';

export default async function Register() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="m-10 w-full md:w-[600px] h-1/2 flex flex-col justify-between items-center shadow-xl">
                <CardHeader>
                    <h1 className="pt-10 pb-4 px-4 text-bold bg-gradient-animated-text text-transparent">
                        Create Account
                    </h1>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
                <CardFooter>
                    <span className="text-sm mb-4">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:cursor-pointer "
                        >
                            Login Here
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
