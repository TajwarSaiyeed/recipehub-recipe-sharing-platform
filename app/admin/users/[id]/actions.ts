import { calculateAverageRating } from "@/lib/utils";
import prisma from "@/lib/prisma";

export const getUserDetails = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      recipes: {
        include: {
          category: true,
          tags: true,
          ratings: true,
          author: true,
          favUsers: true,
        },
      },
    },
  });

  const avgRating = calculateAverageRating(user?.recipes || []);
  return {
    user,
    avgRating,
  };
};
