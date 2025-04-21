"use client";
import { updateVideoDetails } from "@/lib/dbActions";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import moment from "moment";
import { useForm, UseFormRegister, UseFormWatch } from "react-hook-form";
import { MdSchedule } from "react-icons/md";
import { TVideoForm } from "../../page";

type TDateTimePicker = {
  register: UseFormRegister<TVideoForm>;
  watch: UseFormWatch<TVideoForm>;
  isSubmitting: boolean;
  isEditing: boolean;
  videoDetails: TVideoForm;
};

export function DateTimePicker({ isEditing, videoDetails }: TDateTimePicker) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<{ scheduledAt: number }>({
    defaultValues: { scheduledAt: videoDetails.scheduledAt as number },
  });
  const scheduledAt = watch("scheduledAt");

  async function onSubmit(formDataRaw: { scheduledAt: number }) {
    console.log("data", formDataRaw);
    const res = await updateVideoDetails({
      scheduledAt: moment(formDataRaw.scheduledAt).unix(),
      id: videoDetails.id,
    });
    if (res.ok) {
      addToast({
        color: "success",
        description: "Video Scheduled Successfully",
      });
      onClose();
    }
    if (!res.ok && res.error) {
      addToast({
        color: "danger",
        description: "Unknown error occurred",
      });
    }
  }
  return (
    <>
      <Button
        onPress={onOpen}
        className="grow tracking-[1px] bg-black text-white font-semibold text-[16px] p-6 sm:max-w-[56%] "
        startContent={<MdSchedule className="mb-1" />}
        isDisabled={isEditing || isSubmitting}
      >
        {scheduledAt && (
          <span className=" md:text-medium">
            <span className="sm:inline hidden">Scheduled at</span> &nbsp;
            {moment(scheduledAt).format("DD/MM/YYYY")} &nbsp;{" "}
            {moment(scheduledAt).format("LT")}
          </span>
        )}
        {!scheduledAt && "Schedule"}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Choose Date and Time
                </ModalHeader>
                <ModalBody>
                  <input type="datetime-local" {...register("scheduledAt")} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
