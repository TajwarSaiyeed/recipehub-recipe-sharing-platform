import "./globals.css";
import { cn } from "@/lib/utils";
import { signOut } from "@/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopLoader from "@/components/top-loader";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recipe Hub | Recipe Management System",
  description:
    "Discover, create, and share your favorite recipes with Recipe Hub, the ultimate platform for culinary enthusiasts. Explore diverse cuisines, save your go-to dishes, and connect with a community of food lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleSignOut = async () => {
    "use server";
    console.log("signing out");
    await signOut();
  };
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased mx-auto max-w-7xl px-5 relative",
          inter.className
        )}
      >
        <SessionProvider>
          {children}
          <Toaster richColors />
          <TopLoader />
          <form action={handleSignOut}>
            <Button>SignOut</Button>
          </form>
        </SessionProvider>
      </body>
    </html>
  );
}
