"use server";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

interface updateProfileProps {
    name?: string;
    image?: string;
}

export const updateProfile = async (id: string | undefined, data : updateProfileProps
) => {
    if (!id) {
        return;
    }
    try {
        await prisma.user.update({
            where: {
                id: id
            },
            data
        })

        revalidatePath('/me/profile');
    } catch (error) {
        console.error(error);
    }
}