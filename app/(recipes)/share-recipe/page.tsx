import React from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import RecipeForm from "./recipe-form";
import { redirect } from "next/navigation";

const ShareRecipePage = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in?callbackUrl=/share-recipe");

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return <RecipeForm categories={categories} tags={tags} />;
};

export default ShareRecipePage;
