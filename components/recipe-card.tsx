"use client";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarIcon, TagIcon, User2Icon } from "lucide-react";
import { Category, Rating, Recipe, Tag, User } from "@prisma/client";

type RecipeWithCategoryTags = Recipe & {
  category: Category;
  tags: Tag[];
  ratings: Rating[];
  author: User;
};

interface RecipeCardProps {
  recipe: RecipeWithCategoryTags;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-lg group">
      <div>
        <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
          <Link href={`/recipes/${recipe.id}`}>
            <Image
              src={recipe.image || ""}
              alt={recipe.title}
              fill
              loading={"lazy"}
              className={
                "object-cover w-full h-full border border-zinc-100 rounded-xl"
              }
            />
          </Link>
        </div>
        <div className="p-2">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className="text-lg font-semibold md:text-xl">{recipe.title}</h3>
            <p className="text-sm text-muted-foreground">
              {recipe.description}
            </p>
          </Link>
        </div>
      </div>
      <div>
        <Link
          href={`/users/${recipe.author.id}`}
          className="flex items-center gap-1 text-muted-foreground px-1 py-2 "
        >
          <User2Icon className="w-5 h-5" />
          <div className="text-sm text-muted-foreground truncate">
            {recipe.author.name}
          </div>
        </Link>
        <div className="flex items-center justify-between px-1 py-2 bg-background">
          <div className="flex items-center gap-1 text-primary">
            <StarIcon className="w-5 h-5" />
            <div className="font-medium">
              {recipe.ratings.length > 0
                ? (
                    recipe.ratings.reduce(
                      (acc, rating) => acc + rating.rating,
                      0
                    ) / recipe.ratings.length
                  ).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-muted-foreground">/5</div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TagIcon className="w-5 h-5" />
            <div className="font-medium ">{recipe.category.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
