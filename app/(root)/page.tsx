import prisma from "@/lib/prisma";
import Hero from "@/components/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import RecipesAndFilter from "@/app/(root)/components/recipes-and-filter";

export const revalidate = 1;

export default async function Home({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const categories = await prisma.category.findMany();
  return (
    <MaxWidthWrapper>
      <Hero />
      <RecipesAndFilter categories={categories} query={searchParams.search} />
    </MaxWidthWrapper>
  );
}
