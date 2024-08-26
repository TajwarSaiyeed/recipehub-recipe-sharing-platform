"use client";
import React, { FC } from "react";
import { CheckIcon } from "lucide-react";

interface IngredientsProps {
  ingredients:
    | {
        name: string;
        quantity: string;
      }[]
    | null;
}

const Ingredients: FC<IngredientsProps> = ({ ingredients }) => {
  if (!ingredients) {
    return <p>No ingredients available.</p>;
  }

  return (
    <div className={"space-y-2"}>
      <h2 className="text-lg font-medium">Ingredients</h2>
      <ul className="space-y-2 text-muted-foreground">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            <CheckIcon className="mr-2 inline-block h-4 w-4" />
            {ingredient.name} {ingredient.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;
