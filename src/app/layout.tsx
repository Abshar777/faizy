import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import ReactQueryProvider from "@/react-query";
import { Toaster } from "sonner";
import { StoreProvider } from "@/store/provider";

const manrope = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "faizy",
  description: "Share AI powered videos with your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/faizy.svg" type="image/svg" sizes="32x20" />
          <link
            href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
            rel="stylesheet"
          />
        </head>
        <body className={`${manrope.className} bg-[#171717]`}>
          <NextTopLoader
            height={2}
            shadow="0 0 30px 5px rgba(255, 255, 255, 0.3)"
            color="rgb(255 255 255 / 0.3);"
            showSpinner={false}
            zIndex={9999999999999999999}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <StoreProvider>
              <NextUIProvider>
                <ReactQueryProvider>
                  {children}
                  <Toaster className="z-[9999999999999999999999999999999]" position="bottom-center" richColors theme="dark" />
                </ReactQueryProvider>
              </NextUIProvider>
            </StoreProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
