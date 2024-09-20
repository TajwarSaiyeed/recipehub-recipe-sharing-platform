"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EyeIcon, StarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { calculateAverageRating, dateFormatted } from "@/lib/utils";
import { FC } from "react";
import { UserCardProps } from "@/types/types";
import Link from "next/link";

const renderStars = (rating: number) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const emptyStars = totalStars - fullStars;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} className="w-4 h-4 fill-current" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarIcon
        key={`empty-${i}`}
        className="w-4 h-4 fill-muted stroke-muted-foreground"
      />
    );
  }

  return stars;
};

const UsersCard: FC<UserCardProps> = ({ user }) => {
  const date = new Date(user.createdAt);
  const rating = calculateAverageRating(user.recipes);
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
            {renderStars(rating)} {rating.toFixed(1)}
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
      </div>
    </Card>
  );
};

export default UsersCard;
