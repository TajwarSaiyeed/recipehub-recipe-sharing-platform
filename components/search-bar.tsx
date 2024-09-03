"use client";
import { FC, useEffect, useState } from "react";
import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

type SearchBarProps = {
  placeholder: string;
  queryKey: string;
  additionalParams?: Record<string, string | null>;
  cuisineTypesCategories?: string[];
  mealTypesCategories?: string[];
  coursesCategories?: string[];
};

const SearchBar: FC<SearchBarProps> = ({
  placeholder,
  queryKey,
  additionalParams = {},
  cuisineTypesCategories,
  mealTypesCategories,
  coursesCategories,
}) => {
  const [value, setValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const debouncedValue = useDebounce(value);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const queryParams = {
      ...additionalParams,
      [queryKey]: debouncedValue,
      category: selectedCategory,
    };

    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: queryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
    router.push(url);
  }, [
    router,
    debouncedValue,
    selectedCategory,
    pathName,
    additionalParams,
    queryKey,
  ]);

  return (
    <div className="flex justify-between items-center">
      <div className="relative mt-4">
        <Search className="absolute top-3 left-3 transform h-4 w-4 text-slate-600" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full md:max-w-[500px] pl-9 rounded-lg bg-slate-100 focus-visible:ring-slate-200 dark:bg-slate-800 dark:focus-visible:ring-slate-700"
          placeholder={placeholder}
        />
      </div>
      {(cuisineTypesCategories || mealTypesCategories || coursesCategories) && (
        <Select
          onValueChange={(value) =>
            setSelectedCategory(value === "All Categories" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{selectedCategory || "All Categories"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Categories">All Categories</SelectItem>
            {cuisineTypesCategories && (
              <SelectGroup>
                <SelectLabel>Cuisine Types</SelectLabel>
                {cuisineTypesCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            {mealTypesCategories && (
              <SelectGroup>
                <SelectLabel>Meal Types</SelectLabel>
                {mealTypesCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            {coursesCategories && (
              <SelectGroup>
                <SelectLabel>Courses</SelectLabel>
                {coursesCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SearchBar;
