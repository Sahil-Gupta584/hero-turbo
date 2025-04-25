"use client";
import { login } from "@/lib/authActions";
import { getEditorVideos } from "@/lib/dbActions";
import { addToast, Button, Skeleton } from "@heroui/react";
import { TRole } from "@repo/lib/constants";
import Header from "@repo/ui/header";
import VideoCard from "@repo/ui/videoCard";
import { VideoDropdown } from "@repo/ui/videoDropdown";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DrawerComponent from "./components/drawer";
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
            if (res.ok) {
                setUserDetails(res.result);
                return;
            }
            addToast({
                color: "danger",
                description: "Failed to fetch videos.",
            });
        })();
    }, [data?.user.id, status]); // Added dependency

    return (
        <>
            <div className="main">
                <div className="video-cards-container grid p-4 gap-[24px_11px]">
                    {userDetails &&
                        userDetails.accessibleVideos.map(({ video }) => (
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
                                    className="[top:calc(72%_+_5px)] right-[5px] absolute"
                                    userRole={data?.user.role as TRole}
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
