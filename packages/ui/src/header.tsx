'use client';
import { Skeleton } from "@heroui/react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export default function Header({ DrawerComponent }: { DrawerComponent:React.FC<{ session: Session}> }) {
  const { data } = useSession();
  return (
    <>
      <nav className="flex items-center justify-between p-2 md:text-2xl px-4 py-2 text-xl">
        <a href={"/"}>Syncly</a>
        {(data && data.user?.id) ? (
          <DrawerComponent session={data} />
        ) : (
          <Skeleton className="h-8 w-24 rounded-md" />
        )}
      </nav>
    </>
  );
}
