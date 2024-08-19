import {FC} from "react";
import {Control} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Category} from "@prisma/client";

type FormSelectInputProps = {
    control: Control<any>;
    name: string;
    label: string;
    options: Category[];
};

const FormSelectInput: FC<FormSelectInputProps> = ({ control, name, label, options }) => (
    <FormField control={control} name={name} render={({ field }) => (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
        </FormItem>
    )} />
);

export default FormSelectInput;
