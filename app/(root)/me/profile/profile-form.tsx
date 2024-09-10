'use client'
import React, {FC, useState} from 'react';
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {updateProfile} from "@/app/(root)/me/profile/profile-action";
import {useSession} from "next-auth/react";
import {toast} from "sonner";

interface ProfileFormProps {
    uid: string;
    username: string;
    email: string;
}

const profileFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm: FC<ProfileFormProps> = ({uid, username, email}) => {
    const [oldUsername, setOldUsername] = useState(username);
    const session = useSession()
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: username,
        },
    });

    const onSubmit = async (values: ProfileFormValues) => {
        await updateProfile(uid, values)
        await session.update();
        toast.success("Profile updated successfully");
    }

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-2.5"
                >
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter a username" {...field} />
                                    </FormControl>
                                    <FormDescription>Your public username</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={email} disabled/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"
                                disabled={form.formState.isSubmitting || !form.formState.isDirty || oldUsername === form.getValues().name}
                                className="ml-auto">
                            Save Changes
                        </Button>
                    </CardFooter>

                </form>
            </Form>
        </Card>
    );
};

export default ProfileForm;
