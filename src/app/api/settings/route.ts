import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserSettingsSchema } from "@/lib/core/schemas";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true }
    });

    const raw = (user?.settings as any) || {};
    const settings = UserSettingsSchema.parse(raw);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Allow partial updates
    const partialSchema = UserSettingsSchema.partial();
    const validation = partialSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid settings", details: validation.error.errors }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true }
    });

    const merged = { ...(existing?.settings as any || {}), ...validation.data };

    // Validate final merged settings against the full schema
    const finalSettings = UserSettingsSchema.parse(merged);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { settings: finalSettings }
    });

    return NextResponse.json({ settings: finalSettings });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}