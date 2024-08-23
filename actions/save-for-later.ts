"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const SaveForLater = async (id: string, pathName: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const existingSave = await prisma.recipe.findFirst({
      where: {
        id: id,
        favUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingSave) {
      await prisma.recipe.update({
        where: {
          id: id,
        },
        data: {
          favUsers: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
      return {
        message: "Recipe removed from saved",
        status: true,
      };
    } else {
      await prisma.recipe.update({
        where: {
          id: id,
        },
        data: {
          favUsers: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return {
        message: "Recipe saved for later",
        status: true,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to save recipe for later",
      status: false,
    };
  } finally {
    revalidatePath(pathName);
  }
};
