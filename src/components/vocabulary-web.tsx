'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Lexeme {
  lemma: string;
  pos: string;
  level: string;
  rank: number;
  px: number;
  py: number;
  conf: number;
}

interface ConfidencePercentages {
  [key: string]: {
    [key: number]: number;
  };
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

  // Confidence percentages for each CEFR level
  const [confidencePct, setConfidencePct] = useState<ConfidencePercentages>({
    A1: { 10: 100, 7: 0, 5: 0 },
    A2: { 10: 100, 7: 0, 5: 0 },
    B1: { 10: 14, 7: 70, 5: 10 },
    B2: { 10: 5, 7: 20, 5: 0 },
    C1: { 10: 0, 7: 0, 5: 0 },
    C2: { 10: 0, 7: 0, 5: 0 },
  });

  // Sample data - replace with actual data from your app
  const sampleData: Lexeme[] = [
    { lemma: 'привет', pos: 'noun', level: 'A1', rank: 1000, px: 0, py: 0, conf: 1 },
    { lemma: 'дом', pos: 'noun', level: 'A1', rank: 900, px: 0, py: 0, conf: 1 },
    { lemma: 'читать', pos: 'verb', level: 'B1', rank: 800, px: 0, py: 0, conf: 1 },
    { lemma: 'путешествовать', pos: 'verb', level: 'B2', rank: 3500, px: 0, py: 0, conf: 1 },
    { lemma: 'свобода', pos: 'noun', level: 'B2', rank: 4200, px: 0, py: 0, conf: 1 },
    { lemma: 'сосредоточиться', pos: 'verb', level: 'C1', rank: 6200, px: 0, py: 0, conf: 1 },
    { lemma: 'непревзойдённый', pos: 'adj', level: 'C2', rank: 9000, px: 0, py: 0, conf: 1 },
    { lemma: 'мир', pos: 'noun', level: 'A1', rank: 700, px: 0, py: 0, conf: 1 },
    { lemma: 'работать', pos: 'verb', level: 'A2', rank: 1200, px: 0, py: 0, conf: 1 },
    { lemma: 'договор', pos: 'noun', level: 'B1', rank: 2100, px: 0, py: 0, conf: 1 },
    { lemma: 'обусловливать', pos: 'verb', level: 'C1', rank: 7500, px: 0, py: 0, conf: 1 },
  ];

  // Layout function using golden angle spiral
  const layout = useCallback(() => {
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

  // Deterministic sampling functions
  const h32 = (s: string) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  const applyConfidence = useCallback(() => {
    // Reset all points to confidence 1
    const newPoints = points.map(p => ({ ...p, conf: 1 }));
    
    // Group by CEFR level
    const groups: { [key: string]: Lexeme[] } = { A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] };
    newPoints.forEach(p => {
      if (groups[p.level]) groups[p.level].push(p);
    });

    // Apply confidence based on percentages
    Object.entries(groups).forEach(([level, levelPoints]) => {
      const pct = confidencePct[level];
      if (!pct || !levelPoints.length) return;

      const n = levelPoints.length;
      const c10 = Math.max(0, Math.min(n, Math.round(n * (pct[10] || 0) / 100)));
      const c7 = Math.max(0, Math.min(n, Math.round(n * (pct[7] || 0) / 100)));
      const c5 = Math.max(0, Math.min(n, Math.round(n * (pct[5] || 0) / 100)));

      const taken = new Set<Lexeme>();
      
      // Select points for each confidence level
      const selectFor = (count: number, conf: number, tag: string) => {
        if (count <= 0) return;
        const ordered = levelPoints
          .map(p => ({ p, k: h32(p.lemma + '|' + tag) }))
          .sort((a, b) => a.k - b.k);
        
        let picked = 0;
        for (const item of ordered) {
          if (picked >= count) break;
          if (!taken.has(item.p)) {
            taken.add(item.p);
            item.p.conf = conf;
            picked++;
          }
        }
      };

      selectFor(c10, 10, '10');
      selectFor(c7, 7, '7');
      selectFor(c5, 5, '5');
    });

    setPoints(newPoints);
    
    // Update stats
    const newStats = { 1: 0, 5: 0, 7: 0, 10: 0 };
    newPoints.forEach(p => newStats[p.conf as keyof typeof newStats]++);
    setStats(newStats);
  }, [points, confidencePct]);

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

    // Draw points
    points.forEach(p => {
      const sx = p.px * scale + W/2 + tx;
      const sy = p.py * scale + H/2 + ty;
      const r = (pointSize + Math.max(0, 6 - Math.log2(1 + p.rank/200))) * 0.7;
      
      ctx.beginPath();
      ctx.fillStyle = p.conf === 10 ? '#a50026' : p.conf === 7 ? '#fdae61' : p.conf === 5 ? '#fee08b' : '#4575b4';
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    });
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
    if (rect) {
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
        setTooltip({
          show: true,
          text: `${(best as Lexeme).lemma} · ${(best as Lexeme).level} · ${(best as Lexeme).conf}`,
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

  // Handle confidence slider changes
  const handleConfidenceChange = (level: string, conf: number, value: number[]) => {
    const newPct = { ...confidencePct };
    newPct[level][conf] = value[0];
    setConfidencePct(newPct);
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
    setPoints(sampleData);
  }, []);

  useEffect(() => {
    layout();
  }, [layout]);

  useEffect(() => {
    applyConfidence();
  }, [applyConfidence]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

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
          <h1 className="text-lg mb-2">Vocabulary Web</h1>
          <p className="text-xs opacity-80 mb-4">
            Each dot represents a lexeme. Color indicates confidence level.
          </p>

          {/* Display Controls */}
          <div className="bg-[#0f1622] border border-white/6 rounded-xl p-3 mb-3">
            <h2 className="text-sm mb-2">Display</h2>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center mb-3">
              <div>
                <label className="text-xs opacity-75">Point size</label>
                <Slider
                  value={[pointSize]}
                  onValueChange={(value) => setPointSize(value[0])}
                  min={1}
                  max={5}
                  step={0.1}
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

          {/* CEFR Level Controls */}
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
            <div key={level} className="bg-[#0f1622] border border-white/6 rounded-xl p-3 mb-3">
              <h2 className="text-sm mb-2">{level}</h2>
              <div className="space-y-2">
                <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                  <span className="text-xs text-[#a50026]">10</span>
                  <Slider
                    value={[confidencePct[level][10] || 0]}
                    onValueChange={(value) => handleConfidenceChange(level, 10, value)}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                  <span className="text-xs">{confidencePct[level][10] || 0}%</span>
                </div>
                <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                  <span className="text-xs text-[#fdae61]">7</span>
                  <Slider
                    value={[confidencePct[level][7] || 0]}
                    onValueChange={(value) => handleConfidenceChange(level, 7, value)}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                  <span className="text-xs">{confidencePct[level][7] || 0}%</span>
                </div>
                <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                  <span className="text-xs text-[#fee08b]">5</span>
                  <Slider
                    value={[confidencePct[level][5] || 0]}
                    onValueChange={(value) => handleConfidenceChange(level, 5, value)}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                  <span className="text-xs">{confidencePct[level][5] || 0}%</span>
                </div>
                <div className="grid grid-cols-[44px_1fr_50px] gap-2 items-center">
                  <span className="text-xs text-[#4575b4]">1</span>
                  <div className="text-xs opacity-70">auto</div>
                  <span className="text-xs">
                    {100 - ((confidencePct[level][10] || 0) + (confidencePct[level][7] || 0) + (confidencePct[level][5] || 0))}%
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex gap-2 flex-wrap mb-3">
            <div className="w-3 h-3 rounded-full bg-[#a50026]"></div>
            <span className="text-xs">10</span>
            <div className="w-3 h-3 rounded-full bg-[#fdae61]"></div>
            <span className="text-xs">7</span>
            <div className="w-3 h-3 rounded-full bg-[#fee08b]"></div>
            <span className="text-xs">5</span>
            <div className="w-3 h-3 rounded-full bg-[#4575b4]"></div>
            <span className="text-xs">1</span>
          </div>

          <p className="text-xs opacity-70 mb-2">
            Hover a dot for details. Drag to pan, scroll to zoom.
          </p>
          <p className="text-xs opacity-70">
            Counts — 10: {stats[10]} · 7: {stats[7]} · 5: {stats[5]} · 1: {stats[1]}
          </p>
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