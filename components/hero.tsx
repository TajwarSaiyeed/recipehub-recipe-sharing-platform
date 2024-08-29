"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-foreground py-12 md:py-24 lg:py-32 my-5 rounded-xl overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/recipe-billboard.jpg"
          alt="Hero"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-2xl font-bold tracking-tighter text-primary-foreground sm:text-5xl xl:text-6xl">
            Discover Delicious Recipes
          </h1>
          <p className="mt-4 max-w-[600px] mx-auto text-primary-foreground/80 md:text-xl">
            Explore a world of culinary inspiration with our recipe-sharing
            platform. Find the perfect dish for any occasion.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/recipes"
              className={buttonVariants({
                variant: "default",
                size: "lg",
              })}
              prefetch={false}
            >
              Browse Recipes
            </Link>
            <Link
              href="/share-recipe"
              prefetch={false}
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
              })}
            >
              Share a Recipe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
