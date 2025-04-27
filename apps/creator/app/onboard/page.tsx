"use client";
import { updatePlan } from "@/lib/dbActions";
import { addToast } from "@heroui/react";
import { PlanType } from "@repo/db";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type TOnboardPageProps = { searchParams: Promise<{ planType: PlanType }> };

export default function OnboardPage({ searchParams }: TOnboardPageProps) {
  const { data, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return;

    (async () => {
      const params = await searchParams;
      if (status === "unauthenticated") {
        router.push(`/auth?planType=${params.planType}`);
        return;
      }

      const res = await updatePlan({
        planType: params.planType,
        userId: data?.user.id as string,
      });
      if (res.ok) {
        addToast({
          description: "LoggedIn successfully",
          color: "success",
        });
        router.push("/");
        return;
      }
      addToast({
        description: "Something went wrong, Please contactUs.",
        color: "danger",
      });
    })();
  }, [status, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-5xl font-bold">Getting things ready for you...</p>
      <div className="mt-6">
        <div className="w-16 h-16 border-b-2 border-gray-900 dark:border-gray-200 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
