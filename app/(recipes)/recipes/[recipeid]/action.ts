"use server";
import { auth } from "@/auth";
import { ReviewFormData } from "./components/add-recipe-review-form";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ReviewWithRecipeId {
  review: ReviewFormData;
  recipeId: string;
  pathName: string;
}

export async function addReview({
  review,
  recipeId,
  pathName,
}: ReviewWithRecipeId) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Unauthorized: User is not logged in.");
    }
    const userId = session.user.id;

    await prisma.review.create({
      data: {
        recipeId,
        rating: review.rating,
        content: review.content,
        userId,
      },
    });

    const { _avg, _count } = await prisma.review.aggregate({
      where: {
        recipeId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    const avgRating = _avg.rating ?? 0;
    await prisma.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        totalReviews: _count.rating,
        avgRating,
      },
    });
    revalidatePath(pathName);
  } catch (error) {
    console.error("[addReview] Error:", error);
    throw new Error("Failed to add review. Please try again later.");
  }
}
