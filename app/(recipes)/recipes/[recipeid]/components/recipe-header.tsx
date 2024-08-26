"use client";
import { StarIcon } from "lucide-react";
import { FC } from "react";

interface RecipeHeaderProps {
  title: string;
  rating: number;
  reviews: number;
}

const RecipeHeader: FC<RecipeHeaderProps> = ({ title, rating, reviews }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4" />
          <span>{rating.toFixed(2)}</span>
        </div>
        <span>|</span>
        <span>{reviews} reviews</span>
      </div>
    </div>
  );
};

export default RecipeHeader;
