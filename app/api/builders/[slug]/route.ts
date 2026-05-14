import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const data: any = {
  mantra: {
    name: "Mantra",
    projects: [
      { name: "Mantra Riverside", slug: "mantra-riverside", city: "Pune" },
      { name: "Mantra One Residency", slug: "mantra-one-residency", city: "Pune" }
    ]
  },
  lodha: {
    name: "Lodha",
    projects: [
      { name: "Lodha Amara", slug: "lodha-amara", city: "Mumbai" },
      { name: "Lodha Belmondo", slug: "lodha-belmondo", city: "Pune" }
    ]
  }
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // ⭐ IMPORTANT CHANGE

    const builder = data[slug];

    if (!builder) {
      return NextResponse.json({ error: "Builder not found" }, { status: 404 });
    }

    return NextResponse.json(builder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch builder" }, { status: 500 });
  }
}