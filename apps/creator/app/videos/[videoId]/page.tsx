"use client";

import { categories } from "@/app/constants";
import { getPlaylists, getVideoDetails, UploadImgGetUrl } from "@/lib/actions";
import { updateVideoDetails } from "@/lib/dbActions";
import {
  addToast,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { TRole } from "@repo/lib/constants";
import VideoComponent from "@repo/ui/videoComponent";
import { VideoDropdown } from "@repo/ui/videoDropdown";
import { youtube_v3 } from "googleapis";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ChanNEditrsFields from "./components/ChanNEditrsFields";
import { DateTimePicker } from "./components/modals/dateTimePicker";
import PublishNow from "./components/modals/publishNow";
import ShowThumbnails from "./components/showThumbnails";
import VideoFormSkeleton from "./components/VideoFormSkeleton";

type TPlaylists = youtube_v3.Schema$Playlist[] | undefined;

type Props = {
  params: Promise<{ videoId: string }>;
};
export type TVideoDetails = Awaited<
  ReturnType<typeof getVideoDetails>
>["result"] & {
  newThumbnailFile?: FileList;
} & { selectedEditorsId: string[] };
export default function Page({ params }: Props) {
  const [videoDetails, setVideoDetails] = useState<TVideoDetails | null>(null);
  const [playlists, setPlaylists] = useState<TPlaylists>();
  const [isEditing, setIsEditing] = useState(false);

  const { videoId } = use(params);

  useEffect(() => {
    (async () => {
      const details = await getVideoDetails(videoId);
      if (details.ok && details.result) {
        console.log("details", details.result);
        setVideoDetails({
          ...details.result,
          selectedEditorsId: details.result.editors.map((e) => e.editorId),
        });

        const playlistsRes = await getPlaylists(details.result.ownerId);
        if (playlistsRes.ok && playlistsRes.result?.data) {
          setPlaylists(playlistsRes.result.data);
        }
      }

      if (!details.ok && details.error) {
        addToast({
          color: "danger",
          description: "Failed to get Video Details.",
        });
      }
    })();
  }, [params]);
  return (
    <>
      {videoDetails ? (
        <VideoPage
          previousData={videoDetails}
          playlists={playlists}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <VideoFormSkeleton />
      )}
    </>
  );
}

export function VideoPage({
  previousData,
  playlists,
  isEditing,
  setIsEditing,
}: {
  previousData: TVideoDetails;
  playlists: TPlaylists;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<TVideoDetails>({
    disabled: !isEditing,
  });

  useEffect(() => {
    (async () => {
      if (previousData) {
        reset({
          ...previousData,
          selectedEditorsId: previousData.editors.map((e) => e.editorId),
        });
      }
    })();
  }, [previousData, reset]);

  useEffect(() => {
    const interceptNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.href) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Do you really want to leave?"
        );
        if (!confirmLeave) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "You might have unsaved changes. Do you really want to leave?"
      );
      if (!confirmLeave) {
        history.pushState(null, "", window.location.href);
      } else {
        window.removeEventListener("popstate", handlePopState);
      }
    };

    history.pushState(null, "", window.location.href);
    if (isEditing) {
      document.addEventListener("click", interceptNavigation, true);
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      document.removeEventListener("click", interceptNavigation, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isEditing]);

  async function handleVideoSave(formDataRaw: TVideoDetails) {
    if (formDataRaw.newThumbnailFile && formDataRaw.newThumbnailFile[0]) {
      const { result } = await UploadImgGetUrl({
        imgFile: formDataRaw.newThumbnailFile[0],
      });
      formDataRaw.thumbnailUrl = result?.displayUrl;
    }

    console.log(" formDataRaw:", formDataRaw);

    const playlistIds = `${formDataRaw.playlistIds}`;
    const res = await updateVideoDetails({
      ...formDataRaw,
      playlistIds: playlistIds.split(","),
    });
    if (res.ok && res.result) {
      addToast({
        color: "success",
        description: "Video Data Saved Successfully",
      });
    }

    if (!res.ok && res.error) {
      addToast({
        color: "danger",
        description: "Unknown error occurred",
      });
    }
    setIsEditing(false);
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <VideoComponent videoId={previousData.id} />

      <div className="flex sm:flex-row flex-col gap-4 font-semibold my-4 sm:mb-6">
        <DateTimePicker isEditing={isEditing} videoDetails={previousData} />
        <PublishNow
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          videoId={previousData.id}
        />
      </div>
      <form className="" onSubmit={handleSubmit(handleVideoSave)}>
        <li className="flex sm:items-center sm:justify-between sm:flex-row flex-col-reverse pl-1 gap-4">
          <h1 className="text-3xl font-extrabold">Video Details</h1>
          <div className="flex flex-row  sm:gap-4 gap-2 font-semibold ">
            {isEditing && (
              <Button
                className="w-fit bg-blue-600 text-white"
                isLoading={isSubmitting}
                type="submit"
              >
                {isEditing ? "Save" : "Edits"}
              </Button>
            )}
            {!isEditing && (
              <Button
                color="primary"
                className="text-lg"
                isLoading={isSubmitting}
                type="button"
                onPress={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <Button
                color="danger"
                className="w-fit"
                isLoading={isSubmitting}
                onPress={() => {
                  reset({ ...previousData }); // Force new object reference
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            )}
            <VideoDropdown
              title={previousData.title as string}
              videoId={previousData.id}
              userRole={previousData.owner.role as TRole}
              className="mt-1"
            />
          </div>
        </li>
        <div className="mt-4 space-y-8">
          <ChanNEditrsFields
            isEditing={isEditing}
            register={register}
            setValue={setValue}
            previousData={previousData}
          />
          <Textarea
            isClearable={isEditing}
            minRows={2}
            label="Title (required)"
            placeholder="Add your title here"
            variant="bordered"
            classNames={{
              label: ["text-xl font-bold"],
              input: ["text-[17px]"],
            }}
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}

          <Textarea
            isClearable={isEditing}
            minRows={7}
            label="Description"
            placeholder="Add your description here"
            variant="bordered"
            classNames={{
              label: ["text-xl font-bold"],
              input: ["text-[17px]"],
            }}
            {...register("description")}
          />

          <ShowThumbnails
            handleRemoveImage={() => setValue("thumbnailUrl", null)}
            register={register}
            watch={watch}
          />
          {errors.thumbnailUrl && (
            <span className="text-red-500">
              {errors.thumbnailUrl?.message as string}
            </span>
          )}
          <div className="">
            <ul className="mb-2">
              <li className="text-xl font-bold">Playlists</li>
              <li className="text-sm text-gray-500">
                Add your video to one or more playlists to organize your content
                for viewers.
              </li>
            </ul>
            <Select
              variant="bordered"
              className="max-w-xs m-1"
              placeholder="Select Playlist"
              classNames={{
                popoverContent: ["w-fit"],
              }}
              selectionMode="multiple"
              items={playlists ?? []}
              defaultSelectedKeys={previousData.playlistIds}
              isDisabled={!isEditing}
              {...register("playlistIds")}
            >
              {(item) => (
                <SelectItem key={item.id}>
                  {item.snippet?.localized?.title}
                </SelectItem>
              )}
            </Select>
          </div>

          {/* <AudienceSec register={register} /> */}

          <div>
            <ul className="mb-4">
              <li className="text-xl font-bold">Tags</li>
              <li className="text-sm text-gray-500 mt-1">
                Tags can be useful if content in your video is commonly
                misspelt. Otherwise, tags play a minimal role in helping viewers
                to find your video.
              </li>
            </ul>
            <Input
              variant="bordered"
              placeholder="Add tags"
              description="Enter a comma after each tag"
              classNames={{ inputWrapper: [" p-[22px_1rem]"] }}
              {...register("tags")}
            />
          </div>

          <div>
            <ul className="mb-4">
              <li className="text-xl font-bold">Category</li>
              <li className="text-sm text-gray-500 mt-1">
                Add your video to a category so that viewers can find it more
                easily
              </li>
            </ul>
            <Select
              variant="bordered"
              className="max-w-xs m-1"
              placeholder="Select Category"
              classNames={{
                popoverContent: ["w-fit"],
              }}
              isDisabled={!isEditing}
              defaultSelectedKeys={previousData.categoryId}
              {...register("categoryId")}
            >
              {categories.map((text) => (
                <SelectItem key={text.id}>{text.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </form>
    </div>
  );
}
