"use client";
import { login } from "@/lib/authActions";
import { getCreatorDetails } from "@/lib/dbActions";
import { addToast, Button, Skeleton } from "@heroui/react";
import Header from "@repo/ui/header";
import VideoCard from "@repo/ui/videoCard";
import { VideoDropdown } from "@repo/ui/videoDropdown";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DrawerComponent from "./components/drawer";
import { dummyVideos } from "./constants";
import ImportVideo from "./modals/importVideo";
import { TRole } from "@repo/lib/constants";

export type TUserDetails = Awaited<
  ReturnType<typeof getCreatorDetails>
>["result"];

export default function Home() {
  const [userDetails, setUserDetails] = useState<TUserDetails>(null);
  const { data, status } = useSession();

  useEffect(() => {
    (async () => {
      if (status === "loading") return;
      if (!data?.user.id) {
        addToast({ color: "danger", description: "Unauthenticated" });
        return;
      }
      const res = await getCreatorDetails({ userId: data.user.id });
      console.log("res.result", res.result);
      if (res.ok) {
        setUserDetails(res.result);
      }
      if (!res.ok) {
        addToast({
          color: "danger",
          description: "Failed to fetch videos.",
        });
      }
    })();
  }, [data?.user.id, status]); // Added dependency

  return (
    <>
      <div className="main">
        <Button onPress={() => login()}>Get Started </Button>

        <div className="video-cards-container grid p-4 gap-[24px_11px]">
          {true &&
            dummyVideos.map((video) => (
              <div className="relative" key={video.id}>
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="block"
                >
                  <VideoCard video={video} />
                </Link>
                <VideoDropdown
                  title={video.title as string}
                  videoId={video.id}
                  userRole={data?.user.role as TRole}
                  className="[top:calc(72%_+_5px)] right-[5px] absolute"
                  ownerId={video.ownerId}
                />
              </div>
            ))}

          {userDetails &&
            userDetails.ownedVideos.map((video) => (
              <div className="relative" key={video.id}>
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="block"
                >
                  <VideoCard video={video} />
                </Link>
                <VideoDropdown
                  title={video.title as string}
                  videoId={video.id}
                  userRole={data?.user.role as TRole}
                  className="[top:calc(72%_+_5px)] right-[5px] absolute"
                  ownerId={video.ownerId}

                />
              </div>
            ))}

          {!userDetails && (
            <>
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
              <Skeleton className="w-[387px] h-[310px] rounded-lg" />
            </>
          )}
        </div>
        {data?.user.id && <ImportVideo userDetails={userDetails} />}
      </div>
    </>
  );
}
