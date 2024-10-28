import { NotionParagraph } from "@/components/blocks/NotionParagraph";
import Image from "next/image";

import { NotionImage } from "@/components/blocks/NotionImage";
import { NotionVideo } from "@/components/blocks/NotionVideo";
import {
  BlockObjectResponse,
  GetBlockResponse,
  GetPageResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const NOTION_LOOT_ID = process.env.NEXT_PUBLIC_NOTION_LOOT_ID || "";
const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT || "http://localhost:3000";

const fetchPageRetrieve = async (pageId: string): Promise<GetPageResponse> => {
  const res = await fetch(`${API_ROOT}/api/page-retrieve/${pageId}`);
  return await res.json();
};
const fetchBlockRetrieve = async (blockId: string): Promise<GetBlockResponse> => {
  const res = await fetch(`${API_ROOT}/api/block-retrieve/${blockId}`);
  return await res.json();
};
const fetchBlockChildren = async (blockId: string): Promise<ListBlockChildrenResponse> => {
  const res = await fetch(`${API_ROOT}/api/block-children/${blockId}`);
  return await res.json();
};

const isPageObjectResponse = (response: GetPageResponse): response is PageObjectResponse => {
  return "properties" in response;
};
const isBlockObjectResponse = (response: GetBlockResponse): response is BlockObjectResponse => {
  return "type" in response;
};

const getTargetId = async () => {
  try {
    const lootBlockChildren = await fetchBlockChildren(NOTION_LOOT_ID);
    if (lootBlockChildren.results) {
      const codeBlock = lootBlockChildren.results.find(block =>
        "type" in block && block.type === "code"
      );
      return codeBlock?.code.rich_text[0].plain_text || "";
    }
    return "";
  } catch (e) {
    console.error(e);
  }
};

export default async function Home() {
  const targetId = await getTargetId();

  if (!targetId) {
    return <>ページを読み込めませんでした。NotionのページIDが正しいか確認してください。</>;
  }

  const [pageRetrieve, blockRetrieve, blockChildren] = await Promise.all([
    fetchPageRetrieve(targetId),
    fetchBlockRetrieve(targetId),
    fetchBlockChildren(targetId),
  ]);

  if (!isPageObjectResponse(pageRetrieve)) throw new Error("type-error");
  if (!isBlockObjectResponse(blockRetrieve)) throw new Error("type-error");

  return (
    <div>
      <header className="px-4 py-2">
        <p className="text-2xl font-bold">Material PF Viewer Demo</p>
        <p>Providing contents from Notion</p>
      </header>
      <div className="relative aspect-[3/1] w-full bg-gray-100">
        {pageRetrieve.cover && pageRetrieve.cover.type === "external" && (
          <Image
            src={pageRetrieve.cover.external.url}
            alt="cover"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
      <div className="relative mx-auto w-full max-w-[800px] px-8 py-20">
        {pageRetrieve.icon && pageRetrieve.icon.type === "emoji" && (
          <div className="absolute -top-12 z-50 text-8xl">
            {pageRetrieve.icon.emoji}
          </div>
        )}

        <h1 className="text-4xl font-bold">
          {blockRetrieve.type === "child_page" && blockRetrieve.child_page.title}
        </h1>
        <div className="mt-2">
          {blockChildren.results.map((block) => {
            if (!isBlockObjectResponse(block)) return null;
            switch (block.type) {
              case "paragraph":
                return <NotionParagraph key={block.id} block={block} />;
              case "image":
                return <NotionImage key={block.id} block={block} />;
              case "video":
                return <NotionVideo key={block.id} block={block} />;
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
