import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const getMyRecipes = async (page: number = 1, limit: number = 12) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        tags: true,
        author: true,
        favUsers: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalCount = await prisma.recipe.count({
      where: {
        authorId: userId,
      },
    });

    return {
      recipes,
      totalCount,
      status: true,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("[getMyRecipes]", error);
    return {
      message: "Failed to get recipes",
      status: false,
    };
  }
};
