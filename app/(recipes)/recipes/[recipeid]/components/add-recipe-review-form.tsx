"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import React, { FC } from "react";
import { StarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { addReview } from "@/app/(recipes)/recipes/[recipeid]/action";

interface AddReviewFormProps {
  recipeId: string;
  reviewIsExists: boolean;
  setToggle: (toggle: (toggle: any) => boolean) => void;
}

export const reviewFormSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1, "Please enter a review"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

const AddReviewForm: FC<AddReviewFormProps> = ({
  recipeId,
  reviewIsExists,
  setToggle,
}) => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });

  const { watch, setValue } = form;
  const pathName = usePathname();

  const rating = watch("rating");

  const handleAddRecipe = async (review: ReviewFormData) => {
    try {
      await addReview({
        review,
        recipeId,
        pathName,
      });
      toast.success("Review added successfully", {
        description: "Your review has been added successfully.",
      });
    } catch (error: Error | any) {
      toast.error("Failed to add review", {
        description: error.message,
      });
    } finally {
      form.reset();
      setToggle((toggle) => !toggle);
    }
  };

  if (reviewIsExists)
    return (
      <p className="text-lg mt-3 text-muted-foreground">
        You have already reviewed this recipe.
      </p>
    );

  return (
    <div className="mt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddRecipe)}
          className="space-y-4"
        >
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FormControl key={star}>
                      <StarIcon
                        className={`h-5 w-5 cursor-pointer ${
                          star <= rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setValue("rating", star)}
                        {...field}
                      />
                    </FormControl>
                  ))}
                </div>
              </FormItem>
            )}
            name={"rating"}
          />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="Share your thoughts on this recipe..."
                  ></textarea>
                </FormControl>
              </FormItem>
            )}
            name={"content"}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddReviewForm;
