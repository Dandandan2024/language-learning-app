"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudyCard } from "@/lib/core";

export function StudyInterface() {
  const [currentCard, setCurrentCard] = useState<StudyCard | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [nextDue, setNextDue] = useState<Date | null>(null);

  // Load the next study card
  const loadNext = async () => {
    setLoading(true);
    setError(null);
    setShowTranslation(false);
    setReviewComplete(false);
    setNextDue(null);
    
    try {
      const response = await fetch('/api/study/next');
      
      if (!response.ok) {
        if (response.status === 409) {
          setError('No cards due for review right now! 🎉');
          return;
        }
        throw new Error('Failed to load next card');
      }
      
      const card = await response.json();
      setCurrentCard(card);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Submit rating and load next card
  const submitRating = async (rating: 1 | 2 | 3 | 4) => {
    if (!currentCard) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/study/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.cardId,
          rating
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      const result = await response.json();
      setNextDue(new Date(result.nextDue));
      setReviewComplete(true);
      
      // Auto-load next card after showing result
      setTimeout(() => {
        loadNext();
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Load first card on mount
  useEffect(() => {
    loadNext();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (loading || reviewComplete) return;
      
      switch (e.key) {
        case '1':
          submitRating(1); // Again
          break;
        case '2':
          submitRating(2); // Hard
          break;
        case '3':
          submitRating(3); // Good
          break;
        case '4':
          submitRating(4); // Easy
          break;
        case ' ':
        case 'Enter':
          setShowTranslation(!showTranslation);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [loading, showTranslation, reviewComplete, currentCard]);

  // Format next due time
  const formatNextDue = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'later today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays < 7) return `in ${diffDays} days`;
    if (diffDays < 30) return `in ${Math.ceil(diffDays / 7)} weeks`;
    return `in ${Math.ceil(diffDays / 30)} months`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Study Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>{error}</p>
            <Button onClick={loadNext}>Check Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviewComplete && nextDue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold">Great job!</h2>
            <p className="text-gray-600">
              This card will come back {formatNextDue(nextDue)}
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Loading next card...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle>Study Session</CardTitle>
          <p className="text-sm text-gray-600">
            Learning: <span className="font-medium">{currentCard.lexeme.lemma}</span>
            {currentCard.lexeme.pos && ` (${currentCard.lexeme.pos})`}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Sentence Display */}
          <div className="text-center space-y-6">
            <div className="text-3xl font-medium leading-relaxed p-8 bg-white rounded-lg shadow-sm">
              {/* Highlight target form if available */}
              {currentCard.sentence.targetForm ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: currentCard.sentence.textL2.replace(
                      new RegExp(`\\b${currentCard.sentence.targetForm}\\b`, 'gi'),
                      `<span class="bg-yellow-200 px-1 rounded">${currentCard.sentence.targetForm}</span>`
                    )
                  }}
                />
              ) : (
                currentCard.sentence.textL2
              )}
            </div>
            
            {showTranslation ? (
              <div className="text-xl text-gray-700 p-6 bg-gray-50 rounded-lg">
                {currentCard.sentence.textL1}
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowTranslation(true)}
                className="text-lg px-8 py-3"
              >
                Show Translation
                <span className="ml-2 text-sm">(Space)</span>
              </Button>
            )}
          </div>
          
          {/* Rating Buttons */}
          {showTranslation && (
            <div className="grid grid-cols-4 gap-4">
              <Button
                variant="destructive"
                onClick={() => submitRating(1)}
                disabled={loading}
                className="flex flex-col space-y-1 h-20"
              >
                <span className="text-lg font-semibold">Again</span>
                <span className="text-xs">1</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => submitRating(2)}
                disabled={loading}
                className="flex flex-col space-y-1 h-20 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <span className="text-lg font-semibold">Hard</span>
                <span className="text-xs">2</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => submitRating(3)}
                disabled={loading}
                className="flex flex-col space-y-1 h-20 border-green-300 text-green-700 hover:bg-green-50"
              >
                <span className="text-lg font-semibold">Good</span>
                <span className="text-xs">3</span>
              </Button>
              
              <Button
                onClick={() => submitRating(4)}
                disabled={loading}
                className="flex flex-col space-y-1 h-20 bg-blue-600 hover:bg-blue-700"
              >
                <span className="text-lg font-semibold">Easy</span>
                <span className="text-xs">4</span>
              </Button>
            </div>
          )}
          
          {/* Instructions */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            {!showTranslation ? (
              <p>Press Space to reveal the translation, then rate your recall</p>
            ) : (
              <div>
                <p>How well did you remember this sentence?</p>
                <p>Use keyboard numbers 1-4 or click the buttons</p>
              </div>
            )}
          </div>
          
          {/* Card Stats */}
          <div className="text-xs text-gray-400 text-center space-y-1">
            <p>Difficulty: {currentCard.state.difficulty.toFixed(1)} | Stability: {currentCard.state.stability.toFixed(1)} days</p>
            <p>Due: {currentCard.state.due.toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
