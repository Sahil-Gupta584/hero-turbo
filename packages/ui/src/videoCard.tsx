"use client";

import { Prisma } from "@repo/db";
import imageInputPlaceholder from "@repo/lib/assets/imageInputPlaceholder.png";
import Tag from "./tag";

export type TUserDetailsVideo = Prisma.VideoGetPayload<{
  include: {
    channel: true;
    importedBy: true;
  };
}>;

export default function VideoCard({ video }: { video: TUserDetailsVideo }) {
  return (
    <div className="video-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition bg-white dark:bg-neutral-800 border border-[#80808040] dark:border-neutral-700 w-full h-[326px]">
      <img
        src={video.thumbnailUrl || imageInputPlaceholder.src}
        alt="Image"
        width={320}
        height={180}
        className="w-full rounded rounded-b-none h-[72%] object-cover bg-[#ededed] dark:bg-neutral-700"
      />
      <div className="flex items-center gap-2 p-2 border-t-2 border-t-gray-200 dark:border-t-neutral-700">
        <img
          className="w-12 h-12 rounded-full self-start object-cover"
          src={video.channel ? video.channel.logoUrl : imageInputPlaceholder.src}
        />
        <div className="flex flex-col grow">
          <span className="font-semibold text-sm line-clamp-2 text-black dark:text-white">
            {video.title}
          </span>
          <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            {video.channel ? video.channel.name : "None"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ImportedBy: {video.importedBy.name}
          </span>
        </div>

        <Tag text={video.videoStatus} className="self-end" />
      </div>
    </div>
  );
}
