"use client";
import { login } from "@/lib/authActions";
import { getEditorVideos } from "@/lib/dbActions";
import { addToast, Button, Skeleton } from "@heroui/react";
import Header from "@repo/ui/header";
import VideoCard from "@repo/ui/videoCard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DrawerComponent from "./components/drawer";
import { dummyVideos } from "./constants";
import ImportVideo from "./modals/importVideo";

export type TUserDetails = Awaited<
  ReturnType<typeof getEditorVideos>
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
      const res = await getEditorVideos(data?.user.id);
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
      <Header session={data} DrawerComponent={DrawerComponent} />
      <div className="main">
        <Button onPress={() => login()}>Get Started </Button>

        <div className="video-cards-container grid p-4 gap-[24px_11px]">
          {true &&
            dummyVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="block"
              >
                <VideoCard video={video} />
              </Link>
            ))}

          {userDetails &&
            userDetails.accessibleVideos.map(({ video }) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="block"
              >
                <VideoCard video={video} />
              </Link>
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
