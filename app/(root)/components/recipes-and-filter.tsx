"use client";

import { Category } from "@prisma/client";
import { FC, useEffect, useRef, useState } from "react";
import FilterRecipe from "@/components/filter-recipe";
import RecipeCardSkeleton from "@/components/recipe-card-skeleton";
import RecipeCard, { RecipeWithCategoryTags } from "@/components/recipe-card";
import { getRecipesWithCategoryOrTags } from "@/actions/get-recipes-with-category-or-tags";

interface RecipesAndFilterProps {
  categories: Category[];
  query?: string;
}

const RecipesAndFilter: FC<RecipesAndFilterProps> = ({ categories, query }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [recipes, setRecipes] = useState<RecipeWithCategoryTags[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(pageNo === 1);
      setLoadMore(pageNo > 1);
      try {
        const { recipes: newRecipes, totalPages } =
          await getRecipesWithCategoryOrTags(
            query,
            selectedCategory,
            [],
            pageNo
          );
        setHasMore(pageNo < totalPages);
        return { newRecipes, totalPages };
      } catch (error) {
        console.error("Error fetching recipes:", error);
        return { newRecipes: [], totalPages: 0 };
      } finally {
        setIsLoading(false);
        setLoadMore(false);
      }
    };

    fetchRecipes().then(({ newRecipes, totalPages }) => {
      setRecipes((prevRecipes: RecipeWithCategoryTags[]) =>
        pageNo === 1 || selectedCategory
          ? newRecipes || []
          : [...prevRecipes, ...(newRecipes || [])]
      );
      setHasMore(pageNo < totalPages);
    });
  }, [query, selectedCategory, pageNo]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNo((prevPageNo) => prevPageNo + 1);
      }
    });

    const bottomElement = document.querySelector("#bottom");
    if (bottomElement) observer.current.observe(bottomElement);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore]);

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
    setPageNo(1);
  };

  return (
    <>
      <FilterRecipe
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
      {isLoading && pageNo === 1 ? (
        <section className="mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {[...Array(8)].map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </section>
      ) : recipes.length === 0 ? (
        <div className="mb-5 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">No recipes found.</p>
        </div>
      ) : (
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
      <div id="bottom" />
      {loadMore && (
        <section className="mb-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {[...Array(8)].map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </section>
      )}
    </>
  );
};

export default RecipesAndFilter;
