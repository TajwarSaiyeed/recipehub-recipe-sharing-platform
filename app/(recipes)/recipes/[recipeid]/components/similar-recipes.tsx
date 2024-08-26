"use client";

import Link from "next/link";
import { Tag } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface SimilarRecipesProps {
  title: string;
  category: string;
  tags: Tag[];
  recipeId: string;
}

const SimilarRecipes: FC<SimilarRecipesProps> = ({
  title,
  category,
  tags,
  recipeId,
}) => {
  const [similarRecipes, setSimilarRecipes] = useState([]);

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      try {
        const response = await axios.post("/api/recipes/similar-recipes", {
          title,
          category,
          tags,
          recipeId,
        });

        return response.data.similarRecipes;
      } catch (error) {
        console.error("Error fetching similar recipes:", error);
      }
    };

    fetchSimilarRecipes().then((r) => setSimilarRecipes(r));
  }, [title, category, tags, recipeId]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold">Similar Recipes</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {similarRecipes.map((recipe: any) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="group block overflow-hidden rounded-lg"
            prefetch={false}
          >
            <Image
              src={recipe.image || "/placeholder.svg"}
              width={400}
              height={300}
              alt={recipe.title}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ aspectRatio: "400/300", objectFit: "cover" }}
            />
            <div className="mt-3 space-y-1">
              <h3 className="text-lg font-medium transition-colors group-hover:text-primary">
                {recipe.title}
              </h3>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarRecipes;
