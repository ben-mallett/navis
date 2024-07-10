import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen items-center justify-center">
            <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-6xl w-full text-center text-teal-300">
                    Pontus
                </h1>
                <div className="w-full flex justify-between items-center gap-6">
                    <Link
                        href="/login"
                        className="w-32 bg-white/10 border border-teal-300 text-center px-2 py-1 rounded-md hover:bg-white/20"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/dashboard"
                        className="w-32 bg-white/10 border border-teal-300 text-center px-2 py-1 rounded-md hover:bg-white/20"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/register"
                        className="w-32 bg-white/10 border border-teal-300 text-center px-2 py-1 rounded-md hover:bg-white/20"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </main>
    );
}
