"use client";
import { Button, Tooltip } from "@heroui/react";
import { FaPlus } from "react-icons/fa";

export default function ImportButton({ onPress }: { onPress: () => void }) {
  return (
    <Tooltip content="Import New Video" color="primary">
      <Button
        radius="full"
        className="p-[38px_27px] fixed bottom-10 right-5"
        onPress={onPress}
        color="primary"
      >
        <FaPlus className="text-xl " />
      </Button>
    </Tooltip>
  );
}
