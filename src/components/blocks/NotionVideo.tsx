import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { FC } from "react";

type Props = {
  block: BlockObjectResponse;
};

export const NotionVideo: FC<Props> = ({ block }) => {
  if (block.type !== "video") return null;
  if (!("file" in block.video)) return null;

  return (
    <div className="relative my-2 aspect-video w-full">
      <video src={block.video.file.url} controls />
    </div>
  );
};
