import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatted(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const calculateAverageRating = (recipes: any[]) => {
  let totalRatings = 0;
  let ratingCount = 0;

  recipes?.forEach((recipe) => {
    recipe.ratings.forEach((rating: any) => {
      totalRatings += rating.rating;
      ratingCount += 1;
    });
  });

  return ratingCount > 0 ? totalRatings / ratingCount : 0;
};
