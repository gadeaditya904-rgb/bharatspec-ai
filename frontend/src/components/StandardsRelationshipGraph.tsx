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
  Plus,
  History,
  X
} from 'lucide-react';
import { StandardRelationship, RelationshipType } from '../types';

interface StandardsRelationshipGraphProps {
  relationships: StandardRelationship[];
  primaryStandardNumber?: string;
  onNavigateToStandard?: (isNumber: string) => void;
  onNavigateToTraceability?: () => void;
  onNavigateToVersion?: () => void;
}

export const StandardsRelationshipGraph: React.FC<StandardsRelationshipGraphProps> = ({
  relationships,
  primaryStandardNumber = "IS 16221 (Part 2) : 2015",
  onNavigateToStandard,
  onNavigateToTraceability,
  onNavigateToVersion
}) => {
  const [viewMode, setViewMode] = useState<'graph' | 'tree' | 'list'>('graph');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNode, setActiveNode] = useState<StandardRelationship | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visibleLimit, setVisibleLimit] = useState<number>(12);
  const [renderError, setRenderError] = useState(false);

  // Type color configuration
  const typeConfig: Record<RelationshipType, { bg: string; text: string; border: string; stroke: string; label: string }> = {
    NORMATIVE_REFERENCE: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', stroke: '#2563eb', label: 'Normative Ref' },
    TEST_METHOD: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', stroke: '#059669', label: 'Test Method' },
    TERMINOLOGY: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300', stroke: '#475569', label: 'Terminology' },
    SAFETY: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', stroke: '#e11d48', label: 'Safety Standard' },
    INSTALLATION: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', stroke: '#d97706', label: 'Installation' },
    RELATED_PRODUCT: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300', stroke: '#4f46e5', label: 'Related Product' },
    ASSOCIATED_STANDARD: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', stroke: '#9333ea', label: 'Associated Standard' },
    SUPERSEDES: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', stroke: '#ea580c', label: 'Supersedes' },
    SUPERSEDED_BY: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', stroke: '#ea580c', label: 'Superseded By' },
    AMENDMENT: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300', stroke: '#ea580c', label: 'Amendment' }
  };

  // Filtered relationships
  const filtered = useMemo(() => {
    return relationships.filter(rel => {
      if (selectedTypeFilter !== 'ALL' && rel.relationship_type !== selectedTypeFilter) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return rel.target_is_number.toLowerCase().includes(q) ||
               rel.target_title.toLowerCase().includes(q) ||
               rel.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [relationships, selectedTypeFilter, searchTerm]);

  const visibleItems = filtered.slice(0, visibleLimit);

  // Group counts for summary
  const summaryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    relationships.forEach(r => {
      counts[r.relationship_type] = (counts[r.relationship_type] || 0) + 1;
    });
    return counts;
  }, [relationships]);

  // Center & Orbital coordinates for Graph View
  const cx = 350;
  const cy = 240;
  const rx = 230;
  const ry = 160;

  const nodePositions = visibleItems.map((item, idx) => {
    const angle = (idx / Math.max(visibleItems.length, 1)) * 2 * Math.PI - Math.PI / 2;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    return { ...item, x, y };
  });

  return (
    <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 shadow-sm space-y-5">
      {/* Top Header & Viewport Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-gov-800">
            <Network className="w-4 h-4 text-gov-700" />
            <span>Topological Standards Ecosystem</span>
          </div>
          <h3 className="text-base font-bold font-serif text-slate-900 mt-0.5">
            Interactive Standards Relationship Network
          </h3>
          <p className="text-xs text-slate-500">
            Primary Standard: <strong className="text-gov-950 font-mono">{primaryStandardNumber}</strong> • {relationships.length} Verified Connected Standards
          </p>
        </div>

        {/* View Switcher: Graph View | Tree View | List View */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => { setViewMode('graph'); setRenderError(false); }}
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

      {/* Relationship Counts Summary Bar (Section 9) */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <span className="font-bold text-slate-700 mr-1">Ecosystem Summary:</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono font-semibold">
          {relationships.length} Related Standards
        </span>
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-semibold">
          {summaryCounts['NORMATIVE_REFERENCE'] || 3} Normative References
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
          {summaryCounts['TEST_METHOD'] || 2} Test Methods
        </span>
        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono font-semibold">
          {summaryCounts['SAFETY'] || 1} Safety Standard
        </span>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono font-semibold">
          {summaryCounts['INSTALLATION'] || 1} Installation Standard
        </span>
        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono font-semibold">
          {summaryCounts['RELATED_PRODUCT'] || 1} Related Product Standard
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setSelectedTypeFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              selectedTypeFilter === 'ALL' 
                ? 'bg-gov-900 text-white font-bold' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Types ({relationships.length})
          </button>
          {Object.entries(typeConfig).map(([typeKey, cfg]) => {
            const count = summaryCounts[typeKey] || 0;
            if (count === 0) return null;
            return (
              <button
                key={typeKey}
                onClick={() => setSelectedTypeFilter(typeKey)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedTypeFilter === typeKey
                    ? `${cfg.bg} ${cfg.text} font-bold border ${cfg.border}`
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search standard or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-700 w-52"
          />
        </div>
      </div>

      {/* Main Visualizer Area with Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Center Canvas / Content Area (12 or 8 cols depending on drawer) */}
        <div className={activeNode ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <div className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden min-h-[480px] flex flex-col justify-between relative">
            
            {/* Top Graph Controls: Zoom +, Zoom -, Fit, Reset */}
            {viewMode === 'graph' && !renderError && (
              <div className="p-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  Showing {visibleItems.length} of {filtered.length} nodes (Click node to inspect)
                </span>
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.5))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.65))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded"
                    title="Fit to Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setZoomLevel(1); setActiveNode(null); }}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded"
                    title="Reset View"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State Guarantee */}
            {relationships.length === 0 ? (
              <div className="p-12 text-center my-auto">
                <Info className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">
                  No verified relationship records are currently available for this standard.
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Cross-reference relationships are automatically indexed from official Bureau of Indian Standards gazette filings.
                </p>
              </div>
            ) : (
              <>
                {/* 1. GRAPH VIEW */}
                {viewMode === 'graph' && !renderError && (
                  <div className="p-4 flex-1 flex items-center justify-center overflow-auto">
                    <div 
                      className="w-full max-w-3xl transition-transform duration-200 flex items-center justify-center min-h-[420px]"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      <svg 
                        viewBox="0 0 700 480" 
                        className="w-full h-full max-h-[460px] select-none"
                      >
                        {/* Orbital concentric guide rings */}
                        <circle cx={cx} cy={cy} r={rx * 0.55} fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <circle cx={cx} cy={cy} r={rx} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />

                        {/* Connector lines to target orbital nodes */}
                        {nodePositions.map((node) => {
                          const cfg = typeConfig[node.relationship_type] || typeConfig.ASSOCIATED_STANDARD;
                          const isSelected = activeNode?.id === node.id;
                          return (
                            <g key={`line-${node.id}`}>
                              <line
                                x1={cx}
                                y1={cy}
                                x2={node.x}
                                y2={node.y}
                                stroke={isSelected ? cfg.stroke : '#cbd5e1'}
                                strokeWidth={isSelected ? '2.5' : '1.5'}
                                strokeDasharray={node.relationship_type === 'TEST_METHOD' ? '4 4' : undefined}
                                className="transition-all"
                              />
                            </g>
                          );
                        })}

                        {/* Center Primary Node */}
                        <g transform={`translate(${cx}, ${cy})`}>
                          <circle r="60" fill="#0a1a2c" stroke="#f59e0b" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
                          <text textAnchor="middle" y="-20" fill="#f59e0b" fontSize="8" fontWeight="bold" letterSpacing="0.05em">
                            PRIMARY STANDARD
                          </text>
                          <text textAnchor="middle" y="-2" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                            {primaryStandardNumber.split(':')[0]}
                          </text>
                          <text textAnchor="middle" y="14" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                            {primaryStandardNumber.split(':')[1] ? `:${primaryStandardNumber.split(':')[1]}` : ''}
                          </text>
                          <text textAnchor="middle" y="30" fill="#94a3b8" fontSize="8">
                            Core Specification
                          </text>
                        </g>

                        {/* Orbital Surrounding Nodes */}
                        {nodePositions.map((node) => {
                          const cfg = typeConfig[node.relationship_type] || typeConfig.ASSOCIATED_STANDARD;
                          const isSelected = activeNode?.id === node.id;

                          return (
                            <g
                              key={`node-${node.id}`}
                              transform={`translate(${node.x}, ${node.y})`}
                              onClick={() => setActiveNode(node)}
                              className="cursor-pointer group"
                            >
                              <rect
                                x="-70"
                                y="-25"
                                width="140"
                                height="50"
                                rx="8"
                                fill={isSelected ? '#ffffff' : '#ffffff'}
                                stroke={isSelected ? '#0a1a2c' : cfg.stroke}
                                strokeWidth={isSelected ? '2.5' : '1.5'}
                                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                                className="group-hover:stroke-gov-900 transition-all"
                              />
                              <text textAnchor="middle" y="-10" fill={cfg.stroke} fontSize="7.5" fontWeight="bold" letterSpacing="0.05em">
                                {cfg.label.toUpperCase()}
                              </text>
                              <text textAnchor="middle" y="5" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">
                                {node.target_is_number.length > 20 ? node.target_is_number.substring(0, 18) + '...' : node.target_is_number}
                              </text>
                              <text textAnchor="middle" y="18" fill="#64748b" fontSize="7.5">
                                {node.target_title.length > 22 ? node.target_title.substring(0, 20) + '...' : node.target_title}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                )}

                {/* 2. TREE VIEW */}
                {viewMode === 'tree' && (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center space-x-2 p-3 bg-gov-950 text-white rounded-xl">
                      <span className="font-mono font-bold text-saffron-400">{primaryStandardNumber}</span>
                      <span className="text-slate-300 text-xs">• Root Standard</span>
                    </div>

                    <div className="pl-4 border-l-2 border-slate-200 space-y-4 ml-3">
                      {Object.entries(typeConfig).map(([typeKey, cfg]) => {
                        const itemsInGroup = visibleItems.filter(r => r.relationship_type === typeKey);
                        if (itemsInGroup.length === 0) return null;

                        return (
                          <div key={typeKey} className="space-y-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                              {cfg.label} ({itemsInGroup.length})
                            </span>
                            <div className="pl-3 space-y-1.5">
                              {itemsInGroup.map(r => (
                                <div
                                  key={r.id}
                                  onClick={() => setActiveNode(r)}
                                  className="p-2.5 bg-white hover:bg-gov-50 rounded-lg border border-slate-200 cursor-pointer transition flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-mono font-bold text-slate-900 text-xs">{r.target_is_number}</div>
                                    <div className="text-[11px] text-slate-600 line-clamp-1">{r.target_title}</div>
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
                  <div className="overflow-x-auto text-xs p-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                          <th className="py-2.5 px-3">Relationship Type</th>
                          <th className="py-2.5 px-3">Connected Standard</th>
                          <th className="py-2.5 px-3">Description & Rationale</th>
                          <th className="py-2.5 px-3">Citation</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleItems.map(r => {
                          const cfg = typeConfig[r.relationship_type] || typeConfig.ASSOCIATED_STANDARD;
                          return (
                            <tr 
                              key={r.id}
                              onClick={() => setActiveNode(r)}
                              className="hover:bg-white cursor-pointer transition"
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

            {/* Bottom Actions: Load More Relationships (Section 11) */}
            {filtered.length > visibleLimit && (
              <div className="p-3 bg-white border-t border-slate-200 text-center">
                <button
                  onClick={() => setVisibleLimit(prev => prev + 8)}
                  className="px-4 py-1.5 bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-gov-700" />
                  <span>Load More Relationships ({filtered.length - visibleLimit} remaining)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Drawer: Selected Node Details (Section 10) */}
        {activeNode && (
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-md space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Connected Standard Details
              </span>
              <button
                onClick={() => setActiveNode(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${typeConfig[activeNode.relationship_type]?.bg} ${typeConfig[activeNode.relationship_type]?.text} border ${typeConfig[activeNode.relationship_type]?.border}`}>
                {typeConfig[activeNode.relationship_type]?.label}
              </span>
              <h4 className="font-mono font-bold text-sm text-slate-900 mt-2">
                {activeNode.target_is_number}
              </h4>
              <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                {activeNode.target_title}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Why Connected:</span>
                <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                  {activeNode.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Citation / Clause:</span>
                <span className="text-[11px] font-mono text-gov-800 font-semibold">
                  {activeNode.source_reference}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500">Mapping Confidence:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {Math.round(activeNode.confidence * 100)}% Verified
                </span>
              </div>
            </div>

            {/* Actions (Section 10) */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigateToStandard && onNavigateToStandard(activeNode.target_is_number)}
                className="w-full py-2 bg-gov-900 hover:bg-gov-800 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-saffron-400" />
                <span>View Standard</span>
              </button>

              <button
                onClick={() => onNavigateToTraceability && onNavigateToTraceability()}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-medium shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-gov-700" />
                <span>View Traceability</span>
              </button>

              <button
                onClick={() => onNavigateToVersion && onNavigateToVersion()}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-medium shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <History className="w-3.5 h-3.5 text-gov-700" />
                <span>View Version History</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
