'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { loginUser } from '@/lib/actions/userActions';
import { useToast } from '../ui/use-toast';

export const LoginFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'This field is required' })
        .email('Invalid Email'),
    password: z
        .string()
        .min(8, { message: 'Password must have at least 8 characters.' }),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const { control } = form;
    const { isSubmitting } = useFormState({ control });

    async function onLoginFormSubmit(values: z.infer<typeof LoginFormSchema>) {
        const result = await loginUser(values);
        if (result?.error) {
            toast({
                title: 'Uh oh...',
                description: result?.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => onLoginFormSubmit(data))}
                className="flex flex-col w-full gap-6"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="john@smith.com"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="supersecurepassword"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="px-4 py-2 self-center mt-10 w-1/2 w-full">
                    {isSubmitting ? 'Pending' : 'Submit'}
                </Button>
            </form>
        </Form>
    );
}
