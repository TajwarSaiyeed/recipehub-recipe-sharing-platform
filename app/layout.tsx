import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import TopLoader from "@/components/top-loader";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

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
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased mx-auto max-w-7xl p-5",
          inter.className
        )}
      >
        <SessionProvider>
          {children}
          <Toaster richColors />
          <TopLoader />
        </SessionProvider>
      </body>
    </html>
  );
}
