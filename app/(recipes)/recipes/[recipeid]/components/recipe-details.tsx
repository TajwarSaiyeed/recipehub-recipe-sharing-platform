"use client";

import Link from "next/link";
import { FC } from "react";

interface RecipeDetailsProps {
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
}

const RecipeDetails: FC<RecipeDetailsProps> = ({
  prepTime,
  cookTime,
  servings,
  category,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-medium">Prep Time</h2>
        <p className="text-muted-foreground">{prepTime} mins</p>
      </div>
      <div>
        <h2 className="text-lg font-medium">Cook Time</h2>
        <p className="text-muted-foreground">{cookTime} mins</p>
      </div>
      <div>
        <h2 className="text-lg font-medium">Servings</h2>
        <p className="text-muted-foreground">{servings}</p>
      </div>
      <div>
        <h2 className="text-lg font-medium">Category</h2>
        <Link
          href={`/recipes?category=${category}`}
          className="text-muted-foreground hover:text-primary"
          prefetch={false}
        >
          {category}
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetails;
