import prisma from "@/lib/prisma";
import FilterByCategoryTags from "./components/filter-by-category-tags";
import { getRecipesWithCategoryOrTags } from "@/actions/get-recipes-with-category-or-tags";

const Page = async ({
  searchParams,
}: {
  searchParams: { search: string; category?: string; tags?: string };
}) => {
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  const category = searchParams.category;
  const tagsArray = searchParams.tags ? searchParams.tags.split(",") : [];

  let query = searchParams.search || "";
  const { recipes, totalCount, page, totalPages } =
    await getRecipesWithCategoryOrTags(query, category, tagsArray);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
        <p className="text-muted-foreground">
          Discover a world of delicious recipes shared by our community.
        </p>
      </div>
      <FilterByCategoryTags
        categories={categories}
        tags={tags}
        recipes={recipes}
        category={category}
        tagsArray={tagsArray}
      />
    </div>
  );
};

export default Page;
