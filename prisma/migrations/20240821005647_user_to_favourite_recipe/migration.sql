-- CreateTable
CREATE TABLE "_UserFavRecipes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavRecipes_AB_unique" ON "_UserFavRecipes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavRecipes_B_index" ON "_UserFavRecipes"("B");

-- AddForeignKey
ALTER TABLE "_UserFavRecipes" ADD CONSTRAINT "_UserFavRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavRecipes" ADD CONSTRAINT "_UserFavRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
