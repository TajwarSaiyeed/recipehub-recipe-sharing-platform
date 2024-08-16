"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EyeIcon, FilePenIcon, StarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { dateFormatted } from "@/lib/utils";
import { FC } from "react";
import { UserCardProps } from "./types";
import Link from "next/link";

const UsersCard: FC<UserCardProps> = ({ user }) => {
  const date = new Date(user.createdAt);
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder-user.jpg" alt="user" />
          <AvatarFallback>
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="font-medium">{user.name}</div>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <div className="flex items-center gap-1 text-sm text-primary">
            <StarIcon className="w-4 h-4" />
            <StarIcon className="w-4 h-4" />
            <StarIcon className="w-4 h-4" />
            <StarIcon className="w-4 h-4 fill-muted stroke-muted-foreground" />
            <StarIcon className="w-4 h-4 fill-muted stroke-muted-foreground" />
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Joined</div>
          <div>{dateFormatted(date)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">Recipes</div>
          <div>{user?.recipes?.length}</div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-end gap-2">
        <Link
          href={`/admin/users/${user.id}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
          })}
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          View
        </Link>
        <Button variant="outline" size="sm">
          <FilePenIcon className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default UsersCard;
