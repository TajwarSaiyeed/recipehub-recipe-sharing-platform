import React from "react";
import { getUserDetails } from "@/actions/get-user-details-with-avg-rating";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/recipe-card";
import MaxWidthWrapper from "@/components/max-width-wrapper";

interface UserPageProps {
  params: {
    userId: string;
  };
}

const Page = async ({ params: { userId } }: UserPageProps) => {
  if (!userId) return redirect("/");
  const { user, avgRating } = await getUserDetails(userId);
  if (!user) return redirect("/");

  return (
    <MaxWidthWrapper>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-[1fr_3fr] gap-8 md:gap-12">
          <div className="flex flex-col items-center gap-6">
            <div
              className={
                "relative h-24 w-24 md:w-32 md:h-32 rounded-full overflow-hidden"
              }
            >
              <Image
                src={user?.image || ""}
                alt={user?.name || ""}
                loading={"lazy"}
                fill
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <div className="grid gap-1 text-center">
              <h3 className="text-2xl md:text-3xl font-bold">{user?.name}</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {user?.email}
              </p>
              <Separator className={"my-5"} />
              <div className={"flex justify-between items-center"}>
                <div className="flex items-center gap-1 text-primary">
                  <StarIcon className="w-5 h-5" />
                  <div className="font-medium">{avgRating.toFixed(2)}</div>
                  <div className="text-muted-foreground">/5</div>
                </div>
                <div className="text-sm md:text-base font-medium">
                  <span className="text-primary">{user?.recipes.length}</span>
                  {user?.recipes.length && user?.recipes.length > 1
                    ? " Recipes"
                    : " Recipe"}
                </div>
              </div>
            </div>
          </div>
          <div className={"flex flex-col justify-center items-center"}>
            <div className="grid gap-8 md:gap-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {user?.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
            <Separator className={"my-8"} />
            <Button size="lg">View More Recipes</Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
