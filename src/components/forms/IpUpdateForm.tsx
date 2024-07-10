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
import { useToast } from '../ui/use-toast';
import { updateDeviceIp } from '@/lib/actions/deviceActions';
import { useRouter } from 'next/navigation';
import { verifySession } from '@/lib/session';

export const IpUpdateFormSchema = z.object({
    ipAddress: z.string().ip({ message: 'Invalid IP address' }),
});

export type IpUpdateFormData = z.infer<typeof IpUpdateFormSchema>;

export type IpUpdateFormProps = {
    deviceId: number;
    setOpen?: Function;
};

export default function IpUpdateForm(props: IpUpdateFormProps) {
    const { deviceId, setOpen } = props;
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<IpUpdateFormData>({
        resolver: zodResolver(IpUpdateFormSchema),
        defaultValues: {
            ipAddress: '',
        },
    });
    const { control } = form;
    const { isSubmitting } = useFormState({ control });

    async function onIpUpdateFormSubmit(
        deviceId: number,
        values: IpUpdateFormData
    ) {
        const { ipAddress } = values;
        const { id: userId, role } = await verifySession();
        const result = await updateDeviceIp(deviceId, ipAddress, userId);
        if (result?.error) {
            toast({
                title: 'Uh oh...',
                description: result?.message,
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
                    onIpUpdateFormSubmit(deviceId, data)
                )}
                className="flex flex-col w-full gap-6"
            >
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
                <Button className="px-4 py-2 self-center w-1/2 w-full bg-white/10">
                    {isSubmitting ? 'Pending' : 'Submit'}
                </Button>
            </form>
        </Form>
    );
}
