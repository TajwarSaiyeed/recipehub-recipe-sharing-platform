import prisma from "@/lib/prisma";

export const users = async (
  page: number = 1,
  limit: number = 20,
  query: string
) => {
  try {
    const skip = (page - 1) * limit;
    return await prisma.user.findMany({
      skip: skip,
      take: limit,
      include: {
        recipes: {
          include: {
            reviews: true,
          },
        },
      },
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
