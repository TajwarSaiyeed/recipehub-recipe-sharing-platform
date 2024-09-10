"use client";
import Link from "next/link";
import qs from "query-string";
import { useRouter } from "next/navigation";
import UserNav from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { SearchIcon, Utensils } from "lucide-react";
import MaxWidthWrapper from "@/components/max-width-wrapper";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery);
  const router = useRouter();

  useEffect(() => {
    if (!debouncedValue) {
      return;
    }
    const queryParams = {
      search: debouncedValue,
    };

    const url = qs.stringifyUrl(
      {
        url: "/recipes",
        query: queryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
    router.push(url);
  }, [router, debouncedValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={"bg-white dark:bg-popover sticky z-50 top-0 inset-x-0 h-20"}
    >
      <header className={"relative bg-white dark:bg-popover"}>
        <MaxWidthWrapper>
          <div
            className={
              "border-b border-gray-200 flex justify-between items-center px-4 py-3"
            }
          >
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Utensils className="h-6 w-6" />
              <span className="hidden sm:inline text-lg font-semibold">
                Recipe Hub
              </span>
            </Link>
            <div className="relative flex-1 max-w-md hidden lg:block">
              <Input
                type="search"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <SearchIcon className={"absolute right-2 top-2"} />
            </div>
            <UserNav />
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
