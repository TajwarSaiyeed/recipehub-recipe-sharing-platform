"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Category, Tag } from "@prisma/client";
import { Button } from "@/components/ui/button";
import React, { FC, useEffect, useState } from "react";
import { FilterIcon, SearchIcon, TagIcon } from "lucide-react";
import RecipeCardSkeleton from "@/components/recipe-card-skeleton";
import RecipeCard, { RecipeWithCategoryTags } from "@/components/recipe-card";

interface FilterByCategoryTags {
  categories: Category[];
  tags: Tag[];
  recipes: RecipeWithCategoryTags[];
  category?: string;
  tagsArray?: string[];
}

const FilterByCategoryTags: FC<FilterByCategoryTags> = ({
  categories,
  tags,
  recipes,
  category,
  tagsArray = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCategoryClick = (selectedCategory: string | undefined) => {
    const newParams = new URLSearchParams(window.location.search);
    if (selectedCategory) {
      newParams.set("category", selectedCategory);
    } else {
      newParams.delete("category");
    }
    router.push(`?${newParams.toString()}`);
  };

  const handleTagClick = (selectedTag: string) => {
    const newParams = new URLSearchParams(window.location.search);
    let currentTags = tagsArray ? [...tagsArray] : [];

    if (currentTags.includes(selectedTag)) {
      currentTags = currentTags.filter((tag) => tag !== selectedTag);
    } else {
      currentTags = Array.from(new Set([...currentTags, selectedTag])); // Ensure uniqueness
    }

    if (currentTags.length > 0) {
      newParams.set("tags", currentTags.join(","));
    } else {
      newParams.delete("tags");
    }
    router.push(`?${newParams.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleCategoryVisibility = () => {
    setShowCategories((prev) => !prev);
    setShowTags(false);
  };

  const toggleTagVisibility = () => {
    setShowTags((prev) => !prev);
    setShowCategories(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [category, tagsArray]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCategoryVisibility}
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Categories
          </Button>

          <Button variant="outline" size="sm" onClick={toggleTagVisibility}>
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
          {categories.map((categoryItem) => (
            <Button
              key={categoryItem.id}
              onClick={() => {
                setShowCategories(false);
                handleCategoryClick(
                  category === categoryItem.name ? undefined : categoryItem.name
                );
                setShowTags(false);
              }}
              variant={categoryItem.name === category ? "default" : "outline"}
            >
              {categoryItem.name}
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
                handleTagClick(tag.name);
              }}
              variant={tagsArray.includes(tag.name) ? "default" : "outline"}
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
      ) : recipes.length === 0 ? (
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
