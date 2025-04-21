"use client";
import { login } from "@/lib/authActions";
import { getInviteDetails, handleAcceptInvite } from "@/lib/dbActions";
import { addToast, Avatar, Button, Skeleton } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  params: Promise<{ inviteId: string }>;
};
type TInviteDetails = Awaited<ReturnType<typeof getInviteDetails>>["result"];

function Page({ params }: Props) {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [inviteDetails, setInviteDetails] = useState<TInviteDetails | null>(
    null
  );
  const { data, status } = useSession();
  const { inviteId } = use(params);
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    (async () => {
      const res = await getInviteDetails(inviteId);
      if (res.ok) {
        setInviteDetails(res.result);
        console.log("inviteDetails", inviteDetails);
      }

      if (!res.ok && res.error) {
        addToast({ description: "Unknown error occurred", color: "danger" });
        setErrorMessage(res.error.message);
      }
    })();
  }, [params, status]);
  async function handlePress() {
    try {
      console.log({ status, data });

      if (!data?.user.id) {
        await login(window.location.href);
      }

      if (data?.user.id) {
        const res = await handleAcceptInvite({
          editorId: data?.user.id,
          inviteId,
        });

        if (res.ok) {
          addToast({
            description: "Invite accepted successfully!",
            color: "success",
          });
          router.push("/");
        }

        if (!res.ok && res.error) {
          addToast({
            description: "Unknown error occurred",
            color: "danger",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      addToast({
        description: "Something went wrong, please try again later",
        color: "danger",
      });
    }
  }
  return (
    <>
      <section className="min-h-screen flex justify-between  flex-col items-center">
        <nav className="flex items-center justify-between p-6 w-full ">
          <p className="md:text-2xl text-xl">Syncly</p>
          <p className="text-gray-400 text-large hover:text-black transition cursor-pointer">
            No Thanks
          </p>
        </nav>
        {inviteDetails && (
          <form
            onSubmit={handleSubmit(handlePress)}
            className="flex flex-col items-center gap-4"
          >
            <Avatar
              className="h-36 w-36"
              src={inviteDetails.creator.image}
              fallback
            />

            <li className="text-[28px] font-thin">
              Join the the {inviteDetails.creator.name}'s Workspace on Syncly
            </li>
            <Button
              onPress={handlePress}
              className="bg-black text-[20px] text-white"
              isLoading={isSubmitting}
            >
              Accept Invite
            </Button>
          </form>
        )}
        {!inviteDetails && !errorMessage && (
          <>
            <div className="flex flex-col items-center gap-6 mt-8">
              <Skeleton className="h-36 w-36 rounded-full" />
              <Skeleton className="h-10 w-[47rem] rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          </>
        )}
        {errorMessage && (
          <div className="flex flex-col items-center gap-6 mt-8">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}
        <div></div>
        <div></div>
      </section>
    </>
  );
}

export default Page;
