'use client'
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";

export default function Providers({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
          <SessionProvider>
            <HeroUIProvider>
              <ToastProvider placement="top-center"  />
  
                {children}
            </HeroUIProvider>
          </SessionProvider>
    );
  }