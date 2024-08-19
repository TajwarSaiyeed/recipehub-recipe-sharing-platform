import prisma from "@/lib/prisma";
import React from "react";
import RecipeForm from "./recipe-form";
import getSession from "@/lib/get-session";
import { redirect } from "next/navigation";

const AddRecipePage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return <RecipeForm categories={categories} tags={tags} />;
};

export default AddRecipePage;
