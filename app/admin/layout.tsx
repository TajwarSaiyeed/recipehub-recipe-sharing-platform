import { FC, ReactNode } from "react";
import Navbar from "@/components/navbar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AdminLayout;
