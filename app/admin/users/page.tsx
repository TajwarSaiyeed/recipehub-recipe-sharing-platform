import Users from "./users";
import { auth } from "@/auth";
import { users } from "./action";
import { redirect } from "next/navigation";

export const revalidate = 1;

const Page = async ({ searchParams }: { searchParams?: string }) => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  if (session.user.role !== "Admin")return redirect("/");

  const limit = new URLSearchParams(searchParams).get("limit") || 20;
  const page = new URLSearchParams(searchParams).get("page") || 1;
  const query = new URLSearchParams(searchParams).get("query") || "";
  const u = await users(+page, +limit, query);

  return <Users users={u} />
};

export default Page;
