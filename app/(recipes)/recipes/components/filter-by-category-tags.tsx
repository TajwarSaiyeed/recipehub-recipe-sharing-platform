"use client";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Category, Tag } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { FilterIcon, SearchIcon, TagIcon } from "lucide-react";
import RecipeCardSkeleton from "@/components/recipe-card-skeleton";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RecipeCard, { RecipeWithCategoryTags } from "@/components/recipe-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface FilterByCategoryTags {
  categories: Category[];
  tags: Tag[];
  recipes: RecipeWithCategoryTags[];
  category?: string;
  tagsArray?: string[];
  totalPages: number;
  currentPage: number;
}

const FilterByCategoryTags: FC<FilterByCategoryTags> = ({
  categories,
  tags,
  recipes,
  category,
  tagsArray = [],
  totalPages,
  currentPage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery);
  const [secondRender, setSecondRender] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    category
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(tagsArray);
  const firstRenderRef = useRef(true);

  const router = useRouter();

  const uniqueTagsArray = useMemo(() => {
    return Array.from(new Set(selectedTags));
  }, [selectedTags]);

  const updateFiltersAndNavigate = useCallback(() => {
    const queryParams = {
      category: selectedCategory || undefined,
      tags: uniqueTagsArray.length > 0 ? uniqueTagsArray.join(",") : undefined,
      search: debouncedValue || undefined,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.pathname,
        query: queryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  }, [selectedCategory, uniqueTagsArray, debouncedValue, router]);

  const handleCategoryClick = (selectedCategory: string | undefined) => {
    setSelectedCategory(selectedCategory);
  };

  const handleTagClick = (selectedTag: string) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(selectedTag)) {
        return prevTags.filter((tag) => tag !== selectedTag);
      } else {
        return Array.from(new Set([...prevTags, selectedTag]));
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (
      selectedCategory ||
      uniqueTagsArray.length > 0 ||
      debouncedValue ||
      secondRender
    ) {
      setSecondRender(true);
      updateFiltersAndNavigate();
    }
  }, [
    updateFiltersAndNavigate,
    selectedCategory,
    uniqueTagsArray,
    debouncedValue,
    secondRender,
  ]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [selectedCategory, uniqueTagsArray]);

  const toggleCategoryVisibility = () => {
    setShowCategories((prev) => !prev);
    setShowTags(false);
  };

  const toggleTagVisibility = () => {
    setShowTags((prev) => !prev);
    setShowCategories(false);
  };

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
                  selectedCategory === categoryItem.name
                    ? undefined
                    : categoryItem.name
                );
                setShowTags(false);
              }}
              variant={
                categoryItem.name === selectedCategory ? "default" : "outline"
              }
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
              variant={
                uniqueTagsArray.includes(tag.name) ? "default" : "outline"
              }
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

      <Pagination className={"mt-5"}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage === 1) {
                  return;
                }
                router.push(`?page=${currentPage - 1}`);
              }}
              className={cn(
                "cursor-pointer",
                buttonVariants({
                  variant: currentPage === 1 ? "outline" : "default",
                  size: "sm",
                }),
                {
                  "cursor-not-allowed": currentPage === 1,
                }
              )}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem
              key={index}
              onClick={() => {
                router.push(`?page=${index + 1}`);
              }}
              className={cn("cursor-pointer", {
                "cursor-not-allowed": index + 1 === currentPage,
              })}
            >
              <PaginationLink isActive={index + 1 === currentPage}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage !== totalPages &&
                router.push(`?page=${currentPage + 1}`)
              }
              className={cn(
                "cursor-pointer",
                buttonVariants({
                  variant: currentPage === totalPages ? "outline" : "default",
                  size: "sm",
                }),
                {
                  "cursor-not-allowed": currentPage === totalPages,
                }
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default FilterByCategoryTags;
