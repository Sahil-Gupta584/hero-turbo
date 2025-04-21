"use client";

import { addChannel } from "@/lib/dbActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TProps = {
  searchParams: Promise<{ code: string | null }>;
};

export default function Page({ searchParams }: TProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    const handleChannelAdd = async () => {
      try {
        // Wait until session is loaded
        if (status === "loading") return;

        const { code } = await searchParams;

        if (!code || !data?.user?.id) {
          setIsLoading(false);
          setErrorMessage("Missing code or user ID. Please try again.");
          return;
        }

        const res = await addChannel({ code, userId: data.user.id });

        if (res?.ok) {
          router.push("/");
        } else {
          setErrorMessage("Failed to add channel. Please try again.");
        }
      } catch (error) {
        console.error("Error adding channel:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    handleChannelAdd();
  }, [status, searchParams, data, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {isLoading && <p>Verifying...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
