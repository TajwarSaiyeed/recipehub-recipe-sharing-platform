"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Tag } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface SimilarRecipesProps {
  category: string;
  tags: Tag[];
  recipeId: string;
}

const SimilarRecipes: FC<SimilarRecipesProps> = ({
  category,
  tags,
  recipeId,
}) => {
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [similarFound, setSimilarFound] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      try {
        const response = await axios.post("/api/recipes/similar-recipes", {
          category,
          tags,
          recipeId,
        });
        setSimilarFound(response.data.similar_found);
        console.log(
          "[SimilarRecipes] Similar found:",
          response.data.similar_found
        );
        return response.data.similarRecipes;
      } catch (error) {
        console.error("Error fetching similar recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarRecipes().then((data) => setSimilarRecipes(data));

    return () => {
      setLoading(true);
      setSimilarRecipes([]);
      setSimilarFound(false);
    };
  }, [category, tags, recipeId]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold">
        {similarFound ? "Similar Recipes" : "See also"}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="group block overflow-hidden rounded-lg"
              >
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))
          : similarRecipes.map((recipe: any) => (
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
