import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import { FC } from "react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import RecipeHeader from "./components/recipe-header";
import RecipeDetails from "./components/recipe-details";
import Ingredients from "./components/ingredients";
import Instructions from "./components/instructions";
import RecipeTags from "./components/recipe-tags";
import RecipeActions from "./components/recipe-actions";
import getSession from "@/lib/get-session";
import SimilarRecipes from "./components/similar-recipes";

interface RecipePageProps {
  params: {
    recipeid: string;
  };
}

const RecipePage: FC<RecipePageProps> = async ({ params: { recipeid } }) => {
  const session = await getSession();
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeid,
    },
    include: {
      category: true,
      tags: true,
      ratings: true,
      favUsers: true,
    },
  });

  if (!recipe) {
    toast.error("Recipe not found", {
      description: "The recipe you are looking for does not exist.",
    });
    redirect("/");
  }

  const recipeImage = recipe.image;
  const {
    title,
    description,
    instructions,
    prepTime,
    cookTime,
    servings,
    tags,
    category,
    ratings,
  } = recipe;
  const ingredients = recipe?.ingredients as
    | { name: string; quantity: string }[]
    | null;
  const isSavedForLater = recipe.favUsers.some(
    (user) => user.id === session?.user.id
  );

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Image
              src={recipeImage || "/placeholder.svg"}
              width={800}
              height={600}
              alt="Recipe Image"
              className="w-full rounded-lg object-cover"
              style={{ aspectRatio: "800/600", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-6">
            <RecipeHeader
              title={title}
              rating={
                ratings.reduce((acc, rating) => acc + rating.rating, 0) /
                  ratings.length || 0
              }
              reviews={ratings.length}
            />
            <RecipeDetails
              prepTime={prepTime}
              cookTime={cookTime}
              servings={servings}
              category={category.name}
            />
            <Ingredients ingredients={ingredients} />
            <Instructions instructions={instructions} />
          </div>
        </div>
        <SimilarRecipes
          title={title}
          category={category.name}
          tags={tags}
          recipeId={recipeid}
        />
        <div className="mt-12">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">John Doe</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <StarIcon className="h-4 w-4 fill-primary" />
                    <span>5</span>
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">
                  This recipe is absolutely delicious! The chicken is so tender
                  and the sauce is creamy and flavorful. I&apos;ll definitely be
                  making this again.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Sarah Anderson</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <StarIcon className="h-4 w-4 fill-primary" />
                    <span>4</span>
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">
                  I really enjoyed this recipe. The garlic and Parmesan flavors
                  complement the chicken perfectly. The only thing I would
                  change is to add a bit more seasoning to the chicken.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-between gap-4">
          <RecipeActions
            recipeId={recipeid}
            isSavedForLater={isSavedForLater}
          />
          <RecipeTags tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
