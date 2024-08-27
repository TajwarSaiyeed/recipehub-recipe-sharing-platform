import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

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
    recipe.reviews.forEach((review: any) => {
      totalRatings += review.rating;
      ratingCount += 1;
    });
  });

  return ratingCount > 0 ? totalRatings / ratingCount : 0;
};

export const onCopy = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast.success("Copied to the clipboard.");
};
