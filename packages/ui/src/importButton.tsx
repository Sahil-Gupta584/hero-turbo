import React from 'react'
import { Button, Tooltip } from "@heroui/react";
import { FaPlus } from "react-icons/fa";

export default function ImportButton({onPress}:{onPress:()=>void}) {
  return (
    <Tooltip content="Import New Video" className="bg-black dark:bg-white text-white dark:text-black">
    <Button
      radius="full"
      className="p-[38px_27px] fixed bottom-10 right-5 bg-black dark:bg-white text-white dark:text-black"
      onPress={onPress}
    >
      <FaPlus className="text-xl " />
    </Button>
  </Tooltip>
    )
}
