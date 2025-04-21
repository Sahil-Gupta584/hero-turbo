import {
  getCreatorChannels,
  getCreatorEditors,
  getVideoEditors,
} from "@/lib/dbActions";
import { addToast, Avatar, Checkbox, CheckboxGroup } from "@heroui/react";
import { useEffect, useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TVideoForm } from "../page";
import { ShowChannelsSkeleton } from "./VideoFormSkeleton";

type UserChanNEditrsProps = {
  register: UseFormRegister<TVideoForm>;
  isEditing: boolean;
  creatorId: string;
  videoId: string;
  setValue: UseFormSetValue<TVideoForm>;
  watch: UseFormWatch<TVideoForm>;
};
type TCreatorChannels = Awaited<
  ReturnType<typeof getCreatorChannels>
>["result"];
type TCreatorEditors = Awaited<ReturnType<typeof getCreatorEditors>>["result"];

export default function ChanNEditrsFields({
  register,
  creatorId,
  isEditing,
  videoId,
  watch,
  setValue,
}: UserChanNEditrsProps) {
  const [userChannels, setUserChannels] = useState<TCreatorChannels>(null);
  const [userEditors, setUserEditors] = useState<TCreatorEditors>(null);
  const [selectedEditorsId, setSelectedEditorsId] = useState<
    undefined | string[]
  >();

  const selectedChannelId = watch("channelId");
  useEffect(() => {
    (async () => {
      const channelsRes = await getCreatorChannels({ creatorId });
      const EditorsRes = await getCreatorEditors({ creatorId });
      const videoEditorsRes = await getVideoEditors({ videoId });
      if (!channelsRes.ok) {
        addToast({
          color: "danger",
          description: "Failed to Fetch Channels.",
        });
      }
      if (!EditorsRes.ok) {
        addToast({
          color: "danger",
          description: "Failed to Fetch Editors.",
        });
      }
      if (!videoEditorsRes.ok || !videoEditorsRes.result) {
        addToast({
          color: "danger",
          description: "Failed to Fetch Selected Video Editors.",
        });
      }

      setSelectedEditorsId(videoEditorsRes.result?.map((e) => e.editorId));
      setUserChannels(channelsRes.result);
      setUserEditors(EditorsRes.result);
    })();
  }, [creatorId, videoId]);
  return (
    <>
      {userChannels && userChannels.length > 0 ? (
        <div className="space-y-2">
          <p className=" font-medium text-xl">For :</p>
          <div>
            {userChannels.map((channel) => {
              if (channel.id === selectedChannelId) {
              }
              return (
                <label
                  key={channel.id}
                  className="flex items-center  cursor-pointer gap-1"
                >
                  <Checkbox
                    type="radio"
                    value={channel.id}
                    checked={selectedChannelId === channel.id}
                    // onChange={() => setValue("channelId", channel.id)}
                    disabled={!isEditing}
                    {...register("channelId")}
                  />
                  <Avatar
                    src={channel.logoUrl}
                    fallback
                    className="w-12 h-12 ml-3"
                  />
                  <span className="mt-1">{channel.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        <ShowChannelsSkeleton />
      )}

      {userEditors && userEditors.length > 0 ? (
        <div className="space-y-2">
          <p className=" font-medium text-xl">Can be accessed by:</p>
          <CheckboxGroup
            value={selectedEditorsId}
            onValueChange={(val) => {
              setSelectedEditorsId(val);
              setValue("selectedEditorsId", val);
            }}
            isDisabled={!isEditing}
            orientation="horizontal"
          >
            {userEditors.map(({ editor }) => (
              <Checkbox key={editor.id} value={editor.id}>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={editor.image}
                    className="w-12 h-12 ml-3"
                    fallback
                  />
                  <span className="mt-1 text-black">{editor.name}</span>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      ) : (
        <ShowChannelsSkeleton />
      )}
    </>
  );
}
