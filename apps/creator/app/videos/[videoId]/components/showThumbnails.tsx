import { thumbnailFileTypes } from "@/app/constants";
import { addToast } from "@heroui/react";
import { useState } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { TVideoForm } from "../page";

interface ShowThumbnailsProps {
    register: UseFormRegister<TVideoForm>
    handleRemoveImage: () => void
    watch: UseFormWatch<TVideoForm>
}
export default function ShowThumbnails({ watch, handleRemoveImage, register, }: ShowThumbnailsProps) {
    const [newFileUrl, setNewFileUrl] = useState('')
    const thumbnailUrl = watch('thumbnailUrl');
    return (
        <div>
            <ul className="mb-2">
                <li className="text-xl font-bold">Thumbnail</li>
                <li className="text-sm text-gray-500">Set a thumbnail that stands out and draws viewer's attention.</li>
            </ul>
            <div className="flex gap-2">
                {(thumbnailUrl || newFileUrl) && (
                    <div className="relative w-[125px] h-[125px] flex gap-2">
                        <img
                            src={newFileUrl || thumbnailUrl as string}
                            alt="Thumbnail"
                            className="w-full h-32 object-cover rounded-md border-1 border-black"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-0 right-0 bg-black text-white rounded-full p-1 m-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                {!(newFileUrl || thumbnailUrl) && (
                    <div className="w-[125px] h-[125px]">
                        <label
                            htmlFor="addThumbnail"
                            className="h-full w-full text-center rounded-md flex-col border-2 border-dashed border-gray-300 aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-100 p-5"
                        >
                            <MdOutlineAddPhotoAlternate className="text-xl w-5 h-5 text-gray-500" />
                            <p className="text-sm text-gray-500 font-semibold">Add Thumbnail</p>
                        </label>
                        <input id="addThumbnail" type="file" accept={thumbnailFileTypes.join(',')}  {...register("newThumbnailFile", {
                            onChange: (e) => {

                                if (!thumbnailFileTypes.includes(e.target.files[0].type)) {
                                    addToast({
                                        color: 'danger',
                                        description: `only ${thumbnailFileTypes.join(', ')} are allowed`
                                    })
                                }
                                setNewFileUrl(URL.createObjectURL(e.target.files[0]))
                            }
                        })} className="hidden" />

                    </div>
                )}
            </div>
        </div>
    );

}
