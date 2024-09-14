"use client";
import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useEffect, useState } from "react";
import { Category, Recipe, Tag, User } from "@prisma/client";
import {
  FormImageInput,
  FormIngredientsInput,
  FormInstructionsInput,
  FormNumberInput,
  FormSelectInput,
  FormTagSelector,
  FormTextInput,
  FormWrapper,
} from "@/components/recipe-form-components";
import supabase from "@/lib/supabase/client";
import { UpdateRecipe } from "../action";

type UpdateRecipeFormProps = {
  categories: Category[];
  tags: Tag[];
  recipe: Recipe & {
    category: Category;
    tags: Tag[];
    author: User;
  };
};

export const updateRecipeFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z.string().min(1, "Ingredient quantity is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string().min(1, "Instruction is required"))
    .min(1, "At least one instruction is required"),
  prepTime: z.number().positive("Prep time must be positive"),
  cookTime: z.number().positive("Cook time must be positive"),
  servings: z.number().positive("Servings must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string().min(1)),
  image: z.any().optional(),
});

export type UpdateRecipeFormData = z.infer<typeof updateRecipeFormSchema>;

const UpdateRecipeForm: FC<UpdateRecipeFormProps> = ({
  categories,
  tags,
  recipe,
}) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [imageFile, setImageFile] = useState<File | string | null>(
    recipe.image
  );
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((ingredient: any) => ({
        name: ingredient?.name || "",
        quantity: ingredient?.quantity || "",
      }))
    : [{ name: "", quantity: "" }];

  const form = useForm<UpdateRecipeFormData>({
    resolver: zodResolver(updateRecipeFormSchema),
    defaultValues: {
      id: recipe.id,
      title: recipe.title,
      description: recipe?.description || "",
      ingredients: ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      servings: recipe.servings || 0,
      categoryId: recipe.categoryId || "",
      tags: recipe.tags.map((tag: Tag) => tag.name) || [],
      image: recipe.image || null,
    },
  });

  const { control, handleSubmit, watch, register, setValue } = form;

  useEffect(() => {
    const watchTags = watch("tags");
    if (watchTags) {
      const selectedTags = tags.filter((tag) => watchTags.includes(tag.name));
      setSelectedTags(selectedTags);
    }
  }, [tags, watch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImageFile(files[0]);
      setValue("image", files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setValue("image", null);
  };

  async function onSubmit(data: UpdateRecipeFormData) {
    try {
      if (selectedTags.length === 0) {
        toast.error("Select at least one tag", { duration: 5000 });
        return;
      }

      if (imageFile === null) {
        toast.error("Select an image", { duration: 5000 });
        return;
      }

      if (recipe?.image && recipe.image !== imageFile) {
        const isRecipe = recipe.image.split("/").includes("recipe-images");
        const url = recipe.image.split("/").pop();
        await supabase.storage
          .from("images")
          .update(`recipe-images/${url}`, imageFile);
      }

      await UpdateRecipe(data, recipe.authorId);
      toast.success("Recipe updated successfully", { duration: 5000 });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Update Recipe</h1>
          <p className="text-muted-foreground">
            Update your recipe details here to share with the world.
          </p>
        </div>
        <FormWrapper form={form} onSubmit={handleSubmit(onSubmit)}>
          <FormTextInput
            control={control}
            name="title"
            label="Title"
            placeholder="Enter recipe title"
          />
          <FormTextInput
            control={control}
            name="description"
            label="Description"
            placeholder="Describe your recipe"
            textarea
            rows={3}
          />
          <FormSelectInput
            control={control}
            name="categoryId"
            label="Category"
            options={categories}
          />
          <FormIngredientsInput control={control} register={register} />
          <FormInstructionsInput control={control} register={register} />
          <div className={"flex flex-warp gap-2"}>
            <FormNumberInput
              control={control}
              name="prepTime"
              label="Prep Time"
              placeholder="Minutes"
            />
            <FormNumberInput
              control={control}
              name="cookTime"
              label="Cook Time"
              placeholder="Minutes"
            />
            <FormNumberInput
              control={control}
              name="servings"
              label="Servings"
              placeholder="Number of servings"
            />
          </div>
          <FormTagSelector
            control={control}
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <FormImageInput
            control={control}
            imageFile={imageFile}
            handleFileChange={handleFileChange}
            removeImage={removeImage}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Update Recipe
          </Button>
        </FormWrapper>
      </div>
    </div>
  );
};

export default UpdateRecipeForm;
