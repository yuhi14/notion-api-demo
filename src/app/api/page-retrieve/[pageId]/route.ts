import notion from "@/lib/notionClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const data = await notion.pages.retrieve({
    page_id: params.pageId,
  });

  return NextResponse.json(data);
}
