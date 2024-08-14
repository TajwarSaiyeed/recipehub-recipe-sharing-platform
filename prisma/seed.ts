import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const cuisineTypes = [
    { name: "Italian" },
    { name: "Mexican" },
    { name: "Indian" },
    { name: "Chinese" },
    { name: "Japanese" },
    { name: "French" },
    { name: "Mediterranean" },
    { name: "American" },
    { name: "Thai" },
    { name: "Spanish" },
    { name: "Middle Eastern" },
    { name: "Korean" },
    { name: "Vietnamese" },
    { name: "Greek" },
    { name: "Caribbean" },
    { name: "African" },
    { name: "British" },
  ];

  const mealTypes = [
    { name: "Breakfast" },
    { name: "Lunch" },
    { name: "Dinner" },
    { name: "Brunch" },
    { name: "Snack" },
    { name: "Dessert" },
    { name: "Appetizer" },
    { name: "Main Course" },
    { name: "Side Dish" },
  ];

  const courses = [
    { name: "Soup" },
    { name: "Salad" },
    { name: "Sandwich" },
    { name: "Pizza" },
    { name: "Casserole" },
    { name: "Pasta" },
    { name: "Bread" },
    { name: "Beverage" },
    { name: "Cocktail" },
  ];

  // Insert categories into the database
  for (const category of [...cuisineTypes, ...mealTypes, ...courses]) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed Tags
  const dietaryPreferences = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
    "Low-Fat",
    "Dairy-Free",
    "Nut-Free",
    "Pescatarian",
    "Diabetic-Friendly",
  ];

  const cookingMethods = [
    "Baking",
    "Grilling",
    "Stir-Frying",
    "Boiling",
    "Roasting",
    "Steaming",
    "Slow Cooking",
    "Pressure Cooking",
    "Air Frying",
    "Sous Vide",
    "Smoking",
  ];

  const specialOccasions = [
    "Holiday",
    "Christmas",
    "Thanksgiving",
    "Easter",
    "Birthday",
    "Valentine’s Day",
    "Halloween",
    "New Year’s Eve",
    "Super Bowl",
    "Wedding",
  ];

  const ingredientBased = [
    "Chicken",
    "Beef",
    "Pork",
    "Seafood",
    "Vegetables",
    "Pasta",
    "Rice",
    "Eggs",
    "Cheese",
    "Chocolate",
    "Fruit",
    "Nuts",
    "Legumes",
    "Grains",
  ];

  const timeBased = [
    "Quick & Easy (Under 30 minutes)",
    "30-Minute Meals",
    "One-Pot Meals",
    "Make-Ahead",
    "Meal Prep",
    "Slow Cooker",
  ];

  const healthFocused = [
    "High Protein",
    "Low Calorie",
    "Heart-Healthy",
    "Immune-Boosting",
    "Gut Health",
    "Detox",
  ];

  const seasonal = ["Spring", "Summer", "Fall", "Winter"];

  // Insert tags into the database
  const tags = [
    ...dietaryPreferences,
    ...cookingMethods,
    ...specialOccasions,
    ...ingredientBased,
    ...timeBased,
    ...healthFocused,
    ...seasonal,
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }

  console.log("Categories and Tags seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
