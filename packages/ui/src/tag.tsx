import { HTMLProps } from "react";

interface TagProps {
  className?: HTMLProps<HTMLElement>["className"];
  text: string;
}

// Tailwind dark mode class variants added for each status
const statusColors: Record<string, string> = {
  DRAFT:
    "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600",
  PENDING:
    "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700",
  SCHEDULED:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
  UPLOADING:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
};

export default function Tag({ text, className }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md border ${
        statusColors[text] ||
        "bg-gray-200 text-gray-800 border-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      } ${className}`}
    >
      {text}
    </span>
  );
}
