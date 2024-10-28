import notion from "@/lib/notionClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { blockId: string } },
) {
  const data = await notion.blocks.children.list({
    block_id: params.blockId,
    page_size: 100,
  });

  return NextResponse.json(data);
}
