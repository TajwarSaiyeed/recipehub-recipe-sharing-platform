"use client";
import Link from "next/link";
import {
  Bookmark,
  LogOutIcon,
  SearchIcon,
  UserIcon,
  Utensils,
} from "lucide-react";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedValue = useDebounce(searchQuery);
  const router = useRouter();
  const session = useSession();

  console.log("[Navbar] session", session);

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
    <header className="flex items-center justify-between bg-background px-4 py-3 shadow-sm md:px-6">
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

      <div className="flex items-center">
        {session.status === "unauthenticated" ? (
          <Link
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 lg:hidden"
            prefetch={false}
          >
            Sign In
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.data?.user?.image || ""} />
                  <AvatarFallback>
                    {session.data?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.data?.user?.image || ""} />
                  <AvatarFallback>
                    {session.data?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 leading-none">
                  <div className="font-semibold">
                    {session.data?.user?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.data?.user?.email}
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/me/profile"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/me/recipes"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <Utensils className="h-4 w-4" />
                  <span>My Recipes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/me/favorites"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <Bookmark className="h-4 w-4" />
                  <span>My Favorites</span>
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
        )}
      </div>
    </header>
  );
};

export default Navbar;
