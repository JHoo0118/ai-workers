import Image, { ImageProps } from "next/image";
import { FC } from "react";

export interface EwImageProps extends ImageProps {
  containerClassName?: string;
}

const EwImage: FC<EwImageProps> = ({
  containerClassName = "",
  alt = "Ew-imgs",
  className = "object-cover w-full h-full",
  sizes = "(max-width: 600px) 480px, 800px",
  ...args
}) => {
  return (
    <div className={containerClassName}>
      <Image className={className} alt={alt} sizes={sizes} {...args} />
    </div>
  );
};

export default EwImage;
