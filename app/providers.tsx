"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  CACHE_TIME_MINUTES,
  MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE,
} from "../constants";

const GC_TIME_MS =
  CACHE_TIME_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: GC_TIME_MS,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
