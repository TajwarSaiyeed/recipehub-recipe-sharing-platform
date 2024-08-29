"use client";
import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";

interface FilterRecipeProps {
  categories: Category[];
  onCategoryChange: (category: string) => void;
}

const FilterRecipe: FC<FilterRecipeProps> = ({
  categories,
  onCategoryChange,
}) => {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Filter Recipes
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Easily browse and discover recipes that fit your preferences.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => onCategoryChange(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterRecipe;
