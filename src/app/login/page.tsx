'use client';

import { authenticate } from '@/lib/actions/authActions';
import SubmitButton from '@/components/SubmitButton';
import { useFormState } from 'react-dom';

export default function Login() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <main className="flex flex-col justify-start items-center min-h-screen min-w-screen bg-black pt-40">
            <div className="bg-white rounded-md m-10 w-full sm:w-1/2 md:w-1/3 h-1/2 flex flex-col justify-between items-center">
                <h1 className="p-4 text-bold bg-gradient-to-bl from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    Login
                </h1>

                <form action={dispatch}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    ></input>
                    <div>{errorMessage && <p>{errorMessage}</p>}</div>
                    <SubmitButton className="p-2" content="Login" />
                </form>
            </div>
        </main>
    );
}
