import React from 'react';
import {UserAuthForm} from "./components/user-auth";
import Link from "next/link";

const Page = () => {
    return (
        <div className="lg:p-8">
            <div className={'flex justify-center items-center'}>
               Recipe Hub
            </div>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Sign in with Google
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in with your Google account to continue
                    </p>
                </div>
                <UserAuthForm/>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Page;