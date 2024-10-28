import notion from "@/lib/notionClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  const blockId = (await params).blockId;
  try {
    const data = await notion.blocks.retrieve({
      block_id: blockId,
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    throw new Error("notion-api-error");
  }
}
