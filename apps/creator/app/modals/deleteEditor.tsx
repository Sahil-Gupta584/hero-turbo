import { removeEditor } from "@/lib/dbActions";
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
import { User } from "@repo/db";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

export function DeleteEditor({ editor, creatorId }: { editor: User; creatorId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onDelete = async () => {
    setIsLoading(true);
    const res = await removeEditor({ editorId: editor.id, creatorId });
    if (res.ok) {
      addToast({
        description: `Editor ${editor.email} removed successfully`,
        color: "success",
      });
      onClose();
    } else {
      addToast({
        description: "Failed to remove editor",
        color: "danger",
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button color="danger" variant="flat" endContent={<MdDelete />} onPress={onOpen}>
        Remove
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Remove Editor</ModalHeader>
              <ModalBody>
                <p>

                Are you sure you want to remove editor <span className="font-semibold text-gray-500"> {editor.email}</span> ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" isLoading={isLoading} onPress={onDelete}>
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
