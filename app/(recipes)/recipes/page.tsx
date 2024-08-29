import prisma from "@/lib/prisma";
import FilterByCategoryTags from "./components/filter-by-category-tags";

const Page = async () => {
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
        <p className="text-muted-foreground">
          Discover a world of delicious recipes shared by our community.
        </p>
      </div>
      <FilterByCategoryTags categories={categories} tags={tags} />
    </div>
  );
};

export default Page;
