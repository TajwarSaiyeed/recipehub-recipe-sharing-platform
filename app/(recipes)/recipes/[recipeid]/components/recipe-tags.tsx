"use client";

import Link from "next/link";
import {Tag} from "@prisma/client";
import {FC} from "react";

interface RecipeTagsProps {
  tags: Tag[];
}

const RecipeTags: FC<RecipeTagsProps> = ({ tags }) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span>Tags:</span>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/recipes?tag=${tag.name}`}
          className="rounded-md bg-muted px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
          prefetch={false}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
};

export default RecipeTags;
