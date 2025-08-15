"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
  displayLevel: number;
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
  
  // Knowledge level controls for each CEFR band
  const [levelControls, setLevelControls] = useState({
    A1: { level10: 100, level7: 0, level5: 0 },
    A2: { level10: 100, level7: 0, level5: 0 },
    B1: { level10: 14, level7: 70, level5: 10 },
    B2: { level10: 5, level7: 20, level5: 0 },
    C1: { level10: 0, level7: 0, level5: 0 },
    C2: { level10: 0, level7: 0, level5: 0 },
  });

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
        displayLevel: word.knowledgeLevel,
      };
    });
  };

  // Apply knowledge level controls to points
  const applyLevelControls = useCallback(() => {
    if (!data) return;

    const updatedPoints = points.map(point => {
      const controls = levelControls[point.word.cefr as keyof typeof levelControls];
      if (!controls) return point;

      // Calculate which level this word should display based on controls
      const total = controls.level10 + controls.level7 + controls.level5;
      const level1Pct = Math.max(0, 100 - total);
      
      // Use a deterministic hash of the word to decide its level
      const hash = hashWord(point.word.lemma + point.word.cefr);
      const roll = (hash % 100);
      
      let displayLevel = 1;
      if (roll < controls.level10) {
        displayLevel = 10;
      } else if (roll < controls.level10 + controls.level7) {
        displayLevel = 7;
      } else if (roll < controls.level10 + controls.level7 + controls.level5) {
        displayLevel = 5;
      }
      
      return { ...point, displayLevel };
    });

    setPoints(updatedPoints);
  }, [data, points, levelControls]);

  // Simple hash function for deterministic word assignment
  const hashWord = (str: string): number => {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash);
  };

  // Update level controls
  const updateLevelControl = (
    band: keyof typeof levelControls,
    level: 'level10' | 'level7' | 'level5',
    value: number
  ) => {
    const newControls = { ...levelControls };
    const bandControls = { ...newControls[band] };
    
    // Ensure total doesn't exceed 100%
    bandControls[level] = value;
    const total = bandControls.level10 + bandControls.level7 + bandControls.level5;
    if (total > 100) {
      // Adjust other values proportionally
      const excess = total - 100;
      if (level !== 'level10' && bandControls.level10 > 0) {
        bandControls.level10 = Math.max(0, bandControls.level10 - excess);
      } else if (level !== 'level7' && bandControls.level7 > 0) {
        bandControls.level7 = Math.max(0, bandControls.level7 - excess);
      } else if (level !== 'level5' && bandControls.level5 > 0) {
        bandControls.level5 = Math.max(0, bandControls.level5 - excess);
      }
    }
    
    newControls[band] = bandControls;
    setLevelControls(newControls);
  };

  // Apply controls when they change
  useEffect(() => {
    applyLevelControls();
  }, [levelControls]);

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

      // Choose color based on display level
      let color = COLORS.level1;
      if (point.displayLevel === 10) color = COLORS.level10;
      else if (point.displayLevel === 7) color = COLORS.level7;
      else if (point.displayLevel === 5) color = COLORS.level5;

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

  // Reset to default knowledge levels
  const resetLevels = () => {
    setLevelControls({
      A1: { level10: 100, level7: 0, level5: 0 },
      A2: { level10: 100, level7: 0, level5: 0 },
      B1: { level10: 14, level7: 70, level5: 10 },
      B2: { level10: 5, level7: 20, level5: 0 },
      C1: { level10: 0, level7: 0, level5: 0 },
      C2: { level10: 0, level7: 0, level5: 0 },
    });
  };

  // Zero all level 10s
  const zeroAllTens = () => {
    const newControls = { ...levelControls };
    Object.keys(newControls).forEach(band => {
      newControls[band as keyof typeof levelControls].level10 = 0;
    });
    setLevelControls(newControls);
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
      counts[p.displayLevel as keyof typeof counts]++;
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
    <div className="bg-[#0b0f14] rounded-lg overflow-hidden" style={{ height: '800px' }}>
      <div className="grid grid-cols-[380px_1fr] gap-4 h-full">
        {/* Control Panel */}
        <aside className="p-4 border-r border-white/5 overflow-auto bg-[#0b0f14]">
          <h1 className="text-lg font-semibold text-[#e8eef6] mb-4">Vocabulary Web</h1>
          
          <p className="text-xs text-[#e8eef6]/70 mb-4">
            Your level: <span className="font-semibold text-blue-400">{data?.levelEstimate.cefrBand}</span> | 
            Studied: <span className="font-semibold text-green-400">{data?.studiedCount}</span> words
          </p>

          {/* Display Controls */}
          <div className="bg-[#0f1622] border border-white/5 rounded-xl p-3 mb-3">
            <h2 className="text-sm font-medium text-[#e8eef6]/95 mb-3">Display</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#e8eef6]/75">Point size: {pointSize.toFixed(1)}</label>
                <Slider
                  value={[pointSize]}
                  onValueChange={([v]) => setPointSize(v)}
                  min={1}
                  max={5}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetLevels}
                  className="bg-[#151b23] border-white/10 text-[#e8eef6] hover:border-white/20 text-xs"
                >
                  Reset defaults
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={zeroAllTens}
                  className="bg-[#151b23] border-white/10 text-[#e8eef6] hover:border-white/20 text-xs"
                >
                  Zero all 10s
                </Button>
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
          </div>

          {/* CEFR Band Controls */}
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map(band => {
            const controls = levelControls[band];
            const level1 = Math.max(0, 100 - controls.level10 - controls.level7 - controls.level5);
            
            return (
              <div key={band} className="bg-[#0f1622] border border-white/5 rounded-xl p-3 mb-3">
                <h2 className="text-sm font-medium text-[#e8eef6]/95 mb-2">{band}</h2>
                <div className="space-y-2">
                  <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                    <span className="text-xs text-[#a50026]">10</span>
                    <Slider
                      value={[controls.level10]}
                      onValueChange={([v]) => updateLevelControl(band, 'level10', v)}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-xs text-[#e8eef6]/90">{controls.level10}%</span>
                  </div>
                  <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                    <span className="text-xs text-[#fdae61]">7</span>
                    <Slider
                      value={[controls.level7]}
                      onValueChange={([v]) => updateLevelControl(band, 'level7', v)}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-xs text-[#e8eef6]/90">{controls.level7}%</span>
                  </div>
                  <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                    <span className="text-xs text-[#fee08b]">5</span>
                    <Slider
                      value={[controls.level5]}
                      onValueChange={([v]) => updateLevelControl(band, 'level5', v)}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-xs text-[#e8eef6]/90">{controls.level5}%</span>
                  </div>
                  <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                    <span className="text-xs text-[#4575b4]">1</span>
                    <div className="text-xs text-[#e8eef6]/50 text-center">auto</div>
                    <span className="text-xs text-[#e8eef6]/90">{level1}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="flex gap-3 flex-wrap items-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level10 }}></div>
              <span className="text-xs text-[#e8eef6]">10</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level7 }}></div>
              <span className="text-xs text-[#e8eef6]">7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level5 }}></div>
              <span className="text-xs text-[#e8eef6]">5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.level1 }}></div>
              <span className="text-xs text-[#e8eef6]">1</span>
            </div>
          </div>

          <p className="text-xs text-[#e8eef6]/60 mt-4">
            Hover for details. Drag to pan, scroll to zoom.
          </p>
          
          <p className="text-xs text-[#e8eef6]/60 mt-2">
            Counts — 10: {stats[10]} · 7: {stats[7]} · 5: {stats[5]} · 1: {stats[1]}
          </p>
        </aside>

        {/* Canvas */}
        <div className="relative" ref={containerRef}>
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
              className="absolute pointer-events-none bg-[#0d121a]/90 border border-white/10 px-2 py-1 rounded-lg text-xs text-[#e8eef6] whitespace-nowrap"
              style={{
                left: mousePos.x,
                top: mousePos.y - 30,
                transform: 'translateX(-50%)',
              }}
            >
              {hoveredWord.lemma} · {hoveredWord.cefr} · {hoveredWord.knowledgeLevel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}