import prisma from "@/lib/prisma";
import RecipeCard from "@/components/recipe-card";

const Page =async () => {
    const recipes = await prisma.recipe.findMany({
        include: {
            category: true,
            tags: true,
            author: true,
            favUsers: true,
            reviews: true,
        },
    });
    return (
        <>
            <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe}/>
                ))}
            </section>
        </>
    );
};

export default Page;
