"use client";
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
import axios from "axios";
import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

export default function PublishNow({
  isSubmitting,
  isEditing,
  videoId,
}: {
  isSubmitting: boolean;
  isEditing: boolean;
  videoId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  async function handlePublishNow() {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/video/publishNow", { videoId });
      console.log("res", res.data);

      if (res.data.ok) {
        addToast({
          color: "success",
          description: res.data.message,
        });
      }
    } catch (error) {
      // console.log("error handlePublishNow", error);

      addToast({
        color: "danger",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(true);
      onClose();
    }
  }
  return (
    <>
      <Button
        isLoading={isSubmitting}
        className="grow tracking-[1px] font-semibold text-[16px] p-6"
        color="primary"
        startContent={<MdOutlineFileUpload />}
        onPress={onOpen}
        type="submit"
        isDisabled={isEditing}
      >
        Publish Now
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                Are you sure you want to publish this video now? Have you set
                all important detail for video?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={handlePublishNow}
                >
                  Publish Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
