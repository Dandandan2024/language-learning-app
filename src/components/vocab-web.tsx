"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VocabWord {
  id: string;
  lemma: string;
  pos: string | null;
  cefr: string;
  freqRank: number;
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

export function VocabWeb() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<VocabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [viewMode, setViewMode] = useState<"frequency" | "cefr" | "knowledge">("knowledge");
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 900;
    const height = 700;
    const margin = { top: 40, right: 160, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Create a group for zooming and panning
    const g = svg.append("g");

    // Add zoom behavior with better controls
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Add background gradient
    const bgGradient = svg.append("defs")
      .append("radialGradient")
      .attr("id", "bg-gradient");
    
    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f3f4f6")
      .attr("stop-opacity", 0.1);
    
    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e5e7eb")
      .attr("stop-opacity", 0.2);

    svg.insert("rect", ":first-child")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#bg-gradient)");

    // Prepare the data for visualization
    const nodes = data.vocabulary.map(word => ({
      ...word,
      x: 0,
      y: 0,
      radius: 0,
      targetX: 0,
      targetY: 0
    }));

    // Calculate node positions based on view mode with improved algorithms
    const layoutNodes = () => {
      const centerX = width / 2;
      const centerY = height / 2;

      if (viewMode === "knowledge") {
        // Spiral layout based on knowledge score
        // Center: well-known words, Spiral out: less known words
        const sortedNodes = [...nodes].sort((a, b) => b.knowledgeScore - a.knowledgeScore);
        
        sortedNodes.forEach((node, i) => {
          const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle ~137.5°
          const angle = i * goldenAngle;
          const radius = Math.sqrt(i) * 15;
          
          node.targetX = centerX + Math.cos(angle) * radius;
          node.targetY = centerY + Math.sin(angle) * radius;
          node.radius = 4 + node.knowledgeScore * 14; // Size based on knowledge
        });
      } else if (viewMode === "frequency") {
        // Spiral layout based on frequency rank
        nodes.forEach((node, i) => {
          const goldenAngle = Math.PI * (3 - Math.sqrt(5));
          const angle = i * goldenAngle;
          const radius = Math.sqrt(node.freqRank) * 8;
          
          node.targetX = centerX + Math.cos(angle) * radius;
          node.targetY = centerY + Math.sin(angle) * radius;
          node.radius = 6 + (1 - Math.min(node.freqRank / 1000, 1)) * 12; // Size based on frequency
        });
      } else if (viewMode === "cefr") {
        // Hierarchical layout by CEFR level with force simulation
        const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
        const levelGroups = d3.group(nodes, d => d.cefr);
        const levelSpacing = (height - margin.top - margin.bottom) / (levels.length + 1);
        
        levels.forEach((level, levelIndex) => {
          const levelNodes = levelGroups.get(level) || [];
          const levelY = margin.top + (levelIndex + 1) * levelSpacing;
          const nodeSpacing = (width - margin.left - margin.right) / (levelNodes.length + 1);
          
          levelNodes.forEach((node, i) => {
            node.targetX = margin.left + (i + 1) * nodeSpacing;
            node.targetY = levelY + (Math.random() - 0.5) * 30; // Add slight randomness
            node.radius = 5 + node.knowledgeScore * 10;
          });
        });
      }

      // Initialize positions if not set
      nodes.forEach(node => {
        if (node.x === 0 && node.y === 0) {
          node.x = node.targetX;
          node.y = node.targetY;
        }
      });
    };

    layoutNodes();

    // Color scales with better gradients
    const knowledgeColorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([0, 1]);

    const cefrColorScale = d3.scaleOrdinal<string>()
      .domain(["A1", "A2", "B1", "B2", "C1", "C2"])
      .range(["#dbeafe", "#bfdbfe", "#fef3c7", "#fde047", "#fed7aa", "#fca5a5"]);

    // Create force simulation for smooth transitions and collision detection
    const simulation = d3.forceSimulation(nodes)
      .force("x", d3.forceX((d: any) => d.targetX).strength(0.3))
      .force("y", d3.forceY((d: any) => d.targetY).strength(0.3))
      .force("collide", d3.forceCollide((d: any) => d.radius + 1).strength(0.8))
      .force("charge", d3.forceManyBody().strength(-5))
      .alpha(0.8)
      .alphaDecay(0.02);

    // Draw connections for related words (connect studied words with similar knowledge scores)
    if (viewMode === "knowledge") {
      const links: any[] = [];
      const studiedNodes = nodes.filter(n => n.studied);
      
      studiedNodes.forEach((node, i) => {
        studiedNodes.slice(i + 1).forEach(otherNode => {
          const scoreDiff = Math.abs(node.knowledgeScore - otherNode.knowledgeScore);
          if (scoreDiff < 0.1 && Math.abs(node.freqRank - otherNode.freqRank) < 100) {
            links.push({
              source: node,
              target: otherNode,
              strength: 1 - scoreDiff * 10
            });
          }
        });
      });

      const linkGroup = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", d => d.strength)
        .attr("stroke-opacity", 0.3);

      simulation.on("tick", () => {
        linkGroup
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        nodeGroup
          .attr("transform", d => `translate(${d.x},${d.y})`);
      });
    } else {
      simulation.on("tick", () => {
        nodeGroup
          .attr("transform", d => `translate(${d.x},${d.y})`);
      });
    }

    // Draw nodes with better styling
    const nodeGroup = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add shadow effect for depth
    const shadowFilter = svg.append("defs")
      .append("filter")
      .attr("id", "shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    
    shadowFilter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2);
    
    shadowFilter.append("feOffset")
      .attr("dx", 0)
      .attr("dy", 1)
      .attr("result", "offsetblur");
    
    const feMerge = shadowFilter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetblur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    // Add circles with enhanced interactivity
    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => {
        if (viewMode === "knowledge") {
          return knowledgeColorScale(d.knowledgeScore);
        } else if (viewMode === "cefr") {
          return cefrColorScale(d.cefr);
        } else {
          return d.studied ? "#86efac" : "#cbd5e1";
        }
      })
      .attr("stroke", d => {
        if (d.studied) {
          return d.suspended ? "#ef4444" : "#22c55e";
        }
        return "#94a3b8";
      })
      .attr("stroke-width", d => d.studied ? 2.5 : 1.5)
      .attr("opacity", d => d.suspended ? 0.4 : 0.9)
      .style("cursor", "pointer")
      .style("filter", d => d.studied ? "url(#shadow)" : "none")
      .on("mouseover", function(event, d) {
        setHoveredWord(d.id);
        
        // Enhance the hovered node
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.radius * 1.4)
          .attr("opacity", 1)
          .attr("stroke-width", 3);
        
        // Dim other nodes
        nodeGroup.selectAll("circle")
          .filter((n: any) => n.id !== d.id)
          .transition()
          .duration(200)
          .attr("opacity", 0.3);
        
        // Show connections to this node
        if (viewMode === "knowledge" && d.studied) {
          g.selectAll(".links line")
            .transition()
            .duration(200)
            .attr("stroke-opacity", (l: any) => 
              l.source.id === d.id || l.target.id === d.id ? 0.6 : 0.1
            );
        }
      })
      .on("mouseout", function(event, d) {
        setHoveredWord(null);
        
        // Reset node appearance
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.radius)
          .attr("opacity", d.suspended ? 0.4 : 0.9)
          .attr("stroke-width", d.studied ? 2.5 : 1.5);
        
        // Reset other nodes
        nodeGroup.selectAll("circle")
          .transition()
          .duration(200)
          .attr("opacity", (n: any) => n.suspended ? 0.4 : 0.9);
        
        // Reset connections
        if (viewMode === "knowledge") {
          g.selectAll(".links line")
            .transition()
            .duration(200)
            .attr("stroke-opacity", 0.3);
        }
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedWord(d);
      });

    // Add labels for important words with better positioning
    const labelNodes = nodes.filter(d => 
      d.freqRank <= 30 || 
      d.knowledgeScore > 0.8 || 
      (d.studied && d.reps > 5)
    );

    nodeGroup
      .filter(d => labelNodes.includes(d))
      .append("text")
      .attr("dy", d => -d.radius - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#1f2937")
      .attr("pointer-events", "none")
      .style("text-shadow", "0 0 3px white, 0 0 3px white")
      .text(d => d.lemma);

    // Add enhanced legend with better styling
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 140}, 40)`);

    // Legend background
    legend.append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 130)
      .attr("height", viewMode === "cefr" ? 150 : 120)
      .attr("fill", "white")
      .attr("stroke", "#e5e7eb")
      .attr("rx", 5)
      .attr("opacity", 0.95);

    if (viewMode === "knowledge") {
      // Knowledge score gradient legend
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "knowledge-gradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", knowledgeColorScale(1));

      gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", knowledgeColorScale(0.5));

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", knowledgeColorScale(0));

      legend.append("rect")
        .attr("width", 20)
        .attr("height", 80)
        .attr("fill", "url(#knowledge-gradient)")
        .attr("stroke", "#d1d5db")
        .attr("rx", 3);

      legend.append("text")
        .attr("x", 25)
        .attr("y", 5)
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .text("Well known");

      legend.append("text")
        .attr("x", 25)
        .attr("y", 45)
        .attr("font-size", "11px")
        .text("Learning");

      legend.append("text")
        .attr("x", 25)
        .attr("y", 80)
        .attr("font-size", "11px")
        .text("Unknown");
    } else if (viewMode === "cefr") {
      // CEFR level legend with better styling
      ["A1", "A2", "B1", "B2", "C1", "C2"].forEach((level, i) => {
        legend.append("circle")
          .attr("cx", 10)
          .attr("cy", i * 20 + 10)
          .attr("r", 7)
          .attr("fill", cefrColorScale(level))
          .attr("stroke", "#9ca3af")
          .attr("stroke-width", 1);

        legend.append("text")
          .attr("x", 25)
          .attr("y", i * 20 + 14)
          .attr("font-size", "11px")
          .attr("font-weight", level === data.levelEstimate.cefrBand ? "600" : "400")
          .attr("fill", level === data.levelEstimate.cefrBand ? "#1e40af" : "#4b5563")
          .text(level);
      });
    } else {
      // Frequency legend
      legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 8)
        .attr("fill", "#86efac")
        .attr("stroke", "#22c55e")
        .attr("stroke-width", 2);

      legend.append("text")
        .attr("x", 25)
        .attr("y", 14)
        .attr("font-size", "11px")
        .text("Studied");

      legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 35)
        .attr("r", 7)
        .attr("fill", "#cbd5e1")
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 1);

      legend.append("text")
        .attr("x", 25)
        .attr("y", 39)
        .attr("font-size", "11px")
        .text("Not studied");
    }

    // Add zoom controls
    const controls = svg.append("g")
      .attr("transform", `translate(20, ${height - 60})`);

    const zoomIn = controls.append("g")
      .style("cursor", "pointer")
      .on("click", () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
      });

    zoomIn.append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "white")
      .attr("stroke", "#d1d5db")
      .attr("rx", 5);

    zoomIn.append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("fill", "#4b5563")
      .text("+");

    const zoomOut = controls.append("g")
      .attr("transform", "translate(35, 0)")
      .style("cursor", "pointer")
      .on("click", () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
      });

    zoomOut.append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "white")
      .attr("stroke", "#d1d5db")
      .attr("rx", 5);

    zoomOut.append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("fill", "#4b5563")
      .text("−");

    const reset = controls.append("g")
      .attr("transform", "translate(70, 0)")
      .style("cursor", "pointer")
      .on("click", () => {
        svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
      });

    reset.append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "white")
      .attr("stroke", "#d1d5db")
      .attr("rx", 5);

    reset.append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#4b5563")
      .text("⟲");

  }, [data, viewMode]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center text-red-600 p-8">
          Error loading vocabulary data: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vocabulary Knowledge Web</CardTitle>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 space-x-4">
            <span>Level: <span className="font-semibold text-blue-600">{data?.levelEstimate.cefrBand}</span></span>
            <span>Studied: <span className="font-semibold text-green-600">{data?.studiedCount}</span> words</span>
            <span>Reviews: <span className="font-semibold text-purple-600">{data?.totalReviews}</span></span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "knowledge" ? "default" : "outline"}
              onClick={() => setViewMode("knowledge")}
              className="transition-all"
            >
              Knowledge
            </Button>
            <Button
              size="sm"
              variant={viewMode === "frequency" ? "default" : "outline"}
              onClick={() => setViewMode("frequency")}
              className="transition-all"
            >
              Frequency
            </Button>
            <Button
              size="sm"
              variant={viewMode === "cefr" ? "default" : "outline"}
              onClick={() => setViewMode("cefr")}
              className="transition-all"
            >
              CEFR Level
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg ref={svgRef} className="w-full h-auto border-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"></svg>
          
          {selectedWord && (
            <div className="absolute top-4 left-4 bg-white p-5 rounded-lg shadow-xl max-w-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-xl">{selectedWord.lemma}</h3>
                  {selectedWord.pos && <p className="text-sm text-gray-500 italic">({selectedWord.pos})</p>}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedWord(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">CEFR Level:</span>
                  <span className="font-semibold">{selectedWord.cefr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency Rank:</span>
                  <span className="font-semibold">#{selectedWord.freqRank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Knowledge Score:</span>
                  <span className="font-semibold text-green-600">{(selectedWord.knowledgeScore * 100).toFixed(0)}%</span>
                </div>
                {selectedWord.studied && (
                  <>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviews:</span>
                      <span className="font-semibold">{selectedWord.reps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stability:</span>
                      <span className="font-semibold">{selectedWord.stability.toFixed(1)} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-semibold">{(selectedWord.difficulty * 100).toFixed(0)}%</span>
                    </div>
                    {selectedWord.lapses > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lapses:</span>
                        <span className="font-semibold text-orange-600">{selectedWord.lapses}</span>
                      </div>
                    )}
                    {selectedWord.due && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Review:</span>
                        <span className="font-semibold text-blue-600">
                          {new Date(selectedWord.due).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Hover tooltip */}
          {hoveredWord && !selectedWord && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm pointer-events-none">
              Click to see details
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}