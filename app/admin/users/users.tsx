"use client";

import { FC } from "react";
import UsersCard from "@/components/users-card";
import SearchBar from "@/components/search-bar";
import { UserWithRecipes } from "@/types/types";
import MaxWidthWrapper from "@/components/max-width-wrapper";

type UsersProps = {
  users: UserWithRecipes[];
};

const Users: FC<UsersProps> = ({ users }) => {
  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <SearchBar placeholder="Search users" queryKey="query" />
      </div>
      <div className={"grid lg:grid-cols-3 gap-2 sm:grid-cols-2 grid-cols-1"}>
        {users.map((user) => (
          <UsersCard key={user.id} user={user} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default Users;
