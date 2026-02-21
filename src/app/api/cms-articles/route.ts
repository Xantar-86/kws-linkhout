import { NextResponse } from "next/server";
import { getCmsArticles } from "@/lib/news-server";

export async function GET() {
  try {
    const articles = await getCmsArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching CMS articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
