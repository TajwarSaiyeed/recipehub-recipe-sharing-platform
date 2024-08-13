"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {toast} from "sonner";
import {signIn} from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function UserAuthForm({className, ...props}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function onSubmit(event: React.SyntheticEvent) {
        try {
            setIsLoading(true)
            await signIn("google", {callbackUrl: "/"});
        } catch (e) {
            console.log("Error ", e);
            toast.error("Error", {
                duration: 5000,
                position: 'top-right',
                style: {
                    backgroundColor: '#EF4444',
                    color: '#fff',
                },
                description: 'Something went wrong, please try again.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Button
                onClick={onSubmit}
                type="button" disabled={isLoading}>
                Google
            </Button>
        </div>
    )
}