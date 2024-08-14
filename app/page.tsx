import { signOut } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const recepies = await prisma.recipe.findMany({
    include: {
      tags: true,
      category: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>Logout</Button>
      </form>
      <Link
        href={"/sign-in"}
        className={buttonVariants({
          variant: "destructive",
        })}
      >
        Sign in
      </Link>
    </main>
  );
}
