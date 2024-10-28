import { NotionParagraph } from "@/components/blocks/NotionParagraph";
import Image from "next/image";

import { NotionImage } from "@/components/blocks/NotionImage";
import { NotionVideo } from "@/components/blocks/NotionVideo";
import {
  GetBlockResponse,
  GetPageResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";

const NOTION_LOOT_ID = process.env.NEXT_PUBLIC_NOTION_LOOT_ID || "";
const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT || "http://localhost:3000";
const MESSAGES = {
  PAGE_LOAD_ERROR: "ページを読み込めませんでした。NotionのページIDが正しいか確認してください。",
  UNVERIFIED_ERROR: "未検証のエラーが発生しました。",
};

const fetchPageRetrieve = async (pageId: string): Promise<GetPageResponse | null> => {
  try {
    const res = await fetch(`${API_ROOT}/api/page-retrieve/${pageId}`, { cache: "no-store" });
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
const fetchBlockRetrieve = async (blockId: string): Promise<GetBlockResponse | null> => {
  try {
    const res = await fetch(`${API_ROOT}/api/block-retrieve/${blockId}`, { cache: "no-store" });
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
const fetchBlockChildren = async (blockId: string): Promise<ListBlockChildrenResponse | null> => {
  try {
    const res = await fetch(`${API_ROOT}/api/block-children/${blockId}`, { cache: "no-store" });
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getTargetId = async () => {
  const lootBlockChildren = await fetchBlockChildren(NOTION_LOOT_ID);
  if (lootBlockChildren && lootBlockChildren.results) {
    const codeBlock = lootBlockChildren.results.find(block =>
      "type" in block && block.type === "code"
    );
    return codeBlock?.code.rich_text[0]?.plain_text || "";
  }
  return "";
};

export default async function Home() {
  const targetId = await getTargetId();
  if (!targetId) return <>{MESSAGES.PAGE_LOAD_ERROR}</>;

  const [pageRetrieve, blockRetrieve, blockChildren] = await Promise.all([
    fetchPageRetrieve(targetId),
    fetchBlockRetrieve(targetId),
    fetchBlockChildren(targetId),
  ]);

  if (!pageRetrieve || !blockRetrieve || !blockChildren) return <>{MESSAGES.PAGE_LOAD_ERROR}</>;

  if (!("properties" in pageRetrieve) || !("type" in blockRetrieve)) {
    return <>{MESSAGES.UNVERIFIED_ERROR}</>;
  }

  return (
    <div>
      <header className="px-4 py-2">
        <p className="text-2xl font-bold">Material PF Viewer Demo</p>
        <p>Providing contents from Notion</p>
      </header>
      <div className="relative aspect-[3/1] w-full bg-gray-100">
        {pageRetrieve.cover && pageRetrieve.cover.type === "external"
          && (
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
          {"results" in blockChildren && blockChildren.results.map((block) => {
            if (!("type" in block)) return null;
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
