import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, category, tags, recipeId } = body;

    console.log("[POST /api/recipes/similar-recipes] Request body: ", body);

    const similarRecipes = await prisma.recipe.findMany({
      where: {
        AND: [
          { category: { name: category } },
          // { tags: { some: { id: { in: tags.map((tag: Tag) => tag.id) } } } },
          { title: { not: title } },
        ],
        NOT: {
          id: recipeId,
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      "[GET /api/recipes/similar-recipes] Similar recipes: ",
      similarRecipes
    );

    return NextResponse.json({ similarRecipes }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/recipes/similar-recipes] Error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
