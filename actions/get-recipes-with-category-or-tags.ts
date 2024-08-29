"use server";
import prisma from "@/lib/prisma";

export const getRecipesWithCategoryOrTags = async (
  category?: string,
  tags?: string,
  page: number = 1,
  limit: number = 50
) => {
  const take = limit;
  const skip = (page - 1) * take;

  const filterConditions: any = {};

  if (category) {
    filterConditions.category = {
      name: category,
    };
  }

  if (tags) {
    filterConditions.tags = {
      some: {
        name: tags,
      },
    };
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: filterConditions,
      include: {
        category: true,
        tags: true,
        author: true,
        favUsers: true,
      },
      skip,
      take,
      orderBy: {
        avgRating: "desc",
      },
    });

    const totalCount = await prisma.recipe.count({
      where: filterConditions,
    });

    setTimeout(() => {
      console.log("Fetching recipes...");
    }, 1000);

    return {
      recipes,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / take),
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
};
