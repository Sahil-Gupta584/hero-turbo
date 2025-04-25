import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { deleteVideo } from "@repo/lib/actions";
import { HTMLAttributes, useState } from "react";

export function VideoDropdown({
  videoId,
  title,
  userRole,
  className,
  ownerId,
}: {
  title?: string;
  videoId: string;
  userRole: "CREATOR" | "EDITOR";
  className?: HTMLAttributes<HTMLElement>["className"];
  ownerId?: string;
}) {
  async function onDownload() {
    const res = await fetch(
      `${process.env.CREATOR_BASE_URL}/api/download/${videoId}`
    );
    if (!res.ok) {
      addToast({
        description: "Failed to download video",
        color: "danger",
      });
      return;
    }
    addToast({
      description: "Video will begin shortly.",
      color: "success",
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.mp4`;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className={className}>
        <Dropdown closeOnSelect={false} classNames={{content:['dark:bg-[#4d4d4d] ']}}>
          <DropdownTrigger>
            <button
              className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 rotate-90 self-end mb-2 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600   dark:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
              </svg>
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" >
            <DropdownItem
              key="download"
              className="text-lg"
              onPress={onDownload}
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors duration-200  dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 10l5 5 5-5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v11"
                  />
                </svg>
              }
            >
              Download
            </DropdownItem>
            {userRole === "CREATOR" ? (
              <DropdownItem
                key="delete"
                startContent={
                  <svg
                    className="w-6 h-6 text-red-600 hover:text-red-700 transition"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m2 0V5a1 1 0 011-1h4a1 1 0 011 1v2"
                    />
                  </svg>
                }
                className="text-danger"
              >
                <DeleteVideoModal
                  title={title as string}
                  videoId={videoId}
                  ownerId={ownerId as string}
                />
              </DropdownItem>
            ) : null}
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}

function DeleteVideoModal({
  videoId,
  title,
  ownerId,
}: {
  title: string;
  videoId: string;
  ownerId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const res = await deleteVideo(videoId, ownerId);
    if (res.ok) {
      addToast({ color: "success", description: "Video deleted successfully" });
    }
    if (!res.ok) {
      addToast({ color: "danger", description: "Failed to delete video" });
    }
    setIsLoading(false);
    onClose()
  }
  return (
    <>
      <p onClick={onOpen}> Delete Video</p>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Delete Video
              </ModalHeader>
              <ModalBody className="space-y-4 import-video-modal">
                <p className="text-gray-600 darks:text-gray-300 ">
                  Are you sure you want to delete this video? This action is
                  irreversible.
                </p>
                <section>
                  <strong className="text-lg">Video:-</strong>
                  <p>
                    <span>Title:</span> &nbsp;
                    {title}
                  </p>
                </section>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button isLoading={isLoading} color="primary" type="submit">
                  Delete
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
