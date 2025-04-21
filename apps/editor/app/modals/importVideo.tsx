"use client";
import {
  addToast,
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { FaPlus, FaUpload } from "react-icons/fa";
import { TUserDetails } from "../page";

type TImportVideo = {
  videoFile: FileList;
  creatorId: string;
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
  const onSubmit = async (data: TImportVideo) => {
    if (!userDetails) {
      addToast({ color: "danger", description: "Unauthenticated" });
      return;
    }
    const formdata = new FormData();

    // Always required
    formdata.append("videoFile", data.videoFile[0] as File);
    formdata.append("importerId", userDetails.id as string);
    formdata.append("ownerId", userDetails.id as string);

    if (userDetails.creators.length === 1) {
      formdata.append(
        "creatorId",
        userDetails.creators[0]?.creatorId as string
      );
    }

    const res = await fetch("/api/video/import", {
      method: "POST",
      body: formdata,
    });
    const result = await res.json();

    if (result.ok) {
      addToast({ color: "success", title: "Video Imported successfully!" });
      onClose();
    } else {
      addToast({ color: "danger", title: "Failed to import video!" });
    }
  };

  return (
    <>
      <Tooltip content="Import New Video" className="bg-black text-white">
        <Button
          radius="full"
          className="p-[38px_27px] fixed bottom-10 right-5 bg-black text-white"
          onPress={onOpen}
        >
          <FaPlus className="text-xl " />
        </Button>
      </Tooltip>

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

                <Select
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5 top-[22px]",
                    trigger: "min-h-16",
                    listboxWrapper: "max-h-[400px]",
                  }}
                  items={userDetails?.creators}
                  defaultSelectedKeys={userDetails?.creators?.length>1?[]:userDetails?.creators[0]?.creatorId}
                  label="Select a Creator"
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider bg-background",
                    },
                  }}
                  renderValue={(creators) => {
                    return creators.map((creator) => (
                      <div
                        key={creator.key}
                        className="flex items-center gap-2 "
                      >
                        <Avatar
                          alt={creator.data?.creator.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={creator.data?.creator.image}
                        />
                        <div className="flex flex-col">
                          <span>{creator.data?.creator.name}</span>
                        </div>
                      </div>
                    ));
                  }}
                  variant="bordered"
                >
                  {({ creator }) => (
                    <SelectItem key={creator.id} textValue={creator.name} >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={creator.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={creator.image}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{creator.name}</span>
                          <span className="text-tiny text-default-400">
                            {creator.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
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
