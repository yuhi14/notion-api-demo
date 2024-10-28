import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";
import { FC } from "react";

type Props = {
  block: BlockObjectResponse;
};

export const NotionImage: FC<Props> = ({ block }) => {
  if (block.type !== "image") return null;
  if (!("file" in block.image)) return null;

  return (
    <div className="relative my-2 aspect-video w-full">
      <Image src={block.image.file.url} alt="cover" fill className="object-cover" priority />
    </div>
  );
};
