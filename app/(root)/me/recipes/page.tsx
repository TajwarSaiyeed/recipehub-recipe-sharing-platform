import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyRecipes } from "@/actions/get-my-recipes";
import RecipeCard from "@/components/recipe-card";
import React from "react";

const Page = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in?callbackUrl=/me/recipes");

  const { recipes, status, totalPages, totalCount } = await getMyRecipes();

  if (!status) return <div>Failed to get recipes</div>;

  if (recipes?.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-semibold">
            You haven&apos;t shared any recipes yet.
          </p>
          <p className="text-muted-foreground">
            Share your first recipe with the community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 my-3">
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
};

export default Page;
