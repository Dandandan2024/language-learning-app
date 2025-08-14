"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlacementItem } from "@/lib/core";

export function PlacementWizard() {
  const [currentItem, setCurrentItem] = useState<PlacementItem | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load the next placement item
  const loadNext = async () => {
    setLoading(true);
    setError(null);
    setShowTranslation(false);
    
    try {
      const response = await fetch('/api/placement/next');
      
      if (!response.ok) {
        if (response.status === 409) {
          // Placement already completed
          router.push('/study');
          return;
        }
        throw new Error('Failed to load next item');
      }
      
      const item = await response.json();
      setCurrentItem(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer and load next item or finish
  const submitAnswer = async (outcome: 'easy' | 'hard') => {
    if (!currentItem) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/placement/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome,
          lexemeId: currentItem.lexemeId
        })
      });
      
      if (!response.ok) {
        // Try to extract server error message
        let message = 'Failed to submit answer';
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {}
        
        if (response.status === 401) {
          message = 'Please sign in to continue';
        }
        if (response.status === 409) {
          // Placement is done or blocked; route to study
          router.push('/study');
          return;
        }
        throw new Error(message);
      }
      
      const result = await response.json();
      
      if (result.continue) {
        // Load next item
        await loadNext();
      } else {
        // Placement finished
        router.push('/study');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Load first item on mount
  useEffect(() => {
    loadNext();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (loading) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          submitAnswer('hard');
          break;
        case 'ArrowRight':
          submitAnswer('easy');
          break;
        case '?':
          setShowTranslation(!showTranslation);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [loading, showTranslation, currentItem]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>{error}</p>
            <Button onClick={loadNext}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const progressValue = (currentItem.meta.idx / currentItem.meta.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="mb-4">Level Assessment</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentItem.meta.idx} of {currentItem.meta.total}</span>
              <span>Press ? for translation</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Sentence Display */}
          <div className="text-center space-y-4">
            <div className="text-2xl font-medium leading-relaxed p-6 bg-white rounded-lg shadow-sm">
              {currentItem.sentence?.textL2}
            </div>
            
            {showTranslation && currentItem.sentence?.textL1 && (
              <div className="text-lg text-gray-600 p-4 bg-gray-50 rounded-lg">
                {currentItem.sentence.textL1}
              </div>
            )}
            
            {!showTranslation && (
              <button
                onClick={() => setShowTranslation(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Show translation
              </button>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => submitAnswer('hard')}
              disabled={loading}
              className="min-w-[120px] text-lg py-6"
            >
              Hard
              <span className="block text-xs mt-1">←</span>
            </Button>
            
            <Button
              size="lg"
              onClick={() => submitAnswer('easy')}
              disabled={loading}
              className="min-w-[120px] text-lg py-6"
            >
              Easy
              <span className="block text-xs mt-1">→</span>
            </Button>
          </div>
          
          {/* Instructions */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Rate how difficult this sentence is for you</p>
            <p>Use keyboard arrows (← Hard, → Easy) or click the buttons</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
