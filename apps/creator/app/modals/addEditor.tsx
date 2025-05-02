import { sendInviteLink } from "@/lib/actions";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { User } from "next-auth";
import { FormEvent, useState } from "react";
import { MdAdd } from "react-icons/md";

export function AddEditor({ creator }: { creator: User }) {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = (e.target as HTMLFormElement).email.value;
    const res = await sendInviteLink({ editorEmail: email, creator });
    if (res.ok) {
      addToast({
        description: "Invite link sent successfully",
        color: "success",
      });
      onClose();
    }
    if (!res.ok && res.error) {
      addToast({
        description: "Unknown error occurred",
        color: "danger",
      });

      console.log("Error from sendInviteLink :", res.error.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        className=" self-end px-4"
        color="primary"
        endContent={<MdAdd />}
        size="sm"
        onPress={onOpen}
      >
        Add Editor
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        className="bg-[#f6f9ff]"
        isDismissable={false}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {() => (
            <>
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  Add New Editor
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Editor email"
                    placeholder="Enter email here"
                    type="email"
                    variant="bordered"
                    name="email"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    isDisabled={isLoading}
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" isLoading={isLoading}>
                    Send Invite
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
