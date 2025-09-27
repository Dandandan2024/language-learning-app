import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Simple security check - in production you'd want proper authentication
    const { secret } = await request.json();
    if (secret !== process.env.ADMIN_SECRET || !process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if database is already set up
    const userCount = await prisma.user.count();
    const lexemeCount = await prisma.lexeme.count();

    if (userCount > 0 || lexemeCount > 0) {
      return NextResponse.json({ 
        message: "Database already initialized",
        stats: {
          users: userCount,
          lexemes: lexemeCount
        }
      });
    }

    // Import and run the seed script
    const { execSync } = require('child_process');
    
    try {
      // Generate Prisma client
      execSync('npm run db:generate', { stdio: 'pipe' });
      
      // Push schema
      execSync('npm run db:push', { stdio: 'pipe' });
      
      // Seed data
      execSync('npm run db:seed', { stdio: 'pipe' });
      
      return NextResponse.json({ 
        message: "Database setup completed successfully",
        stats: {
          users: await prisma.user.count(),
          lexemes: await prisma.lexeme.count(),
          sentences: await prisma.sentence.count()
        }
      });
    } catch (error) {
      console.error('Setup error:', error);
      return NextResponse.json({ 
        error: "Failed to setup database",
        details: error.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check database status
    const stats = {
      users: await prisma.user.count(),
      lexemes: await prisma.lexeme.count(),
      sentences: await prisma.sentence.count(),
      cards: await prisma.card.count(),
      reviews: await prisma.review.count()
    };

    return NextResponse.json({
      message: "Database status",
      stats,
      isInitialized: stats.lexemes > 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database connection failed" }, 
      { status: 500 }
    );
  }
}