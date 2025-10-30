"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";
import { HydrationBoundary, DehydratedState } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ReactNode } from "react";

export const Providers = ({
  children,
  DehydrateState,
}: {
  children: React.ReactNode;
  DehydrateState?: DehydratedState;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={DehydrateState}>{children}</HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
