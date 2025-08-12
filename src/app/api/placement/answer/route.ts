import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  start,
  update,
  shouldStop,
  generateLevelEstimate,
  PlacementAnswerSchema
} from "@/lib/core";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validation = PlacementAnswerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { outcome, lexemeId } = validation.data;

    // Check if user already has a level estimate
    const existingEstimate = await prisma.levelEstimate.findUnique({
      where: { userId }
    });

    if (existingEstimate) {
      return NextResponse.json(
        { error: "Placement already completed" }, 
        { status: 409 }
      );
    }

    // Get current placement state from user settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true }
    });

    const settings = (user?.settings as any) || {};
    const placementState = settings.placementState || start();

    // Update placement state with the user's response
    const newState = update(placementState, outcome);

    // Check if we should stop the placement test
    const finished = shouldStop(newState);

    if (finished) {
      // Generate final level estimate
      const estimate = generateLevelEstimate(newState);

      // Save level estimate to database
      await prisma.levelEstimate.create({
        data: {
          userId,
          cefrBand: estimate.cefrBand,
          vocabIndex: estimate.vocabIndex,
          confidence: estimate.confidence
        }
      });

      // Clear placement state from user settings
      await prisma.user.update({
        where: { id: userId },
        data: {
          settings: {
            ...settings,
            placementState: undefined
          }
        }
      });

      return NextResponse.json({
        continue: false,
        estimate
      });
    } else {
      // Save updated placement state
      await prisma.user.update({
        where: { id: userId },
        data: {
          settings: {
            ...settings,
            placementState: newState
          }
        }
      });

      return NextResponse.json({
        continue: true
      });
    }

  } catch (error) {
    console.error("Placement answer error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
