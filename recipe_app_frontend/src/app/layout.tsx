import "./globals.css";
import { recipeApi } from "@/lib/api/recipeApi";
import { getQueryClient } from "@/react-query/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import { AppProviders } from "./providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { Manrope } from "next/font/google";
import axios from "axios";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["recipes"],
    queryFn: recipeApi.getAll,
  });

  const dehydratedState = dehydrate(queryClient);

  axios.defaults.withCredentials = true;

  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* Google OAuth script */}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body className="font-sans">
        <AppProviders dehydratedState={dehydratedState}>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 w-full px-4 md:px-6">{children}</main>
            </div>
          </SidebarProvider>
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
