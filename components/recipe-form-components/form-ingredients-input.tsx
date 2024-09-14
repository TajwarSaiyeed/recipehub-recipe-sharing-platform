"use client";
import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormIngredientsInputProps = {
  control: Control<any>;
  register: any;
};

const FormIngredientsInput: FC<FormIngredientsInputProps> = ({
  control,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <FormField
      control={control}
      name="ingredients"
      render={() => (
        <FormItem className={"flex flex-col"}>
          {!!fields && <FormLabel>Ingredients</FormLabel>}
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <FormControl>
                <Input
                  placeholder="Ingredient Name"
                  {...register(`ingredients.${index}.name` as const)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Quantity"
                  {...register(`ingredients.${index}.quantity` as const)}
                />
              </FormControl>
              <Button
                type={"button"}
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type={"button"}
            variant="secondary"
            onClick={() => append({ name: "", quantity: "" })}
          >
            Add Ingredient
          </Button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormIngredientsInput;
