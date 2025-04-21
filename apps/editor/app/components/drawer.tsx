import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from "@heroui/drawer";
import {
  Accordion,
  AccordionItem,
  Avatar, Button,useDisclosure
} from "@heroui/react";
import { Session } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCaretLeft } from "react-icons/fa";

export default function DrawerComponent({ session }: { session: Session }) {
  const [userDetails, setUserDetails] = useState<TUserDetails>(null)
  const { isOpen, onOpen, onClose } = useDisclosure();



  return (
    <>
      <Button onPress={onOpen} className="flex items-center justify-center gap-2 bg-transparent hover:bg-gray-300 transition px-2 py-1 rounded-md">

        <Avatar className="md:h-7 md:w-7 " src={session?.user.image as string} fallback />
        <span className="capitalize hidden sm:inline text-sm  mt-1">{session?.user.name}</span>
      </Button>

      <Drawer className=" h-screen max-w-5xl left-0 bg-white " placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerContent >
          {(onClose) => (
            <>
              <DrawerBody>
 <Accordion selectionMode="multiple">
                  <AccordionItem
                    aria-label="Accordion 1"
                    title="Creators"
                    className=" birder-4 border-t-0 border-l-0 border-r-0 border-b-2 border-black"
                    classNames={{
                      title: ["text-[26px] font-semibold "],
                    }}
                    indicator={<FaCaretLeft fill="black" />}
                  >
                    <div className="flex items-center justify-between px-5">
                      <div></div>
                      {userDetails && userDetails.editors.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No editors added yet
                        </p>
                      )}

                    </div>
                    <div className="flex gap-4 items-center flex-wrap p-4">
                      {userDetails &&
                        userDetails.editors.map(({ editor }) => (
                          <div className="flex justify-between items-center w-full">
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
                            {/* <DeleteEditor editor={editor} creatorId={session.user.id} /> */}
                          </div>
                        ))}
                    </div>
                  </AccordionItem>
                </Accordion>              </DrawerBody>
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

