"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  Utensils,
} from "lucide-react";
import qs from "query-string";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const queryParams = {
      search: debouncedValue,
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
  }, [router, debouncedValue, pathName]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="flex items-center justify-between bg-background px-4 py-3 shadow-sm md:px-6">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Utensils className="h-6 w-6" />
        <span className="text-lg font-semibold">Recipe Hub</span>
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

      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 lg:hidden"
          prefetch={false}
        >
          Sign In
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 leading-none">
                <div className="font-semibold">John Doe</div>
                <div className="text-sm text-muted-foreground">
                  john@example.com
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href="/profile"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/settings"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href="/logout"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Sign out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="lg:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
