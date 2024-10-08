import Users from "./users";
import { auth } from "@/auth";
import { users } from "./action";
import { redirect } from "next/navigation";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export const revalidate = 1;

const UsersPage = async ({ searchParams }: { searchParams?: string }) => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  if (session.user.role !== "Admin") return redirect("/");

  const limit = new URLSearchParams(searchParams).get("limit") || 20;
  const page = new URLSearchParams(searchParams).get("page") || 1;
  const query = new URLSearchParams(searchParams).get("query") || "";
  const u = await users(+page, +limit, query);

  return (
    <MaxWidthWrapper>
      <Users users={u} />;
    </MaxWidthWrapper>
  );
};

export default UsersPage;
