"use client";

import { categories } from "@/app/constants";
import {
  getPlaylists,
  getVideoDetails,
  getVideoLink,
  UploadImgGetUrl,
} from "@/lib/actions";
import { updateVideoDetails } from "@/lib/dbActions";
import {
  addToast,
  Button,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { Prisma } from "@repo/db";
import { youtube_v3 } from "googleapis";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DateTimePicker } from "./components/modals/dateTimePicker";
import PublishNow from "./components/modals/publishNow";
import ShowThumbnails from "./components/showThumbnails";
import VideoFormSkeleton from "./components/VideoFormSkeleton";

export type TVideoForm = Prisma.VideoGetPayload<{}> & {
  newThumbnailFile?: FileList;
};
type TPlaylists = youtube_v3.Schema$Playlist[] | undefined;

type Props = {
  params: Promise<{ videoId: string }>;
};

export default function Page({ params }: Props) {
  const [videoDetails, setVideoDetails] = useState<null | TVideoForm>(null);
  const [videoLink, setVideoLink] = useState<null | string>(null);
  const [playlists, setPlaylists] = useState<TPlaylists>();

  const { videoId } = use(params);

  useEffect(() => {
    (async () => {
      const details = await getVideoDetails(videoId);
      if (details.ok && details.result) {
        console.log("details", details.result);
        setVideoDetails(details.result);
        const res = await getVideoLink(details.result.gDriveId);
        if (res.ok && res.result) {
          setVideoLink(res.result?.videoLink);
        }
      }

      if (!details.ok && details.error) {
        addToast({
          color: "danger",
          description: details?.error.message,
        });
      }

      const playlistsRes = await getPlaylists();
      if (playlistsRes.ok && playlistsRes.result?.data) {
        setPlaylists(playlistsRes.result.data);
      }
    })();
  }, [params]);
  return (
    <>
      {videoDetails ? (
        <VideoPage
          videoLink={videoLink}
          previousData={videoDetails}
          playlists={playlists}
        />
      ) : (
        <VideoFormSkeleton />
      )}
    </>
  );
}

export function VideoPage({
  previousData,
  videoLink,
  playlists,
}: {
  previousData: TVideoForm;
  videoLink: string | null;
  playlists: TPlaylists;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TVideoForm>({
    defaultValues: {
      title: previousData?.title,
      description: previousData?.description,
      categoryId: previousData?.categoryId,
      privacyStatus: previousData?.privacyStatus,
      tags: previousData?.tags,
      playlistIds: previousData?.playlistIds,
      thumbnailUrl: previousData?.thumbnailUrl,
      scheduledAt: previousData?.scheduledAt,
      videoStatus: previousData?.videoStatus,
    },
    disabled: !isEditing,
  });

  useEffect(() => {
    if (previousData) {
      reset(previousData);
    }
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

  const handleRemoveImage = () => {
    setValue("thumbnailUrl", null);
  };

  async function handleVideoSave(formDataRaw: TVideoForm) {
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
      <button
        onClick={async () => {
          console.log("getting");

          const res = await getPlaylists();
          console.log(res);
        }}
      >
        c
      </button>
      {/* Video Section */}
      <div className="rounded-lg overflow-hidden bg-white shadow-[0px_0px_7px_-2px_gray] ">
        {/* {thumbnail.length > 0 ? (
                    <Image
                        src={URL.createObjectURL(thumbnail[0])}
                        alt="Thumbnail"
                        width={640}
                        height={360}
                        className="w-full h-auto rounded max-h-[360px] object-contain"
                    />
                ) : (
                    <Image
                        src={imageInputPlaceholder}
                        alt="Placeholder Thumbnail"
                        width={640}
                        height={360}
                        className="w-full h-auto rounded"
                    />
                )} */}
        {/* <iframe src="https://drive.google.com/file/d/1o7kdOrCf_L0o17lIw_LvvjU2vd8tTls6/preview" allow="autoplay" className="w-full h-[228px] sm:h-[340px] lg:h-[548px] shadow-md rounded-md"></iframe> */}
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

      <div className="flex sm:flex-row flex-col gap-4 font-semibold my-4 sm:mb-6">
        <DateTimePicker
          isSubmitting={isSubmitting}
          register={register}
          watch={watch}
          isEditing={isEditing}
          videoDetails={previousData}
        />
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
                onPress={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </li>
        <div className="mt-4 space-y-8">
          <Textarea
            isClearable
            minRows={2}
            label="Title (required)"
            placeholder="Add your title here"
            variant="bordered"
            onClear={() => console.log("textarea cleared")}
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
            isClearable
            minRows={7}
            label="Description"
            placeholder="Add your description here"
            variant="bordered"
            onClear={() => console.log("textarea cleared")}
            classNames={{
              label: ["text-xl font-bold"],
              input: ["text-[17px]"],
            }}
            {...register("description")}
          />

          <ShowThumbnails
            handleRemoveImage={handleRemoveImage}
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
