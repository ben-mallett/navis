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
import { useRouter } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { updateUserBalenaApiKey } from '@/lib/actions/userActions';

export const ApiKeyUpdateFormSchema = z.object({
    apiKey: z.string().min(1),
});

export type ApiKeyUpdateFormData = z.infer<typeof ApiKeyUpdateFormSchema>;

export type ApiKeyUpdateFormProps = {
    setOpen?: Function;
};

export default function ApiKeyUpdateForm(props: ApiKeyUpdateFormProps) {
    const { setOpen } = props;
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<ApiKeyUpdateFormData>({
        resolver: zodResolver(ApiKeyUpdateFormSchema),
        defaultValues: {
            apiKey: '',
        },
    });
    const { control } = form;
    const { isSubmitting } = useFormState({ control });

    async function onApiKeyUpdateFormSubmit(values: ApiKeyUpdateFormData) {
        const { apiKey } = values;
        const { id, role } = await verifySession();
        const result = await updateUserBalenaApiKey(id, apiKey, id);
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
                    onApiKeyUpdateFormSubmit(data)
                )}
                className="flex flex-col w-full gap-6"
            >
                <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Balena API Key</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="fldkaSJDHFLsdfjldakgsdjfDSfjasldf"
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
