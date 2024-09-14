"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { UpdateRecipeFormData } from "./components/update-recipe-form";

export async function UpdateRecipe(
  recipe: UpdateRecipeFormData,
  authorId: string
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (authorId !== userId) {
    throw new Error("Unauthorized");
  }

  try {
    const existingTags = await prisma.tag.findMany({
      where: {
        id: { in: recipe.tags },
      },
    });

    const existingTagIds = existingTags.map((tag) => tag.id);

    return await prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        tags: {
          set: existingTagIds.map((id) => ({ id })),
        },
        category: {
          connect: {
            id: recipe.categoryId,
          },
        },
        image: recipe.image,
      },
    });
  } catch (error) {
    throw new Error("Failed to update recipe.");
  }
}
