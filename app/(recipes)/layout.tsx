import { FC, ReactNode } from "react";
import Navbar from "@/components/navbar";

interface RecipeLayoutProps {
  children: ReactNode;
}

const RecipeLayout: FC<RecipeLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RecipeLayout;
