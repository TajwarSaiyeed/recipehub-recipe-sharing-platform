"use client";
import { FC } from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormTextInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
  rows?: number;
};

const FormTextInput: FC<FormTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  textarea = false,
  rows,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {textarea ? (
            <Textarea placeholder={placeholder} rows={rows} {...field} />
          ) : (
            <Input placeholder={placeholder} {...field} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormTextInput;
