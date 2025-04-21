'use client'
import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { FaPlus, FaUpload } from "react-icons/fa";

export default function ImportVideo({ userId, creatorId }: { userId: string, creatorId: string }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<{ video: FileList }>();
    const videoFile = watch("video");

    const onSubmit = async (data: { video: FileList }) => {
        const formdata = new FormData();
        formdata.append("videoFile", data.video[0] as File);
        formdata.append("importerId", userId);
        formdata.append("ownerId", creatorId);
        const res = await fetch("/api/video/import", {
            method: "POST",
            body: formdata
        });
        onClose();
        addToast({
            color: "success",
            title: "Video Imported",
        });
    };

    return (
        <>
            <Tooltip content="Import New Video" className="bg-black text-white" >
                <Button radius="full" className="p-[38px_27px] fixed bottom-10 right-5 bg-black text-white" onPress={onOpen}>
                    <FaPlus className="text-xl " />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1">Import Video</ModalHeader>
                            <ModalBody>
                                <label className="border-dashed border-2 border-gray-300 p-10 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                                    <FaUpload className="text-3xl mb-2" />
                                    <span className="text-sm">Click to upload or drag and drop</span>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        {...register("video", { required: true })}
                                    />
                                </label>
                                {videoFile && videoFile[0] && <p className="mt-2 text-center">Selected file: {videoFile[0].name}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button isLoading={isSubmitting} color="primary" type="submit" disabled={!videoFile}>
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
