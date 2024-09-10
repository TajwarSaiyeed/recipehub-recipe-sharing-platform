"use client";
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MaxWidthWrapper from "@/components/max-width-wrapper";

const MyLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const path = pathName.split("/").pop();
  return (
    <MaxWidthWrapper>
      <Tabs defaultValue={path} className="max-w-[400px]">
        <TabsList>
          <Link href={"/me/profile"}>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </Link>
          <Link href={"/me/recipes"}>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
          </Link>
          <Link href={"/me/favorites"}>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      {children}
    </MaxWidthWrapper>
  );
};

export default MyLayout;
