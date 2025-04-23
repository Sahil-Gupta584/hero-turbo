"use client";

import { TRole } from "@/app/constants";
import VideoComponent from "@repo/ui/videoComponent";
import { VideoDropdown } from "@repo/ui/videoDropdown";
import { useSession } from "next-auth/react";
import { use } from "react";

type Props = {
  params: Promise<{ videoId: string }>;
};

export default function Page({ params }: Props) {
  const { videoId } = use(params);
  const { data } = useSession();
  return (
    <>
      <div className="p-6 max-w-4xl flex flex-col mx-auto">
        <VideoComponent videoId={videoId} />
        <VideoDropdown className="self-end mt-3" videoId={videoId} userRole={data?.user.role as TRole} />
      </div>
    </>
  );
}
