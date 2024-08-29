"use client";

import { Input } from "@/components/ui/input";
import { Category, Tag } from "@prisma/client";
import { Button } from "@/components/ui/button";
import React, { FC, useEffect, useState } from "react";
import { FilterIcon, SearchIcon, TagIcon } from "lucide-react";
import RecipeCardSkeleton from "@/components/recipe-card-skeleton";
import RecipeCard, { RecipeWithCategoryTags } from "@/components/recipe-card";
import { getRecipesWithCategoryOrTags } from "@/actions/get-recipes-with-category-or-tags";

interface FilterByCategoryTags {
  categories: Category[];
  tags: Tag[];
}

const FilterByCategoryTags: FC<FilterByCategoryTags> = ({
  categories,
  tags,
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>(
    undefined
  );
  const [recipes, setRecipes] = useState<RecipeWithCategoryTags[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleCategoryClick = () => {
    setShowCategories((prev) => !prev);
    setShowTags(false);
  };
  const handleTagClick = () => {
    setShowTags((prev) => !prev);
    setShowCategories(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const { recipes } = await getRecipesWithCategoryOrTags(
          selectedCategory,
          selectedTags
        );
        return recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes().then((recipes) => setRecipes(recipes || []));
  }, [selectedCategory, selectedTags]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleCategoryClick}>
            <FilterIcon className="w-4 h-4 mr-2" />
            Categories
          </Button>

          <Button variant="outline" size="sm" onClick={handleTagClick}>
            <TagIcon className="w-4 h-4 mr-2" />
            Tags
          </Button>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8 pr-4 py-2 rounded-md bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {showCategories && (
        <div className="p-5 w-full flex flex-wrap gap-2 z-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => {
                setShowCategories(false);
                setSelectedCategory(
                  selectedCategory === category.name ? undefined : category.name
                );
                setShowTags(false);
              }}
              variant={
                category.name === selectedCategory ? "default" : "outline"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {showTags && (
        <div className="p-5 w-full flex flex-wrap gap-2 z-10">
          {tags.map((tag) => (
            <Button
              key={tag.id}
              onClick={() => {
                setShowTags(false);
                setShowCategories(false);
                selectedTags?.includes(tag.name)
                  ? setSelectedTags(selectedTags.filter((t) => t !== tag.name))
                  : setSelectedTags([...(selectedTags || []), tag.name]);
              }}
              variant={selectedTags?.includes(tag.name) ? "default" : "outline"}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      )}

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

export default FilterByCategoryTags;
