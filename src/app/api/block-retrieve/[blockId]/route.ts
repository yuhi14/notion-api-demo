import notion from "@/lib/notionClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { blockId: string } },
) {
  const data = await notion.blocks.retrieve({
    block_id: params.blockId,
  });

  return NextResponse.json(data);
}
