"use client";
import { Avatar, Button } from "@heroui/react";
import { Session } from "next-auth";
import { FiLogOut } from "react-icons/fi";
import ThemeSwitch from "./themeSwitch.tsx";

export default function DrawerProfileHeader({
  session,
  handleLogout,
}: {
  handleLogout: () => void;
  session: Session;
}) {
  if (!session.user) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar
          className="h-10 w-10"
          src={session.user.image as string}
          fallback
        />
        <div>
          <p className="font-medium">{session?.user.name}</p>
          <p className="text-xs text-gray-500">{session?.user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitch />
        <Button
          color="danger"
          variant="light"
          size="sm"
          onPress={handleLogout}
          startContent={<FiLogOut />}
          className="min-w-fit"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
