import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import RecipeCard from "@/components/recipe-card";

const Favourites = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in?callbackUrl=/me/favourites");

  const recipes = await prisma.recipe.findMany({
    where: {
      favUsers: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      category: true,
      tags: true,
      author: true,
      favUsers: true,
    },
  });

  if (recipes?.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-semibold">
            You haven&apos;t favourite any recipes yet.
          </p>
          <p className="text-muted-foreground">
            Favourite a recipe to see it here.
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

export default Favourites;
