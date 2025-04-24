'use client'
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from 'next-themes'

export default function Providers({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <ThemeProvider attribute="class">
          <SessionProvider>
            <HeroUIProvider>
              <ToastProvider placement="top-center"  />
  
                {children}
            </HeroUIProvider>
          </SessionProvider>
      </ThemeProvider>
    );
  }