import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { StatsPanel } from "@/components/stats-panel";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Language Learning App</CardTitle>
            <p className="text-gray-600">
              Learn through spaced repetition and comprehensible input
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Sign in to start your language learning journey!</p>
            <Button asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has completed placement
  const levelEstimate = await prisma.levelEstimate.findUnique({
    where: { userId: session.user.id }
  });

  if (!levelEstimate) {
    // Redirect to placement
    redirect('/placement');
  }

  // Check for due cards
  const dueCardsCount = await prisma.lexemeState.count({
    where: {
      userId: session.user.id,
      due: {
        lte: new Date()
      },
      suspended: false
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="flex flex-col items-center gap-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Welcome back!</CardTitle>
            <p className="text-gray-600">
              Your level: <span className="font-semibold text-blue-600">{levelEstimate.cefrBand}</span>
              {' '}(Confidence: {Math.round(levelEstimate.confidence * 100)}%)
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Study Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dueCardsCount}</div>
                <div className="text-sm text-gray-600">Due Now</div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{levelEstimate.vocabIndex.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Vocab Index</div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              {dueCardsCount > 0 ? (
                <Button asChild size="lg" className="w-full text-lg py-6">
                  <Link href="/study">
                    Study Now ({dueCardsCount} cards due)
                  </Link>
                </Button>
              ) : (
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">🎉</div>
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm text-gray-600">Check back later for more reviews</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                  <Link href="/settings">Settings</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/api/auth/signout">Sign Out</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full max-w-3xl">
          <StatsPanel />
        </div>
      </div>
    </div>
  );
}