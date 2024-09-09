import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in?callbackUrl=/me/favourites");

  return <div>Profile page</div>;
};

export default Profile;
