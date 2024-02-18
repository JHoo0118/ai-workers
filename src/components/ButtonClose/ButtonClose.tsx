import twFocusClass from "@/lib/utils/twFocusClass";
import { XIcon } from "lucide-react";
import React from "react";

export interface ButtonCloseProps {
  className?: string;
  onClick?: () => void;
  iconSize?: string;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
  className = "",
  onClick = () => {},
  iconSize = "w-5 h-5",
}) => {
  return (
    <button
      className={
        `flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 ${className} ` +
        twFocusClass()
      }
      onClick={onClick}
    >
      <span className="sr-only">Close</span>
      <XIcon className={iconSize} />
    </button>
  );
};

export default ButtonClose;
