import { addToast, Skeleton } from "@heroui/react";
import { getVideoLink } from "@repo/lib/actions";
import { useEffect, useState } from "react";

export default function VideoComponent({ videoId }: { videoId: string }) {
  const [videoLink, setVideoLink] = useState<null | string>(null);
  useEffect(() => {
    (async () => {
      const res = await getVideoLink(videoId);
      if (res.ok && res.result) {
        setVideoLink(res.result?.videoLink);
      }
      if (!res.ok) {
        addToast({
          description: "Failed to load video",
          color: "danger",
        });
      }
    })();
  }, [videoId]);
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-[0px_0px_7px_-2px_gray] ">
      {videoLink ? (
        <iframe
          src={videoLink}
          allow="autoplay"
          className="w-full h-[228px] sm:h-[340px] lg:h-[548px]  rounded-md"
        ></iframe>
      ) : (
        <Skeleton className="w-full h-[228px] sm:h-[340px] lg:h-[548px] shadow-md rounded-md" />
      )}
    </div>
  );
}
