import type { Metadata } from "next";
import {  DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import ReactQueryProvider from "@/react-query";
import { Toaster } from 'sonner'
// import { ReduxProvider } from '@/redux/provider'

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
          <link
            href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
            rel="stylesheet"
          />
        </head>
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {/* <ReduxProvider> */}
            <NextUIProvider>
              <ReactQueryProvider>
                {children}
                <Toaster position="bottom-center"   richColors theme="dark" />
              </ReactQueryProvider>
            </NextUIProvider>
            {/* </ReduxProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
