"use server";
import prisma from "@/lib/prisma";

export const getRecipesWithCategoryOrTags = async (
  query?: string,
  category?: string,
  tags?: string[],
  page: number = 1,
  limit: number = 12
) => {
  const take = limit;
  const skip = (page - 1) * take;

  try {
    let whereClause: any = {};

    if (category || (tags && tags.length > 0) || query) {
      whereClause = {
        OR: [
          category ? { category: { name: category } } : {},
          tags?.length
            ? {
                tags: {
                  some: {
                    name: {
                      in: tags,
                    },
                  },
                },
              }
            : {},
          query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
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
      orderBy:
        category || tags || query
          ? { avgRating: "desc" }
          : { createdAt: "asc" },
    });

    const totalCount = await prisma.recipe.count({
      where: whereClause,
    });

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
