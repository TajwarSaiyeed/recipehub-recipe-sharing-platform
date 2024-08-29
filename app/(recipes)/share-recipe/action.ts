"use server";
import { auth } from "@/auth";
import { RecipeFormData } from "./recipe-form";
import prisma from "@/lib/prisma";

export async function shareRecipe(recipe: RecipeFormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const {
    title,
    description,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    servings,
    tags,
    image,
    categoryId,
  } = recipe;

  return prisma.recipe.create({
    data: {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      tags: {
        connect: tags.map((tag) => ({ id: tag })),
      },
      category: {
        connect: {
          id: categoryId,
        },
      },
      author: {
        connect: {
          id: userId,
        },
      },
      image: image,
    },
    include: {
      tags: true,
      category: true,
      author: true,
    },
  });
}
