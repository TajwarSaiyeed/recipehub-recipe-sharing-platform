import { FC } from "react";
import { toast } from "sonner";
import prisma from "@/lib/prisma";
import getSession from "@/lib/get-session";
import { redirect } from "next/navigation";
import RecipeTags from "./components/recipe-tags";
import Ingredients from "./components/ingredients";
import Instructions from "./components/instructions";
import RecipeHeader from "./components/recipe-header";
import { Separator } from "@/components/ui/separator";
import RecipeDetails from "./components/recipe-details";
import RecipeActions from "./components/recipe-actions";
import RecipeReviews from "./components/recipe-reviews";
import SimilarRecipes from "./components/similar-recipes";

interface RecipePageProps {
  params: {
    recipeid: string;
  };
}

export const revalidate = 60;

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
    },
  });

  let reviewIsExists;

  if (session?.user?.id) {
    reviewIsExists = await prisma.review.findFirst({
      where: {
        recipeId: recipeid,
        userId: session?.user.id,
      },
    });
  }

  if (!recipe) {
    toast.error("Recipe not found", {
      description: "The recipe you are looking for does not exist.",
    });
    redirect("/");
  }

  const recipeImage = recipe.image;
  const { title, instructions, prepTime, cookTime, servings, category, tags } =
    recipe;
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
            {/*<Image*/}
            {/*  src={`${recipe.image || ""}?${new Date().getTime()}`}*/}
            {/*  width={800}*/}
            {/*  height={600}*/}
            {/*  alt="Recipe Image"*/}
            {/*  className="w-full rounded-lg object-cover"*/}
            {/*  style={{ aspectRatio: "800/600", objectFit: "cover" }}*/}
            {/*/>*/}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${recipe.image || ""}?${new Date().getTime()}`}
              width="800"
              height="600"
              alt="Recipe Image"
              loading={"lazy"}
              className="w-full rounded-lg object-cover"
              style={{ aspectRatio: "800/600", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-6">
            <RecipeHeader
              title={title}
              rating={recipe.avgRating}
              reviews={recipe.totalReviews}
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
        <RecipeReviews
          recipeId={recipeid}
          reviewIsExists={!!reviewIsExists}
          me={session?.user?.id === recipe.authorId}
          loggedIn={!!session?.user}
        />
        <Separator className={"mx-auto max-w-5xl w-full mt-3"} />
        <div className="mt-8 flex flex-wrap justify-between gap-4">
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
