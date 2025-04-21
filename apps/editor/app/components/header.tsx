import { Skeleton } from "@heroui/react";
import { Session } from "next-auth";
import Link from "next/link";
import DrawerComponent from "./drawer";

export default function Header({ session }: { session: Session | null }) {

    return <>
        <nav className="flex items-center justify-between p-2 md:text-2xl px-4 py-2 text-xl">
            <Link href={"/"}>Syncly</Link>
            {session?.user.id ? <DrawerComponent session={session} /> : <Skeleton className="h-8 w-20 rounded-md" />}
        </nav>
    </>;
}