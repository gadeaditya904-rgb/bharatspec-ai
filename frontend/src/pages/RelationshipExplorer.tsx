import React, { useState, useMemo } from 'react';
import { 
  Network, 
  GitFork, 
  ListFilter, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  ExternalLink, 
  Info, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Layers, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { Standard, StandardRelationship, RelationshipType } from '../types';
import { STANDARDS_DATABASE, SOLAR_STREET_LIGHT_RELATIONSHIPS } from '../services/demoData';

interface RelationshipExplorerProps {
  standards?: Standard[];
  onNavigateToStandard?: (isNumber: string) => void;
  onNavigateToTraceability?: () => void;
}

export const RelationshipExplorer: React.FC<RelationshipExplorerProps> = ({
  standards = STANDARDS_DATABASE,
  onNavigateToStandard,
  onNavigateToTraceability
}) => {
  const [selectedStandardId, setSelectedStandardId] = useState<string>("IS 16221 (Part 2) : 2015");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'graph' | 'tree' | 'list'>('graph');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedDrawerNode, setSelectedDrawerNode] = useState<StandardRelationship | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visibleLimit, setVisibleLimit] = useState<number>(10);
  const [hasGraphError, setHasGraphError] = useState(false);

  // Available primary standards for selection
  const primaryOptions = [
    { is: "IS 16221 (Part 2) : 2015", title: "Safety of Power Converters for use in Photovoltaic Power Systems" },
    { is: "IS 10322 (Part 5/Sec 3) : 2012", title: "Luminaires for Road and Street Lighting" },
    { is: "IS 16046 (Part 2) : 2018", title: "Secondary Cells Containing Alkaline / Non-Acid Electrolytes (Lithium)" },
    { is: "IS 14286 : 2010", title: "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules" },
    { is: "IS 16103 (Part 1) : 2012", title: "Led Modules for General Lighting Safety Specifications" }
  ];

  // Fetch relationships for current primary
  const allRelationships = useMemo(() => {
    return SOLAR_STREET_LIGHT_RELATIONSHIPS.filter((r: StandardRelationship) => 
      r.source_is_number.toLowerCase().includes(selectedStandardId.toLowerCase().split(' ')[1]) ||
      r.source_is_number === selectedStandardId ||
      selectedStandardId.includes(r.source_is_number)
    );
  }, [selectedStandardId]);

  // Apply category type filter
  const filteredRelationships = useMemo(() => {
    if (selectedTypeFilter === 'ALL') return allRelationships;
    return allRelationships.filter((r: StandardRelationship) => r.relationship_type === selectedTypeFilter);
  }, [allRelationships, selectedTypeFilter]);

  const visibleRelationships = filteredRelationships.slice(0, visibleLimit);

  // Type color configuration
  const typeConfig: Record<RelationshipType, { bg: string; text: string; border: string; label: string }> = {
    NORMATIVE_REFERENCE: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', label: 'Normative Reference' },
    TEST_METHOD: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', label: 'Test Method' },
    TERMINOLOGY: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300', label: 'Terminology' },
    SAFETY: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', label: 'Safety Standard' },
    INSTALLATION: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', label: 'Installation Standard' },
    RELATED_PRODUCT: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300', label: 'Related Product' },
    ASSOCIATED_STANDARD: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', label: 'Associated Standard' },
    SUPERSEDES: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', label: 'Supersedes' },
    SUPERSEDED_BY: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', label: 'Superseded By' },
    AMENDMENT: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300', label: 'Amendment' }
  };

  // Grouped stats
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRelationships.forEach((r: StandardRelationship) => {
      counts[r.relationship_type] = (counts[r.relationship_type] || 0) + 1;
    });
    return counts;
  }, [allRelationships]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-gov-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Network className="w-4 h-4 text-gov-700" />
          <span>Interactive Standards Ecosystem</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Standards Relationship Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore normative citations, test protocols, safety requirements, and superseded amendments connected to primary standards.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
            <button
              onClick={() => { setViewMode('graph'); setHasGraphError(false); }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                viewMode === 'graph' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-gov-800" />
              <span>Graph View</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                viewMode === 'tree' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-gov-800" />
              <span>Tree View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                viewMode === 'list' ? 'bg-white text-gov-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-gov-800" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column / Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Sidebar: Standard Selection & Type Filters (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Primary Indian Standard
            </label>
            <select
              value={selectedStandardId}
              onChange={(e) => {
                setSelectedStandardId(e.target.value);
                setSelectedDrawerNode(null);
                setVisibleLimit(10);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700"
            >
              {primaryOptions.map(p => (
                <option key={p.is} value={p.is}>
                  {p.is}
                </option>
              ))}
            </select>

            <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
              <span className="font-semibold text-slate-800 block text-[11px]">Selected Standard Scope:</span>
              <p className="mt-0.5 text-[11px] line-clamp-3">
                {primaryOptions.find(p => p.is === selectedStandardId)?.title}
              </p>
            </div>
          </div>

          {/* Relationship Filter Chips */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Filter by Relationship
            </span>

            <button
              onClick={() => setSelectedTypeFilter('ALL')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedTypeFilter === 'ALL' 
                  ? 'bg-gov-900 text-white font-bold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>All Connected Standards</span>
              <span className="font-mono text-[10px] bg-slate-200/50 px-1.5 py-0.2 rounded text-slate-700">
                {allRelationships.length}
              </span>
            </button>

            {Object.entries(typeConfig).map(([typeKey, cfg]) => {
              const count = typeCounts[typeKey] || 0;
              if (count === 0) return null;
              const isSelected = selectedTypeFilter === typeKey;

              return (
                <button
                  key={typeKey}
                  onClick={() => setSelectedTypeFilter(typeKey)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    isSelected 
                      ? `${cfg.bg} ${cfg.text} font-bold border ${cfg.border}` 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cfg.label}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Summary KPI count */}
          <div className="bg-gov-950 p-4 rounded-xl text-white space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-400 block">
              Standards Ecosystem
            </span>
            <div className="text-xl font-bold font-mono">
              {allRelationships.length} Related Standards
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5 pt-1">
              <div>• {typeCounts['NORMATIVE_REFERENCE'] || 0} Normative References</div>
              <div>• {typeCounts['TEST_METHOD'] || 0} Test Methods</div>
              <div>• {typeCounts['SAFETY'] || 0} Safety Standards</div>
              <div>• {typeCounts['INSTALLATION'] || 0} Installation / Pole</div>
              <div>• {typeCounts['RELATED_PRODUCT'] || 0} Sub-assembly Norms</div>
            </div>
          </div>
        </div>

        {/* Center: Graph Canvas / Tree / List (6 or 9 cols depending on drawer) */}
        <div className={`space-y-4 ${selectedDrawerNode ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
          
          {/* Main Visualization Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[580px]">
            
            {/* Viewport Top Bar Controls */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700 font-mono">
                  Primary: {selectedStandardId}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gov-100 text-gov-800 font-semibold">
                  Showing {visibleRelationships.length} of {filteredRelationships.length}
                </span>
              </div>

              {/* Zoom and Fit Controls */}
              {viewMode === 'graph' && !hasGraphError && (
                <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title="Fit to Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setZoomLevel(1); setSelectedDrawerNode(null); }}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title="Reset View"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewport Content */}
            <div className="p-4 flex-1 flex flex-col justify-center overflow-auto relative">
              
              {/* Fallback check if empty */}
              {allRelationships.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800 font-serif">
                    No verified relationship records are currently available for this standard.
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Bureau of Indian Standards relationships are continuously indexed as normative cross-references are validated.
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. GRAPH VIEW */}
                  {viewMode === 'graph' && !hasGraphError && (
                    <div 
                      className="w-full flex-1 flex items-center justify-center p-4 transition-transform duration-300"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      <div className="relative w-full max-w-2xl min-h-[460px] flex items-center justify-center">
                        
                        {/* Center Primary Node */}
                        <div className="z-20 p-4 rounded-2xl bg-gov-950 text-white shadow-xl border-2 border-saffron-500 text-center max-w-[220px] ring-8 ring-gov-950/10">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-saffron-400 block mb-1">
                            PRIMARY STANDARD
                          </span>
                          <div className="font-mono font-bold text-xs leading-snug">
                            {selectedStandardId}
                          </div>
                          <span className="text-[10px] text-slate-300 line-clamp-1 mt-1 block">
                            Core Procurement Focus
                          </span>
                        </div>

                        {/* Orbital Surrounding Connected Nodes */}
                        {visibleRelationships.map((rel: StandardRelationship, index: number) => {
                          const total = visibleRelationships.length;
                          const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
                          // Orbit radius in pixels
                          const rx = 240;
                          const ry = 190;
                          const x = Math.round(rx * Math.cos(angle));
                          const y = Math.round(ry * Math.sin(angle));

                          const cfg = typeConfig[rel.relationship_type as RelationshipType] || typeConfig.ASSOCIATED_STANDARD;
                          const isSelected = selectedDrawerNode?.id === rel.id;

                          return (
                            <div 
                              key={rel.id}
                              style={{
                                transform: `translate(${x}px, ${y}px)`
                              }}
                              onClick={() => setSelectedDrawerNode(rel)}
                              className={`absolute z-10 p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 max-w-[190px] text-left shadow-sm hover:shadow-md hover:scale-105 ${
                                isSelected 
                                  ? `${cfg.bg} border-gov-900 ring-4 ring-gov-900/20 scale-105` 
                                  : `${cfg.bg} ${cfg.border} hover:border-gov-700 bg-white`
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${cfg.text} ${cfg.bg}`}>
                                  {cfg.label}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400">
                                  {Math.round(rel.confidence * 100)}%
                                </span>
                              </div>
                              <div className="font-mono font-bold text-[11px] text-slate-900 truncate">
                                {rel.target_is_number}
                              </div>
                              <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5">
                                {rel.target_title}
                              </p>
                            </div>
                          );
                        })}

                        {/* Subtle Connecting Line Overlay (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-200" strokeWidth="1.5" strokeDasharray="3 3">
                          <circle cx="50%" cy="50%" r="215" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* 2. TREE VIEW */}
                  {viewMode === 'tree' && (
                    <div className="space-y-4 p-4 text-xs font-sans">
                      <div className="flex items-center space-x-2 p-3 bg-gov-950 text-white rounded-xl">
                        <span className="font-mono font-bold text-saffron-400">{selectedStandardId}</span>
                        <span className="text-slate-300 text-xs">• Root Standard</span>
                      </div>

                      <div className="pl-4 border-l-2 border-slate-200 space-y-4 ml-3">
                        {Object.entries(typeConfig).map(([typeKey, cfg]) => {
                          const relsInGroup = visibleRelationships.filter((r: StandardRelationship) => r.relationship_type === typeKey);
                          if (relsInGroup.length === 0) return null;

                          return (
                            <div key={typeKey} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                  {cfg.label} ({relsInGroup.length})
                                </span>
                              </div>

                              <div className="pl-4 space-y-2">
                                {relsInGroup.map((r: StandardRelationship) => (
                                  <div
                                    key={r.id}
                                    onClick={() => setSelectedDrawerNode(r)}
                                    className="p-3 bg-slate-50 hover:bg-gov-50 rounded-lg border border-slate-200 cursor-pointer transition flex items-center justify-between"
                                  >
                                    <div>
                                      <div className="font-mono font-bold text-slate-900">{r.target_is_number}</div>
                                      <div className="text-[11px] text-slate-600 line-clamp-1">{r.target_title}</div>
                                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ref: {r.source_reference}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. LIST VIEW */}
                  {viewMode === 'list' && (
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                            <th className="py-2.5 px-3">Relationship Type</th>
                            <th className="py-2.5 px-3">Connected Standard</th>
                            <th className="py-2.5 px-3">Description & Rationale</th>
                            <th className="py-2.5 px-3">Citation</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {visibleRelationships.map((r: StandardRelationship) => {
                            const cfg = typeConfig[r.relationship_type as RelationshipType] || typeConfig.ASSOCIATED_STANDARD;
                            return (
                              <tr 
                                key={r.id}
                                onClick={() => setSelectedDrawerNode(r)}
                                className="hover:bg-slate-50 cursor-pointer transition"
                              >
                                <td className="py-2.5 px-3">
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                    {cfg.label}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                                  {r.target_is_number}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                                  {r.description}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                  {r.source_reference}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                                    {r.status}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button className="text-gov-800 hover:text-gov-900 font-bold text-[11px]">
                                    Inspect →
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Actions: Load More Relationships */}
            {filteredRelationships.length > visibleLimit && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={() => setVisibleLimit(prev => prev + 10)}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-gov-700" />
                  <span>Load More Relationships ({filteredRelationships.length - visibleLimit} remaining)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Node Details Drawer (3 Cols when open) */}
        {selectedDrawerNode && (
          <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-md space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Connected Standard Details
              </span>
              <button
                onClick={() => setSelectedDrawerNode(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${typeConfig[selectedDrawerNode.relationship_type]?.bg} ${typeConfig[selectedDrawerNode.relationship_type]?.text} border ${typeConfig[selectedDrawerNode.relationship_type]?.border}`}>
                {typeConfig[selectedDrawerNode.relationship_type]?.label}
              </span>
              <h3 className="font-mono font-bold text-sm text-slate-900 mt-2">
                {selectedDrawerNode.target_is_number}
              </h3>
              <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                {selectedDrawerNode.target_title}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Why Connected:</span>
                <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                  {selectedDrawerNode.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Citation / Clause:</span>
                <span className="text-[11px] font-mono text-gov-800 font-semibold">
                  {selectedDrawerNode.source_reference}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500">Mapping Confidence:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {Math.round(selectedDrawerNode.confidence * 100)}% Verified
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigateToStandard && onNavigateToStandard(selectedDrawerNode.target_is_number)}
                className="w-full py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-saffron-400" />
                <span>View Standard Specification</span>
              </button>

              <button
                onClick={() => onNavigateToTraceability && onNavigateToTraceability()}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-medium shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-gov-700" />
                <span>Inspect in Traceability Matrix</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
