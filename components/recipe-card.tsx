"use client";
import Link from "next/link";
import { toast } from "sonner";
import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { SaveForLater } from "@/actions/save-for-later";
import CustomTooltip from "@/components/custom-tooltip";
import { Category, Recipe, Tag, User } from "@prisma/client";
import { Bookmark, LoaderCircle, Pen, StarIcon, TagIcon } from "lucide-react";

export type RecipeWithCategoryTags = Recipe & {
  category: Category;
  tags: Tag[];
  author: User;
  favUsers: User[];
};

interface RecipeCardProps {
  recipe: RecipeWithCategoryTags;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const pathName = usePathname();

  const isSavedForLater = recipe.favUsers.some(
    (user) => user.id === session.data?.user?.id
  );
  const handleSaveForLater = async () => {
    try {
      setLoading(true);
      const save = await SaveForLater(recipe.id, pathName);
      if (save?.status) {
        toast.success("Success", {
          description: save.message,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to save recipe for later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-lg group">
      <div>
        <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
          <Link href={`/recipes/${recipe.id}`}>
            {/*<Image*/}
            {/*  src={`${recipe.image || ""}?${new Date().getTime()}`}*/}
            {/*  alt={recipe.title}*/}
            {/*  fill*/}
            {/*  loading={"lazy"}*/}
            {/*  className={*/}
            {/*    "object-cover w-64 h-64 border border-zinc-100 rounded-xl"*/}
            {/*  }*/}
            {/*/>*/}
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${recipe.image || ""}?${new Date().getTime()}`}
                alt={recipe.title}
                className={
                  "object-cover w-full h-full border border-zinc-100 rounded-xl"
                }
                loading={"lazy"}
              />
            </div>
          </Link>
          {pathName != "/me/recipes" ? (
            <CustomTooltip content={"Save for later"}>
              <Button
                onClick={handleSaveForLater}
                className={"rounded-full w-6 h-6 absolute right-2 top-2"}
                variant={isSavedForLater ? "default" : "outline"}
                size={"icon"}
              >
                {loading ? (
                  <LoaderCircle className={"w-4 h-4 animate-spin"} />
                ) : (
                  <Bookmark className={"w-4 h-4"} />
                )}
              </Button>
            </CustomTooltip>
          ) : (
            <CustomTooltip content={"Update the recipe"}>
              <Link
                href={"/me/update-recipe/" + recipe.id}
                className={buttonVariants({
                  className: "rounded-full w-6 h-6 absolute right-2 top-2",
                  variant: "default",
                  size: "icon",
                })}
              >
                <Pen className={"w-4 h-4"} />
              </Link>
            </CustomTooltip>
          )}
        </div>
        <div className="p-2">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className="text-[16px] sm:text-lg font-semibold md:text-xl">
              {recipe.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {recipe.description}
            </p>
          </Link>
        </div>
      </div>
      <div>
        <Link
          href={`/user/${recipe.author.id}`}
          className="flex items-center gap-1 text-muted-foreground px-1 py-2 "
        >
          {/*<Image*/}
          {/*  src={`${recipe.author.image || ""}?${new Date().getTime()}`}*/}
          {/*  alt={recipe.author.name || ""}*/}
          {/*  width={16}*/}
          {/*  height={16}*/}
          {/*  className={"rounded-full"}*/}
          {/*/>*/}
          <div className={"relative w-5 h-5 rounded-full overflow-hidden"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${recipe.author.image || ""}?${new Date().getTime()}`}
              alt={recipe.author.name || ""}
              className={"rounded-full w-full h-full object-cover"}
            />
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {recipe.author.name}
          </div>
        </Link>
        <div className="flex gap-2 flex-wrap items-start justify-between px-1 py-2 bg-background">
          <div className="flex items-center gap-1 text-primary">
            <StarIcon className="w-5 h-5" />
            <div className="font-medium">{recipe.avgRating.toFixed(1)}</div>
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
