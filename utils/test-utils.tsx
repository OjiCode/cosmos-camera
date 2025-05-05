import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";
import React, { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: React.ComponentProps<"img">) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" {...props} />;
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
