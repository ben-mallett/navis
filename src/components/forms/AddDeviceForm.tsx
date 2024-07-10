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
import { createDevice } from '@/lib/actions/deviceActions';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

export const CreateDeviceFormSchema = z.object({
    name: z.string().min(1),
    balenaId: z.string().min(1),
    ipAddress: z.string().ip({ message: 'Invalid IP address' }),
});

export type CreateDeviceFormData = z.infer<typeof CreateDeviceFormSchema>;

export type CreateDeviceFormProps = {
    id: number;
    setOpen?: Function;
};

export default function CreateDeviceForm(props: CreateDeviceFormProps) {
    const { id, setOpen } = props;
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<CreateDeviceFormData>({
        resolver: zodResolver(CreateDeviceFormSchema),
        defaultValues: {
            ipAddress: '',
        },
    });
    const { control } = form;
    const { isSubmitting } = useFormState({ control });

    async function onCreateDeviceSubmit(values: CreateDeviceFormData) {
        const { error, message, data } = await createDevice(id, values, id);
        if (error) {
            toast({
                title: 'Uh oh...',
                description: message,
                variant: 'destructive',
            });
        }
        if (setOpen !== undefined) {
            setOpen(false);
        }
        router.refresh();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) =>
                    onCreateDeviceSubmit(data)
                )}
                className="flex flex-col w-full gap-6"
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
                                    placeholder="Sample Device"
                                    type="string"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="balenaId"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Balena ID</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="uu8q34"
                                    type="string"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ipAddress"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>IP Address</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="192.168.1.1"
                                    type="string"
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
