import { Recipe, User } from "@prisma/client";

type UserWithRecipes = User & { recipes: Recipe[] };
type UserCardProps = {
  user: UserWithRecipes;
};

export type { UserCardProps, UserWithRecipes };
