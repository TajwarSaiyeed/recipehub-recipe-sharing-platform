"use client";
import { FC } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormInstructionsInputProps = {
  control: Control<any>;
  register: any;
};

const FormInstructionsInput: FC<FormInstructionsInputProps> = ({
  control,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructions",
  });

  return (
    <FormField
      control={control}
      name="instructions"
      render={() => (
        <FormItem className={"flex flex-col gap-2"}>
          {!!fields && <FormLabel>Instructions</FormLabel>}
          <div>
            {fields.map((item, index) => (
              <div key={item.id} className="flex gap-4 my-2">
                <FormControl>
                  <Input
                    placeholder="Instruction"
                    {...register(`instructions.${index}`)}
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
          </div>
          <Button
            type={"button"}
            variant="secondary"
            onClick={() => append("")}
          >
            Add Instruction
          </Button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInstructionsInput;
