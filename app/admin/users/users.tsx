"use client";

import { FC } from "react";
import UsersCard from "@/app/admin/users/users-card";
import SearchBar from "@/components/search-bar";
import { UserWithRecipes } from "./types";

type UsersProps = {
  users: UserWithRecipes[];
};

const Users: FC<UsersProps> = ({ users }) => {
  return (
    <div>
      <SearchBar placeholder="Search users" queryKey="query" />
      <div className={"grid grid-cols-5 p-5 space-x-2"}>
        {users.map((user) => (
          <UsersCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
