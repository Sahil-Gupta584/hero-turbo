"use client";

import { Prisma } from "@repo/db";
import imageInputPlaceholder from "@repo/lib/assets/imageInputPlaceholder.png";
import Tag from "./tag.tsx";

export type TUserDetailsVideo = Prisma.VideoGetPayload<{
  include: {
    channel: true;
    importedBy: true;
  };
}>;

export default function VideoCard({ video }: { video: TUserDetailsVideo }) {
  console.log("channel", video.channel);

  return (
    <div className="video-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition bg-white border-[#80808040] border-[1px] w-full h-[310px] ">
      <img
        src={video.thumbnailUrl || imageInputPlaceholder.src}
        alt="Image"
        width={320}
        height={180}
        className="w-full rounded rounded-b-none h-[72%] object-contain bg-[#ededed]"
      />
      <div className="flex items-center gap-2 p-2">
        <img
          className="w-12 h-12 rounded-full self-start"
          src={
            video.channel ? video.channel.logoUrl : imageInputPlaceholder.src
          }
        />

        <div className="flex flex-col grow">
          <span className="font-semibold text-sm line-clamp-2">
            {video.title}
          </span>
          <span className="font-semibold text-sm text-gray-500">
            {video.channel ? video.channel.name : "None"}
          </span>
          <span className="text-xs text-gray-500">
            ImportedBy: {video.importedBy.name}
          </span>
        </div>

        <Tag text={video.videoStatus} className=" self-end" />
      </div>
    </div>
  );
}
