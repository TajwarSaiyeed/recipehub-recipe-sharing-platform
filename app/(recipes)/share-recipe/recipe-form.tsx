"use client";
import * as z from "zod";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { shareRecipe } from "./action";
import { useForm } from "react-hook-form";
import supabase from "@/lib/supabase/client";
import { Category, Tag } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

type RecipeFormProps = {
  categories: Category[];
  tags: Tag[];
};

export const recipeFormSchema = z.object({
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

export type RecipeFormData = z.infer<typeof recipeFormSchema>;

const RecipeForm: FC<RecipeFormProps> = ({ categories, tags }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [{ name: "", quantity: "" }],
      instructions: [""],
      prepTime: 0,
      cookTime: 0,
      servings: 0,
      categoryId: "",
      tags: [],
      image: null,
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

  async function onSubmit(data: RecipeFormData) {
    try {
      if (selectedTags.length === 0) {
        toast.error("Select at least one tag", { duration: 5000 });
        return;
      }

      if (imageFile === null) {
        toast.error("Select an image", { duration: 5000 });
        return;
      }
      setIsSubmitting(true);

      const res = await supabase.storage
        .from("images")
        .upload(`recipe-images/${uuid()}`, imageFile);
      data.image =
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        "/storage/v1/object/public/" +
        res.data?.fullPath;
      await shareRecipe(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
      router.push("/recipes");
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Share a Recipe</h1>
          <p className="text-muted-foreground">
            Fill out the form below to add a new recipe to your collection.
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
          <Button type="submit" disabled={isSubmitting}>
            Add Recipe
          </Button>
        </FormWrapper>
      </div>
    </div>
  );
};

export default RecipeForm;
