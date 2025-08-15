"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface VocabWord {
  id: string;
  lemma: string;
  pos: string;
  cefr: string;
  freqRank: number;
  knowledgeLevel: number;
  knowledgeScore: number;
  studied: boolean;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  due: string | null;
  suspended: boolean;
}

interface VocabData {
  levelEstimate: {
    cefrBand: string;
    vocabIndex: number;
    confidence: number;
  };
  vocabulary: VocabWord[];
  totalWords: number;
  studiedCount: number;
  totalReviews: number;
}

interface Point {
  word: VocabWord;
  x: number;
  y: number;
}

// Golden angle for spiral layout
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Color scheme matching the example
const COLORS = {
  bg: "#0b0f14",
  panel: "#0f1622",
  ink: "#e8eef6",
  level10: "#a50026", // Mastered
  level7: "#fdae61",  // Familiar
  level5: "#fee08b",  // Learning
  level1: "#4575b4",  // Unknown
};

export function VocabWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const [data, setData] = useState<VocabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [hoveredWord, setHoveredWord] = useState<VocabWord | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // View controls
  const [scale, setScale] = useState(2);
  const [translation, setTranslation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pointSize, setPointSize] = useState(2.4);

  // Fetch vocabulary data
  useEffect(() => {
    fetchVocabData();
  }, []);

  const fetchVocabData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vocab/knowledge");
      if (!response.ok) {
        throw new Error("Failed to fetch vocabulary data");
      }
      const data = await response.json();
      setData(data);
      
      // Initialize points with spiral layout
      const newPoints = layoutPoints(data.vocabulary);
      setPoints(newPoints);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Layout points in a spiral pattern
  const layoutPoints = (vocabulary: VocabWord[]): Point[] => {
    return vocabulary.map((word, i) => {
      const radius = 3.1 * Math.sqrt(i + 2);
      const angle = (i + 2) * GOLDEN_ANGLE;
      return {
        word,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      };
    });
  };

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width * dpr;
    const height = rect.height * dpr;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    // Clear and draw background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Add subtle gradient
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 20,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.06)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Transform for pan and zoom
    ctx.save();
    ctx.translate(width / 2 + translation.x * dpr, height / 2 + translation.y * dpr);
    ctx.scale(scale * dpr, scale * dpr);

    // Draw points
    points.forEach(point => {
      const baseRadius = pointSize + Math.max(0, 6 - Math.log2(1 + point.word.freqRank / 200));
      const radius = baseRadius * 0.7;

      // Choose color based on actual knowledge level from API
      let color = COLORS.level1;
      if (point.word.knowledgeLevel === 10) color = COLORS.level10;
      else if (point.word.knowledgeLevel === 7) color = COLORS.level7;
      else if (point.word.knowledgeLevel === 5) color = COLORS.level5;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add glow for studied words
      if (point.word.studied) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    ctx.restore();
  }, [points, scale, translation, pointSize]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // Mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - translation.x, y: e.clientY - translation.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isDragging) {
      setTranslation({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      // Check for hover
      const dpr = window.devicePixelRatio || 1;
      const canvasX = (x * dpr - rect.width * dpr / 2 - translation.x * dpr) / (scale * dpr);
      const canvasY = (y * dpr - rect.height * dpr / 2 - translation.y * dpr) / (scale * dpr);

      let closestWord = null;
      let closestDist = 20 / scale; // Detection radius

      points.forEach(point => {
        const dist = Math.hypot(point.x - canvasX, point.y - canvasY);
        if (dist < closestDist) {
          closestDist = dist;
          closestWord = point.word;
        }
      });

      setHoveredWord(closestWord);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = Math.exp(-e.deltaY * 0.001);
    const newScale = Math.max(0.5, Math.min(12, scale * scaleFactor));
    
    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const k = newScale / scale;
      setTranslation({
        x: x + (translation.x - x) * k,
        y: y + (translation.y - y) * k,
      });
    }
    
    setScale(newScale);
  };

  // Reset view
  const resetView = () => {
    setScale(2);
    setTranslation({ x: 0, y: 0 });
  };

  // Export as PNG
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'vocabulary_web.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Calculate stats
  const getStats = () => {
    const counts = { 1: 0, 5: 0, 7: 0, 10: 0 };
    points.forEach(p => {
      counts[p.word.knowledgeLevel as keyof typeof counts]++;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="bg-[#0b0f14] rounded-lg p-8 flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8eef6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0b0f14] rounded-lg p-8 text-center text-red-400">
        Error loading vocabulary data: {error}
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="bg-[#0b0f14] rounded-lg overflow-hidden" style={{ height: '700px' }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-[#0f1622]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[#e8eef6] mb-1">Vocabulary Knowledge Web</h1>
              <p className="text-xs text-[#e8eef6]/70">
                Your level: <span className="font-semibold text-blue-400">{data?.levelEstimate.cefrBand}</span> | 
                Studied: <span className="font-semibold text-green-400">{data?.studiedCount}</span> words | 
                Total: <span className="font-semibold">{data?.totalWords}</span> words
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={resetView}
                className="bg-[#151b23] border-white/10 text-[#e8eef6] hover:border-white/20 text-xs"
              >
                Recenter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={exportPNG}
                className="bg-[#151b23] border-white/10 text-[#e8eef6] hover:border-white/20 text-xs"
              >
                Export PNG
              </Button>
            </div>
          </div>
          
          {/* Stats and Legend */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-4 items-center">
              {/* Legend */}
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level10 }}></div>
                  <span className="text-xs text-[#e8eef6]">Mastered ({stats[10]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level7 }}></div>
                  <span className="text-xs text-[#e8eef6]">Familiar ({stats[7]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level5 }}></div>
                  <span className="text-xs text-[#e8eef6]">Learning ({stats[5]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level1 }}></div>
                  <span className="text-xs text-[#e8eef6]">Unknown ({stats[1]})</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-[#e8eef6]/60">
              Drag to pan, scroll to zoom
            </p>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex-1" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          {/* Tooltip */}
          {hoveredWord && (
            <div
              className="absolute pointer-events-none bg-[#0d121a]/95 border border-white/10 px-3 py-2 rounded-lg text-xs text-[#e8eef6] whitespace-nowrap z-10"
              style={{
                left: mousePos.x,
                top: mousePos.y - 40,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="font-semibold">{hoveredWord.lemma}</div>
              <div className="text-[#e8eef6]/70 mt-1">
                {hoveredWord.cefr} · Rank #{hoveredWord.freqRank}
                {hoveredWord.studied && (
                  <span> · {hoveredWord.reps} reviews</span>
                )}
              </div>
              <div className="text-[#e8eef6]/70">
                Knowledge: {(hoveredWord.knowledgeScore * 100).toFixed(0)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}