"use client";
import { FC } from "react";
import { Control, useFormContext } from "react-hook-form";
import { Tag } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormTagSelectorProps = {
  control: Control<any>;
  tags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
};

const FormTagSelector: FC<FormTagSelectorProps> = ({
  control,
  tags,
  selectedTags,
  setSelectedTags,
}) => {
  const { setValue } = useFormContext();
  const handleTagToggle = (tag: Tag) => {
    const newSelectedTags = selectedTags.some((t) => t.id === tag.id)
      ? selectedTags.filter((t) => t.id !== tag.id)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    setValue(
      "tags",
      newSelectedTags.map((t) => t.id)
    );
  };

  return (
    <FormField
      control={control}
      name="tags"
      render={() => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  type={"button"}
                  variant={
                    selectedTags.some((t) => t.id === tag.id)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTagSelector;
