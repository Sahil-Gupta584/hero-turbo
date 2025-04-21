import { HTMLProps } from 'react';

interface TagProps {
    className?: HTMLProps<HTMLElement>["className"];
    text: string
}
const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
    PENDING: "bg-orange-100 text-orange-800 border-orange-300",
    SCHEDULED: "bg-blue-100 text-blue-800 border-blue-300",
    UPLOADING: "bg-green-100 text-green-800 border-green-300",
};
export default function Tag({ text, className }: TagProps) {
    return (
        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-blue-100 text-blue-800 border ${statusColors[text] || "bg-gray-200 text-gray-800 border-gray-400"} ${className}`}>
            {text}
        </span>
    )
}
