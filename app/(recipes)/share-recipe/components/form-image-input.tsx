"use client";
import { FC } from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";

type FormImageInputProps = {
  control: Control<any>;
  imageFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
};

const FormImageInput: FC<FormImageInputProps> = ({
  control,
  imageFile,
  handleFileChange,
  removeImage,
}) => (
  <FormField
    control={control}
    name="image"
    render={() => (
      <FormItem>
        <FormLabel>Image</FormLabel>
        <FormControl>
          {imageFile ? (
            <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
              <Image
                fill
                loading={"lazy"}
                src={URL.createObjectURL(imageFile)}
                alt="Selected"
                className={
                  "object-cover w-64 h-64 border border-zinc-100 rounded-xl"
                }
              />
              <Button
                type="button"
                size={"icon"}
                onClick={removeImage}
                className={"absolute top-2 right-2"}
              >
                <Trash2Icon />
              </Button>
            </div>
          ) : (
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormImageInput;
