import { Skeleton } from "@heroui/react";

export default function VideoFormSkeleton() {
    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
            {/* Video Preview Skeleton */}
            <Skeleton className="w-full h-[228px] sm:h-[340px] lg:h-[548px] shadow-md rounded-md" />

            {/* Buttons */}
            <div className="flex space-x-4">
                <Skeleton className="w-32 h-10 rounded-md" />
                <Skeleton className="w-32 h-10 rounded-md" />
            </div>

            {/* Video Details */}
            <div className="space-y-4">
                {/* Title */}
                <Skeleton className="h-6 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded" />

                {/* Description */}
                <Skeleton className="h-6 w-1/4 rounded" />
                <Skeleton className="h-20 w-full rounded" />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3 rounded" />
                <Skeleton className="w-32 h-20 rounded-md" />
            </div>

            {/* Playlists */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded" />
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded" />
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/3 rounded" />
                <Skeleton className="h-10 w-full rounded" />
            </div>
        </div>
    );
}