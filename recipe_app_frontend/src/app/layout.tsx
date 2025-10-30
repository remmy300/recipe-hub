import "./global.css";

import { fetchRecipes } from "@/lib/api/recipeApi";
import { getQueryClient } from "@/react-query/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import { Providers, ReduxProvider } from "./providers";

export const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = getQueryClient();

  // prefetch server data
  await queryClient.prefetchQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });

  const hydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Providers DehydrateState={hydratedState}>{children}</Providers>
        </ReduxProvider>
      </body>
    </html>
  );
};
