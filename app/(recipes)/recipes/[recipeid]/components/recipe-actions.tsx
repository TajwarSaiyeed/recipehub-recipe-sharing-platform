"use client";
import { toast } from "sonner";
import { FC, useState } from "react";
import { onCopy } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { SaveForLater } from "@/actions/save-for-later";
import { Bookmark, LoaderCircle, ShareIcon } from "lucide-react";

interface RecipeActionsProps {
  recipeId: string;
  isSavedForLater: boolean;
}

const RecipeActions: FC<RecipeActionsProps> = ({
  recipeId,
  isSavedForLater,
}) => {
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();

  const handleSaveForLater = async () => {
    try {
      setLoading(true);
      const save = await SaveForLater(recipeId, pathName);
      if (save?.status) {
        toast.success("Success", {
          description: save.message,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to save recipe for later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await onCopy(window.location.href);
        }}
      >
        <ShareIcon className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button
        onClick={handleSaveForLater}
        size="sm"
        variant={isSavedForLater ? "default" : "outline"}
      >
        {loading ? (
          <>
            <LoaderCircle className={"w-4 h-4 mr-2 animate-spin"} />
            {!isSavedForLater ? "Saving..." : "Removing..."}
          </>
        ) : isSavedForLater ? (
          <>
            <Bookmark className="h-4 w-4 mr-2 fill-white" /> Saved
          </>
        ) : (
          <>
            {" "}
            <Bookmark className="h-4 w-4 mr-2" />
            Save Recipe
          </>
        )}
      </Button>
    </div>
  );
};

export default RecipeActions;
