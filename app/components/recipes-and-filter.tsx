"use client";

import { Category } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import FilterRecipe from "@/components/filter-recipe";
import RecipeCardSkeleton from "@/components/recipe-card-skeleton";
import RecipeCard, { RecipeWithCategoryTags } from "@/components/recipe-card";
import { getRecipesWithCategoryOrTags } from "@/actions/get-recipes-with-category-or-tags";

interface RecipesAndFilterProps {
  categories: Category[];
}

const RecipesAndFilter: FC<RecipesAndFilterProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [recipes, setRecipes] = useState<RecipeWithCategoryTags[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log({ selectedCategory, recipes, isLoading });

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const { recipes } = await getRecipesWithCategoryOrTags(
          selectedCategory
        );
        return recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes().then((recipes) => setRecipes(recipes || []));
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory(undefined);
    } else {
      window.scrollTo({
        top: document.body.scrollHeight - 50,
        behavior: "smooth",
      });
      setSelectedCategory(category);
    }
  };

  return (
    <>
      <FilterRecipe
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
      {isLoading ? (
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {[...Array(8)].map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </section>
      ) : recipes.length == 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-lg text-muted-foreground">No recipes found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </>
  );
};

export default RecipesAndFilter;
