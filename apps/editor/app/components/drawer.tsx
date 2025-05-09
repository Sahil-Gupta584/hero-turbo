"use client";
import { logOut } from "@/lib/authActions";
import { getEditorCreators } from "@/lib/dbActions";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { addToast, Avatar, Button, useDisclosure } from "@heroui/react";
import { DrawerProfileHeader, ThemeSwitch } from "@repo/ui";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
type TCreators = NonNullable<
  Awaited<ReturnType<typeof getEditorCreators>>["result"]
>["creators"];
export default function DrawerComponent({ session }: { session: Session }) {
  const [creators, setCreators] = useState<TCreators | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    (async () => {
      const { result, error } = await getEditorCreators(
        session.user.id as string
      );
      if (result) setCreators(result.creators);
      if (error instanceof Error) {
        addToast({
          description: "Error fetching creators.",
          color: "danger",
        });
      }
    })();
  }, [session.user.id]);

  return (
    <>
      <Button
        onPress={onOpen}
        className="flex items-center justify-end sm:justify-center px-0 sm:px-2 gap-2 bg-transparent hover:bg-gray-300 transition py-1 rounded-md min-w-fit "
      >
        <Avatar
          className="md:h-7 md:w-7 "
          src={session?.user.image as string}
          fallback
        />
        <span className="capitalize hidden sm:inline text-sm  mt-1">
          {session?.user.name}
        </span>
      </Button>

      <Drawer
        className=" h-screen max-w-5xl left-0  "
        placement="left"
        isOpen={isOpen}
        onClose={onClose}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center justify-between text-2xl pr-10">
                Joined Creators
              </DrawerHeader>
              <ThemeSwitch />
              <DrawerProfileHeader
                session={session}
                handleLogout={() => logOut()}
              />
              <DrawerBody>
                {creators && creators.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">
                    No Creators joined yet
                  </p>
                )}
                <div className="flex gap-4 items-center flex-wrap p-4">
                  {creators &&
                    creators.map(({ creator }, i) => (
                      <div key={creator.id}>
                        <div className="flex justify-between items-center w-full ">
                          <div
                            className="flex gap-4 items-center pl-10"
                            key={creator.id}
                          >
                            <Avatar
                              className="h-20 w-20"
                              src={creator.image}
                              fallback
                            />
                            <ul>
                              <span className="capitalize text-xl">
                                {creator.name}
                              </span>
                              <p className="text-sm text-gray-500">
                                {creator.email}
                              </p>
                            </ul>
                          </div>
                          {/* <DeleteEditor editor={editor} creatorId={session.user.id} /> */}
                        </div>
                        {i !== 0 && (
                          <div className="h-[1px] bg-gray-300 w-full my-4" />
                        )}
                      </div>
                    ))}
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
