import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
  try {
    const {
      tagNames,
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      categoryId,
        authorId
    } = await req.json();
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          in: tagNames,
        },
      },
    });
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions,
        prepTime,
        cookTime,
        servings,
        category: { connect: { id: categoryId } },
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        category: true,
        tags: true,
        author: true,
      },
    });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json(new Error("Failed to create tags"));
  }
};

export const GET = auth(async (req) => {
  const recipes = await prisma.recipe.findMany({
    include: {
      tags: true,
      category: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      recipes,
    },
    {
      status: 200,
    }
  );
});
