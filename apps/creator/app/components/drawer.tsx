"use client";
import { getGoogleAuthUrl, logOut } from "@/lib/authActions";
import { getUserWithEditors } from "@/lib/dbActions";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/drawer";
import {
  Accordion,
  AccordionItem,
  addToast,
  Avatar,
  Button,
  useDisclosure,
} from "@heroui/react";
import { DrawerProfileHeader } from "@repo/ui";
import { Session, User } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCaretLeft } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { AddEditor } from "../modals/addEditor";
import { DeleteEditor } from "../modals/deleteEditor";

type TUserDetails = Awaited<ReturnType<typeof getUserWithEditors>>["result"];
export default function DrawerComponent({ session }: { session: Session }) {
  const [userDetails, setUserDetails] = useState<TUserDetails>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    (async () => {
      if (session?.user.id) {
        const res = await getUserWithEditors({ userId: session?.user.id });
        console.log("res", res);

        if (res.ok && res.result) {
          setUserDetails(res.result);
        }
      }
    })();
  }, [isOpen]);

  async function handleAddChannel() {
    try {
      const authUrl = await getGoogleAuthUrl();
      console.log("authUrl", authUrl);

      window.open(authUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.log("Error adding channel:", error);
      addToast({
        description: "Error adding channel",
        color: "danger",
      });
    }
  }

  return (
    <>
      <Button
        onPress={onOpen}
        className="flex items-center justify-end sm:justify-center px-0 sm:px-2 gap-2 bg-transparent hover:bg-gray-300 transition py-1 rounded-md min-w-fit"
      >
        <Avatar
          className="md:h-7 md:w-7"
          src={session?.user.image as string}
          fallback
        />
        <span className="capitalize hidden sm:inline text-sm mt-1">
          {session?.user.name}
        </span>
      </Button>

      <Drawer
        className="h-screen max-w-5xl left-0"
        placement="left"
        isOpen={isOpen}
        onClose={onClose}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="justify-between pr-10">
                <strong>Workspace</strong>
                {/* Removing ThemeSwitch from here */}
              </DrawerHeader>
              <DrawerBody>
                <DrawerProfileHeader
                  session={session}
                  handleLogout={() => logOut()}
                />

                <Accordion selectionMode="multiple">
                  <AccordionItem
                    aria-label="Accordion 1"
                    title="Editors"
                    className="birder-4 border-t-0 border-l-0 border-r-0 border-b-2 border-black dark:border-white"
                    classNames={{
                      title: ["text-[26px] font-semibold"],
                    }}
                    indicator={<FaCaretLeft fill="currentColor" />}
                  >
                    <div className="flex items-center justify-between px-5">
                      <div></div>
                      {userDetails && userDetails.editors.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No editors added yet
                        </p>
                      )}

                      {session.user.id && (
                        <AddEditor creator={session.user as User} />
                      )}
                    </div>
                    <div className="flex gap-4 items-center flex-wrap p-4">
                      {userDetails &&
                        userDetails.editors.map(({ editor }) => (
                          <div
                            className="flex justify-between items-center w-full"
                            key={editor.id}
                          >
                            <div
                              className="flex gap-4 items-center pl-10"
                              key={editor.id}
                            >
                              <Avatar
                                className="h-20 w-20"
                                src={editor.image}
                                fallback
                              />
                              <ul>
                                <span className="capitalize text-xl">
                                  {editor.name}
                                </span>
                                <p className="text-sm text-gray-500">
                                  {editor.email}
                                </p>
                              </ul>
                            </div>
                            <DeleteEditor
                              editor={editor}
                              creatorId={session.user.id}
                            />
                          </div>
                        ))}
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="channels"
                    aria-label="Accordion 2"
                    title="Channels"
                    className="birder-4 border-t-0 border-l-0 border-r-0 border-b-2 border-black dark:border-white"
                    classNames={{
                      title: ["text-[26px] font-semibold"],
                    }}
                    indicator={<FaCaretLeft fill="currentColor" />}
                  >
                    <div className="flex items-center justify-end px-5">
                      <Button
                        className=" self-end"
                        endContent={<MdAdd />}
                        size="sm"
                        color="primary"
                        onPress={handleAddChannel}
                      >
                        Add Channel
                      </Button>
                    </div>
                    <div className="flex gap-4 items-center flex-wrap p-4">
                      {userDetails &&
                        userDetails.channels.map((channel) => (
                          <Link
                            href={`https://www.youtube.com/channel/${channel.ytChannelId}`}
                            className="flex gap-4 items-center pl-10"
                            key={channel.id}
                          >
                            <Avatar
                              className="h-14 w-14"
                              src={channel.logoUrl}
                              fallback
                            />
                            <span className="capitalize text-[22px]">
                              {channel?.name}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </AccordionItem>
                </Accordion>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
