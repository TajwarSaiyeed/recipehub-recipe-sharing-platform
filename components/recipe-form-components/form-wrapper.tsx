"use client";
import { FC, ReactNode } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";

type FormWrapperProps = {
  form: UseFormReturn<any>;
  children: ReactNode;
  onSubmit: () => void;
};

const FormWrapper: FC<FormWrapperProps> = ({ form, children, onSubmit }) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="grid gap-6">
        {children}
      </form>
    </FormProvider>
  );
};

export default FormWrapper;
