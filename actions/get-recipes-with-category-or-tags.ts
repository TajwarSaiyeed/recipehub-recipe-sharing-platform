"use server";
import prisma from "@/lib/prisma";

export const getRecipesWithCategoryOrTags = async (
  category?: string,
  tags?: string[],
  page: number = 1,
  limit: number = 50
) => {
  const take = limit;
  const skip = (page - 1) * take;

  try {
    let whereClause = {};

    if (category || (tags && tags.length > 0)) {
      whereClause = {
        OR: [
          {
            category: {
              name: category,
            },
          },
          {
            tags: {
              some: {
                name: {
                  in: tags ? tags : [],
                },
              },
            },
          },
        ],
      };
    }

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
        author: true,
        favUsers: true,
      },
      skip,
      take,
      orderBy: category || tags ? { avgRating: "desc" } : { createdAt: "desc" }, // Randomize order when no filter is applied
    });

    const totalCount = await prisma.recipe.count({
      where: whereClause,
    });

    setTimeout(() => {
      console.log("Fetching recipes...", new Date());
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
