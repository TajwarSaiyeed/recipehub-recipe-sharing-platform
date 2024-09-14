"use client";
import { FC } from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormNumberInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
};

const FormNumberInput: FC<FormNumberInputProps> = ({
  control,
  name,
  label,
  placeholder,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            onChange={(e) => {
              if (e.target.value) field.onChange(parseInt(e.target.value));
              else field.onChange(0);
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormNumberInput;
