import prisma from "@/lib/prisma";
import Hero from "@/components/hero";
import RecipesAndFilter from "@/app/components/recipes-and-filter";

export const revalidate = 1;

export default async function Home({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const categories = await prisma.category.findMany();
  return (
    <>
      <Hero />
      <RecipesAndFilter categories={categories} query={searchParams.search} />
    </>
  );
}
