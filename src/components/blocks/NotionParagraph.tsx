import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Link from "next/link";
import { FC } from "react";

type Props = {
  block: BlockObjectResponse;
};

export const NotionParagraph: FC<Props> = ({ block }) => {
  if (block.type !== "paragraph") return null;

  if (block.paragraph.rich_text.length > 0) {
    return (
      <p key={block.id} className="min-h-8 py-1">
        {block.paragraph.rich_text.map((rich_text) => {
          if (rich_text.type === "text") {
            return rich_text.text.link
              ? (
                <Link key={rich_text.text.content} href={rich_text.text.link.url} target="_blank" className="underline">
                  {rich_text.text.content}
                </Link>
              )
              : <span key={rich_text.text.content}>{rich_text.text.content}</span>;
          }
          return null;
        })}
      </p>
    );
  }
  return <p key={block.id} className="min-h-8 py-1"></p>;
};
