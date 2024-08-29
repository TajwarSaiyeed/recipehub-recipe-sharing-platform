import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const RecipeCardSkeleton: FC = () => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-lg group">
      <div>
        <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
          <Skeleton className="w-full h-full rounded-xl object-cover" />
          <Skeleton className="absolute w-6 h-6 right-2 top-2 rounded-full" />
        </div>
        <div className="p-2">
          <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
      </div>
      <div>
        <Skeleton className="flex items-center gap-1 px-1 py-2 w-1/2 rounded-md" />
        <div className="flex gap-2 flex-wrap items-start justify-between px-1 py-2 bg-background">
          <div className="flex items-center gap-1">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 w-8 rounded-md" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
