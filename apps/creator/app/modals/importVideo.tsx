"use client";
import {
  addToast,
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { updateThumbnails, uploadVideoAction } from "@repo/lib/actions";
import ImportButton from "@repo/ui/importButton";
import { useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa";
import { TUserDetails } from "../page";
type TImportVideo = {
  videoFile: FileList;
  channelId?: string;
  editorsId?: string[];
};

export default function ImportVideo({
  userDetails,
}: {
  userDetails: TUserDetails;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TImportVideo>();

  const videoFile = watch("videoFile");
  const selectedChannel = watch("channelId");
  const selectedEditors = watch("editorsId");

  const onSubmit = async (data: TImportVideo) => {
    if (!userDetails) {
      addToast({ color: "danger", description: "Unauthenticated" });
      return;
    }

    if (!data.videoFile[0]) {
      addToast({ color: "danger", description: "Video file is required" });
      return;
    }
    const result = await uploadVideoAction({
      videoDetails: {
        ...data,
        channelId:
          userDetails.channels.length === 1
            ? userDetails?.channels[0]?.id
            : data.channelId,
        importerId: userDetails.id,
        ownerId: userDetails.id,
        videoFile: data.videoFile[0],
      },
    });
    if (!result.ok || !result.result) {
      addToast({ color: "danger", title: "Failed to import video!" });
      return;
    }
    addToast({ color: "success", title: "Video Imported successfully!" });
    onClose();
    await updateThumbnails({
      ownerId: userDetails.id,
      videos: [{ gDriveId: result.result.gDriveId, videoId: result.result.id }],
    });
  };

  return (
    <>
      <ImportButton onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Import Video
              </ModalHeader>
              <ModalBody className="space-y-4 import-video-modal">
                {/* Upload Field */}
                <label className="border-dashed border-2 border-gray-300 p-10 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                  <FaUpload className="text-3xl mb-2" />
                  <span className="text-sm">
                    Click to upload or drag and drop
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    {...register("videoFile", {
                      required: {
                        value: true,
                        message: "Video File is required",
                      },
                    })}
                  />
                </label>
                {videoFile?.[0] && (
                  <p className="text-center text-sm text-gray-700">
                    Selected file: {videoFile[0].name}
                  </p>
                )}

                {/* Channel Selection (Single) */}
                {userDetails && userDetails.channels?.length > 1 && (
                  <div className="space-y-2">
                    <Divider className="bg-gray-400" />
                    <p className=" font-medium">For :</p>
                    <div className="gap-6 flex flex-wrap ">
                      {userDetails &&
                        userDetails.channels.map((channel) => (
                          <label
                            key={channel.id}
                            className="flex items-center  cursor-pointer gap-1"
                          >
                            <input
                              type="radio"
                              value={channel.id}
                              {...register("channelId")}
                              checked={selectedChannel === channel.id}
                              onChange={() => setValue("channelId", channel.id)}
                            />
                            <Avatar
                              src={channel.logoUrl}
                              fallback
                              className="w-7 h-7 ml-3"
                            />
                            <span className="mt-1">{channel.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Editors Selection (Multiple) */}
                {userDetails && userDetails.editors.length > 0 && (
                  <div className="space-y-2">
                    <Divider className="bg-gray-400" />
                    <p className=" font-medium">Can be accessed by:</p>
                    <CheckboxGroup
                      value={selectedEditors}
                      onValueChange={(val) => setValue("editorsId", val)}
                    >
                      {userDetails &&
                        userDetails.editors.map(({ editor }) => (
                          <Checkbox key={editor.id} value={editor.id}>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={editor.image}
                                className="w-7 h-7 ml-3"
                              />
                              <span className="mt-1">{editor.name}</span>
                            </div>
                          </Checkbox>
                        ))}
                    </CheckboxGroup>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={isSubmitting}
                  color="primary"
                  type="submit"
                  disabled={!videoFile}
                >
                  Upload
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
