"use client";

import { getUserVideos } from "@/lib/dbActions";
import imageInputPlaceholder from "@/public/imageInputPlaceholder.png";
import { Avatar } from "@heroui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Tag from "./tag";


type TVideo = Exclude<Awaited<ReturnType<typeof getUserVideos>>["result"], null>[number];
export default function VideoCard({ video }: { video: TVideo }) {
  const { data } = useSession();

  return (
    <div className="video-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition bg-white border-[#80808040] border-[1px] w-full h-[310px] ">
      <Image
        src={video.thumbnailUrl || imageInputPlaceholder}
        alt='Image'
        width={320}
        height={180}
        className="w-full rounded rounded-b-none h-[72%] object-contain bg-[#e7e7e7]"
      />
      <div className="flex items-center gap-2 p-2">
        <Avatar className="w-20 h-8 text-tiny self-start" src={video.channel ? video.channel.logoUrl : imageInputPlaceholder.src} showFallback />

        <div className="flex flex-col">
          <span className="font-semibold text-sm line-clamp-2">{video.title}</span>
          <span className="font-semibold text-sm text-gray-500">{video.channel ? video.channel.name : 'None'}</span>
          <span className="text-xs text-gray-500">ImportedBy: {video.importedBy.name}</span>
        </div>
        <div className="ml-auto">
          <Tag
            text={video.videoStatus}
          />
        </div>
      </div>
    </div>
  );
}
