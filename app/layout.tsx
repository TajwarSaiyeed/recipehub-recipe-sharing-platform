import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopLoader from "@/components/top-loader";
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
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <SessionProvider>
          <main className={"relative flex flex-col min-h-screen"}>
            <div className={"flex-grow flex-1"}>
              {children}
              <Toaster richColors />
              <TopLoader />
            </div>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
