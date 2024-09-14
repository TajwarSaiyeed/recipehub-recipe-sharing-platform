import React from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UpdateRecipeForm from "./components/update-recipe-form";

interface UpdateRecipePageProps {
  params: {
    recipeid: string;
  };
}

const UpdateRecipePage = async ({
  params: { recipeid },
}: UpdateRecipePageProps) => {
  const session = await auth();
  if (!session)
    return redirect("/sign-in?callbackUrl=/update-recipe/" + recipeid);

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeid,
    },
    include: {
      tags: true,
      category: true,
      author: true,
    },
  });

  if (!recipe) return redirect("/404");

  return (
    <UpdateRecipeForm categories={categories} tags={tags} recipe={recipe} />
  );
};

export default UpdateRecipePage;
