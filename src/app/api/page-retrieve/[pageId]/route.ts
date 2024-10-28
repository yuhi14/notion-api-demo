import notion from "@/lib/notionClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const pageId = (await params).pageId;
  try {
    const data = await notion.pages.retrieve({
      page_id: pageId,
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    throw new Error("notion-api-error");
  }
}
