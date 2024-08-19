import RecipeCard from "@/components/recipe-card";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
      tags: true,
      ratings: true,
      author: true,
    },
  });

  return (
    <>
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </section>
      <Link href={"/add-recipe"}>Add Recipe</Link>
    </>
  );
}
