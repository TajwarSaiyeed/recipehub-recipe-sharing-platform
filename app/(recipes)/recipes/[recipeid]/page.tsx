import { FC } from "react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import RecipeHeader from "./components/recipe-header";
import RecipeDetails from "./components/recipe-details";
import Ingredients from "./components/ingredients";
import Instructions from "./components/instructions";
import RecipeTags from "./components/recipe-tags";
import RecipeActions from "./components/recipe-actions";
import getSession from "@/lib/get-session";
import SimilarRecipes from "@/app/(recipes)/recipes/[recipeid]/components/similar-recipes";
import RecipeReviews from "@/app/(recipes)/recipes/[recipeid]/components/recipe-reviews";

interface RecipePageProps {
  params: {
    recipeid: string;
  };
}

const RecipePage: FC<RecipePageProps> = async ({ params: { recipeid } }) => {
  const session = await getSession();
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeid,
    },
    include: {
      category: true,
      tags: true,
      favUsers: true,
      reviews: {
        include: {
          user: true,
        },
        take: 5,
      },
    },
  });

  if (!recipe) {
    toast.error("Recipe not found", {
      description: "The recipe you are looking for does not exist.",
    });
    redirect("/");
  }

  const recipeImage = recipe.image;
  const {
    title,
    instructions,
    prepTime,
    cookTime,
    servings,
    category,
    reviews,
    tags,
  } = recipe;
  const ingredients = recipe?.ingredients as
    | { name: string; quantity: string }[]
    | null;
  const isSavedForLater = recipe.favUsers.some(
    (user) => user.id === session?.user.id
  );

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Image
              src={recipeImage || "/placeholder.svg"}
              width={800}
              height={600}
              alt="Recipe Image"
              className="w-full rounded-lg object-cover"
              style={{ aspectRatio: "800/600", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-6">
            <RecipeHeader
              title={title}
              rating={
                reviews.reduce(
                  (acc: any, review: { rating: any }) => acc + review.rating,
                  0
                ) / reviews.length || 0
              }
              reviews={reviews.length}
            />
            <RecipeDetails
              prepTime={prepTime}
              cookTime={cookTime}
              servings={servings}
              category={category.name}
            />
            <Ingredients ingredients={ingredients} />
            <Instructions instructions={instructions} />
          </div>
        </div>
        <SimilarRecipes
          category={category.name}
          tags={tags}
          recipeId={recipeid}
        />
        <RecipeReviews recipeId={recipeid} />
        <div className="mt-12 flex flex-wrap justify-between gap-4">
          <RecipeActions
            recipeId={recipeid}
            isSavedForLater={isSavedForLater}
          />
          <RecipeTags tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
