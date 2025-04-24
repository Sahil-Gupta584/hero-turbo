export type TBackendRes<T> = {
  ok: boolean;
  error?: Error;
  result?: T | null;
};

export const backendRes = <T = undefined>({
  ok,
  error,
  result,
}: TBackendRes<T>): TBackendRes<T> => {
  return {
    ok,
    error,
    result,
  };
};

export type TUpdateThumbnailsProps = {
  videos: {
    thumbnailLink?: string;
    videoId: string;
    gDriveId: string;
  }[];
  ownerId: string;
};
