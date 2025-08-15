'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Lexeme {
  id: string;
  lemma: string;
  pos: string | null;
  cefr: string;
  freqRank: number;
  px: number;
  py: number;
  conf: number;
}

interface LexemeState {
  userId: string;
  lexemeId: string;
  due: Date;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  lastReview: Date | null;
  suspended: boolean;
}

interface Review {
  id: string;
  userId: string;
  lexemeId: string;
  cardId: string;
  rating: number; // 1 again, 2 hard, 3 good, 4 easy
  reviewedAt: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
}

export default function VocabularyWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Lexeme[]>([]);
  const [scale, setScale] = useState(2);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [pointSize, setPointSize] = useState(2.4);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [stats, setStats] = useState({ 1: 0, 5: 0, 7: 0, 10: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout function using golden angle spiral
  const layout = useCallback(() => {
    if (!points || points.length === 0) return;
    
    const GA = Math.PI * (3 - Math.sqrt(5));
    const newPoints = points.map((point, i) => {
      const r = 3.1 * Math.sqrt(i + 2);
      const t = (i + 2) * GA;
      return {
        ...point,
        px: r * Math.cos(t),
        py: r * Math.sin(t),
      };
    });
    setPoints(newPoints);
  }, [points]);

  // Calculate confidence based on study performance
  const calculateConfidence = useCallback((lexemeState: LexemeState | null, reviews: Review[]): number => {
    if (!lexemeState) {
      return 1; // Never studied
    }

    if (lexemeState.suspended) {
      return 1; // Suspended words
    }

    // Base confidence on stability and difficulty
    let baseConfidence = lexemeState.stability * 0.6 + (1 - lexemeState.difficulty) * 0.4;
    
    // Adjust based on recent performance
    const recentReviews = reviews
      .filter(r => r.lexemeId === lexemeState.lexemeId)
      .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())
      .slice(0, 5); // Last 5 reviews

    if (recentReviews.length > 0) {
      const avgRating = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
      const ratingBonus = (avgRating - 2.5) * 0.2; // -0.3 to +0.3
      baseConfidence += ratingBonus;
    }

    // Penalize for lapses
    const lapsePenalty = Math.min(lexemeState.lapses * 0.1, 0.3);
    baseConfidence -= lapsePenalty;

    // Normalize to 0-1 range
    baseConfidence = Math.max(0, Math.min(1, baseConfidence));

    // Convert to confidence levels (1, 5, 7, 10)
    if (baseConfidence >= 0.8) return 10;
    if (baseConfidence >= 0.6) return 7;
    if (baseConfidence >= 0.4) return 5;
    return 1;
  }, []);

  // Sample data for demonstration when database is not available
  const sampleData: Lexeme[] = [
    { id: '1', lemma: 'hello', pos: 'interjection', cefr: 'A1', freqRank: 1, px: 0, py: 0, conf: 10 },
    { id: '2', lemma: 'good', pos: 'adjective', cefr: 'A1', freqRank: 2, px: 0, py: 0, conf: 7 },
    { id: '3', lemma: 'water', pos: 'noun', cefr: 'A1', freqRank: 3, px: 0, py: 0, conf: 5 },
    { id: '4', lemma: 'eat', pos: 'verb', cefr: 'A1', freqRank: 4, px: 0, py: 0, conf: 1 },
    { id: '5', lemma: 'house', pos: 'noun', cefr: 'A1', freqRank: 5, px: 0, py: 0, conf: 10 },
    { id: '6', lemma: 'because', pos: 'conjunction', cefr: 'A2', freqRank: 50, px: 0, py: 0, conf: 7 },
    { id: '7', lemma: 'understand', pos: 'verb', cefr: 'A2', freqRank: 51, px: 0, py: 0, conf: 5 },
    { id: '8', lemma: 'friend', pos: 'noun', cefr: 'A2', freqRank: 52, px: 0, py: 0, conf: 1 },
    { id: '9', lemma: 'suggest', pos: 'verb', cefr: 'B1', freqRank: 200, px: 0, py: 0, conf: 10 },
    { id: '10', lemma: 'opinion', pos: 'noun', cefr: 'B1', freqRank: 201, px: 0, py: 0, conf: 7 },
    { id: '11', lemma: 'despite', pos: 'preposition', cefr: 'B2', freqRank: 500, px: 0, py: 0, conf: 5 },
    { id: '12', lemma: 'achieve', pos: 'verb', cefr: 'B2', freqRank: 501, px: 0, py: 0, conf: 1 },
  ];

  // Fetch user's lexeme data
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching vocabulary data...');

      // Fetch all lexemes with their states and reviews
      const response = await fetch('/api/vocabulary-web/data');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        
        // If it's a database connection error, show sample data instead
        if (response.status === 500 || response.status === 503) {
          console.log('Database not available, showing sample data');
          setPoints(sampleData);
          const newStats = { 1: 0, 5: 0, 7: 0, 10: 0 };
          sampleData.forEach((p: Lexeme) => newStats[p.conf as keyof typeof newStats]++);
          setStats(newStats);
          return;
        }
        
        throw new Error(`Failed to fetch vocabulary data: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Check if we have the required data
      if (!data.lexemes || !Array.isArray(data.lexemes)) {
        console.warn('No lexemes found in data, setting empty array');
        setPoints([]);
        setStats({ 1: 0, 5: 0, 7: 0, 10: 0 });
        return;
      }
      
      // Calculate confidence for each lexeme
      const lexemesWithConfidence = data.lexemes.map((lexeme: any) => {
        const lexemeState = data.lexemeStates?.find((ls: LexemeState) => ls.lexemeId === lexeme.id) || null;
        const lexemeReviews = data.reviews?.filter((r: Review) => r.lexemeId === lexeme.id) || [];
        const conf = calculateConfidence(lexemeState, lexemeReviews);
        
        return {
          ...lexeme,
          px: 0,
          py: 0,
          conf
        };
      });

      console.log('Processed lexemes:', lexemesWithConfidence);

      setPoints(lexemesWithConfidence);
      
      // Update stats
      const newStats = { 1: 0, 5: 0, 7: 0, 10: 0 };
      lexemesWithConfidence.forEach((p: Lexeme) => newStats[p.conf as keyof typeof newStats]++);
      setStats(newStats);
      
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      
      // If there's a network error or database issue, show sample data
      if (err instanceof Error && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
        console.log('Network error, showing sample data');
        setPoints(sampleData);
        const newStats = { 1: 0, 5: 0, 7: 0, 10: 0 };
        sampleData.forEach((p: Lexeme) => newStats[p.conf as keyof typeof newStats]++);
        setStats(newStats);
        return;
      }
      
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [calculateConfidence]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#0b0f14';
    ctx.fillRect(0, 0, W, H);

    // Background gradient
    const gradient = ctx.createRadialGradient(W/2, H/2, 20, W/2, H/2, Math.max(W, H)/2);
    gradient.addColorStop(0, 'rgba(255,255,255,.06)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Draw points only if we have any
    if (points && points.length > 0) {
      points.forEach(p => {
        const sx = p.px * scale + W/2 + tx;
        const sy = p.py * scale + H/2 + ty;
        const r = (pointSize + Math.max(0, 6 - Math.log2(1 + p.freqRank/200))) * 0.7;
        
        ctx.beginPath();
        ctx.fillStyle = p.conf === 10 ? '#a50026' : p.conf === 7 ? '#fdae61' : p.conf === 5 ? '#fee08b' : '#4575b4';
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [points, scale, tx, ty, pointSize]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - lastPos.x;
      const deltaY = e.clientY - lastPos.y;
      setTx(tx + deltaX);
      setTy(ty + deltaY);
      setLastPos({ x: e.clientX, y: e.clientY });
    }

          // Tooltip
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && points && points.length > 0) {
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let best: Lexeme | null = null;
        let bestDist = 16;

        points.forEach(p => {
          const sx = p.px * scale + rect.width/2 + tx;
          const sy = p.py * scale + rect.height/2 + ty;
          const dist = Math.hypot(sx - mx, sy - my);
          if (dist < bestDist) {
            bestDist = dist;
            best = p;
          }
        });

      if (best) {
        const bestLexeme = best as Lexeme;
        const confidenceText = bestLexeme.conf === 10 ? 'Mastered' : 
                              bestLexeme.conf === 7 ? 'Well Known' : 
                              bestLexeme.conf === 5 ? 'Familiar' : 'Learning';
        setTooltip({
          show: true,
          text: `${bestLexeme.lemma} · ${bestLexeme.cefr} · ${confidenceText}`,
          x: e.clientX,
          y: e.clientY
        });
      } else {
        setTooltip({ ...tooltip, show: false });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const k = Math.exp(-e.deltaY * 0.001);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setTx(cx + (tx - cx) * k);
      setTy(cy + (ty - cy) * k);
      setScale(Math.max(0.5, Math.min(12, scale * k)));
    }
  };

  // Reset view
  const resetView = () => {
    setTx(0);
    setTy(0);
    setScale(2);
  };

  // Export as PNG
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'vocabulary_web.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Initialize
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    layout();
  }, [layout]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-[#e8eef6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your vocabulary data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-[#e8eef6] flex items-center justify-center">
        <Card className="w-full max-w-md bg-[#0f1622] border-white/6">
          <CardHeader>
            <CardTitle className="text-red-400">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={fetchUserData} variant="outline">
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#e8eef6]">
      {/* Navigation Header */}
      <div className="bg-[#0f1622] border-b border-white/6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Vocabulary Web</h1>
          <Button variant="outline" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-[380px_1fr] gap-4 h-[calc(100vh-120px)]">
          {/* Sidebar */}
          <aside className="p-4 border-r border-white/6 overflow-auto">
            <h1 className="text-lg mb-2">Your Vocabulary Progress</h1>
            <p className="text-xs opacity-80 mb-4">
              Each dot represents a word. Color indicates your confidence level based on your study performance.
            </p>
            {points.length > 0 && points[0].id.startsWith('1') && (
              <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-xs text-yellow-300">
                  📚 <strong>Demo Mode:</strong> Showing sample data. 
                  To see your real vocabulary progress, set up the database connection.
                </p>
              </div>
            )}

            {/* Display Controls */}
            <div className="bg-[#0f1622] border border-white/6 rounded-xl p-3 mb-3">
              <h2 className="text-sm mb-2">Display</h2>
              <div className="grid grid-cols-[1fr_auto] gap-2 items-center mb-3">
                <div>
                  <label className="text-xs opacity-75">Point size</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={pointSize}
                    onChange={(e) => setPointSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <span className="text-xs">{pointSize.toFixed(1)}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={resetView}>
                  Recenter
                </Button>
                <Button size="sm" variant="outline" onClick={exportPNG}>
                  Export PNG
                </Button>
              </div>
            </div>

            {/* Confidence Legend */}
            <div className="bg-[#0f1622] border border-white/6 rounded-xl p-3 mb-3">
              <h2 className="text-sm mb-2">Confidence Levels</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#a50026]"></div>
                  <span className="text-xs">Mastered (10)</span>
                  <span className="text-xs opacity-70 ml-auto">{stats[10]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#fdae61]"></div>
                  <span className="text-xs">Well Known (7)</span>
                  <span className="text-xs opacity-70 ml-auto">{stats[7]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#fee08b]"></div>
                  <span className="text-xs">Familiar (5)</span>
                  <span className="text-xs opacity-70 ml-auto">{stats[5]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4575b4]"></div>
                  <span className="text-xs">Learning (1)</span>
                  <span className="text-xs opacity-70 ml-auto">{stats[1]}</span>
                </div>
              </div>
            </div>

            <p className="text-xs opacity-70 mb-2">
              Hover a dot for details. Drag to pan, scroll to zoom.
            </p>
            <p className="text-xs opacity-70">
              Total words: {points.length}
            </p>
            {points.length === 0 && !loading && (
              <div className="mt-4 p-3 bg-[#0f1622] border border-white/6 rounded-lg">
                <p className="text-xs text-center opacity-70">
                  No vocabulary data found. This might happen if:
                </p>
                <ul className="text-xs opacity-70 mt-2 space-y-1">
                  <li>• You haven't completed the placement test yet</li>
                  <li>• Your vocabulary database is empty</li>
                  <li>• There was an issue loading your data</li>
                </ul>
              </div>
            )}
          </aside>

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            />
            
            {/* Tooltip */}
            {tooltip.show && (
              <div
                className="fixed pointer-events-none bg-[rgba(13,18,26,0.9)] border border-white/12 px-2 py-1 rounded-lg text-xs transform -translate-x-1/2 -translate-y-full whitespace-nowrap z-50"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                {tooltip.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}