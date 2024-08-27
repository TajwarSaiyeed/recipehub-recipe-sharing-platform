import prisma from "@/lib/prisma";
import { Tag } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { category, tags, recipeId } = body;

    const similarRecipes = await prisma.recipe.findMany({
      where: {
        AND: [
          {
            OR: [
              { category: { name: category } },
              {
                tags: {
                  some: { name: { in: tags.map((tag: Tag) => tag.name) } },
                },
              },
            ],
          },
          { id: { not: recipeId } },
        ],
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (similarRecipes.length === 0) {
      const randomRecipes = await prisma.recipe.findMany({
        where: {
          id: { not: recipeId },
        },
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(
        { similarRecipes: randomRecipes, similar_found: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { similarRecipes, similar_found: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/recipes/similar-recipes] Error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
