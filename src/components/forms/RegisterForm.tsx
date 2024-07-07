'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { createUser } from '@/lib/actions/userActions';
import { useToast } from '../ui/use-toast';

export const RegisterFormSchema = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    email: z
        .string()
        .min(1, { message: 'This field is required' })
        .email('Invalid Email'),
    password: z
        .string()
        .min(8, {
            message: 'Your password does not have at least 8 characters.',
        }),
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export default function RegisterForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });
    const { control } = form;
    const { isSubmitting } = useFormState({ control });

    async function onRegisterFormSubmit(values: RegisterFormData) {
        const result = await createUser(values);
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
                onSubmit={form.handleSubmit((data) =>
                    onRegisterFormSubmit(data)
                )}
                className="flex flex-col w-full gap-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="John"
                                    type="string"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Put what you want us to call you.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                            <FormDescription>
                                Put the email you want to log in with.
                            </FormDescription>
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
                            <FormDescription>
                                Passwords must have at least 8 characters.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="px-4 py-2 self-center mt-10 w-1/2 w-full"
                >
                    {isSubmitting ? 'Pending' : 'Submit'}
                </Button>
            </form>
        </Form>
    );
}
