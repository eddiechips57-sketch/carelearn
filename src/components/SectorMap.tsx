import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BandNode {
  id: string;
  label: string;
  slug: string;
  roles: string[];
  salary: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label: string;
}

const nhsBands: BandNode[] = [
  { id: 'nhs-2', label: 'Band 2', slug: 'healthcare-support-worker', roles: ['Healthcare Assistant', 'Care Support Worker'], salary: '£22,383', x: 60, y: 60 },
  { id: 'nhs-3', label: 'Band 3', slug: 'senior-healthcare-support-worker', roles: ['Senior HCA', 'Therapy Assistant'], salary: '£22,816 - £24,336', x: 60, y: 130 },
  { id: 'nhs-4', label: 'Band 4', slug: 'assistant-practitioner', roles: ['Assistant Practitioner', 'Associate Practitioner'], salary: '£25,147 - £27,596', x: 60, y: 200 },
  { id: 'nhs-5', label: 'Band 5', slug: 'registered-nurse', roles: ['Registered Nurse', 'Newly Qualified Practitioner'], salary: '£28,407 - £34,581', x: 60, y: 270 },
  { id: 'nhs-6', label: 'Band 6', slug: 'senior-nurse', roles: ['Senior Nurse', 'Specialist Practitioner'], salary: '£35,392 - £42,618', x: 60, y: 340 },
  { id: 'nhs-7', label: 'Band 7', slug: 'nurse-team-leader', roles: ['Ward Manager', 'Team Leader'], salary: '£43,742 - £50,056', x: 60, y: 410 },
  { id: 'nhs-8', label: 'Band 8+', slug: 'advanced-practitioner', roles: ['Matron', 'Consultant Nurse', 'Director'], salary: '£50,952+', x: 60, y: 480 },
];

const sfcLevels: BandNode[] = [
  { id: 'sfc-entry', label: 'Entry', slug: 'care-worker', roles: ['Care Worker', 'Support Worker'], salary: '£20,000 - £22,000', x: 440, y: 60 },
  { id: 'sfc-core', label: 'Core', slug: 'senior-care-worker', roles: ['Senior Care Worker', 'Lead Care Worker'], salary: '£22,000 - £25,000', x: 440, y: 150 },
  { id: 'sfc-lead', label: 'Lead', slug: 'deputy-manager', roles: ['Deputy Manager', 'Team Leader'], salary: '£25,000 - £32,000', x: 440, y: 240 },
  { id: 'sfc-manager', label: 'Manager', slug: 'registered-manager', roles: ['Registered Manager', 'Service Manager'], salary: '£32,000 - £42,000', x: 440, y: 330 },
  { id: 'sfc-advanced', label: 'Advanced', slug: 'area-manager', roles: ['Area Manager', 'Operations Director'], salary: '£42,000+', x: 440, y: 420 },
];

const connections: Connection[] = [
  { from: 'nhs-2', to: 'sfc-entry', label: 'Care Worker to HCSW' },
  { from: 'nhs-3', to: 'sfc-core', label: 'Senior HCA to Senior Care Worker' },
  { from: 'nhs-4', to: 'sfc-lead', label: 'Assistant Practitioner to Team Lead' },
  { from: 'sfc-manager', to: 'nhs-6', label: 'Manager to Specialist' },
];

const NODE_WIDTH = 140;
const NODE_HEIGHT = 50;
const SVG_WIDTH = 560;
const SVG_HEIGHT = 540;

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  node: BandNode | null;
}

export default function SectorMap() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseEnter = useCallback((node: BandNode, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
      node,
    });
    setHoveredId(node.id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, x: 0, y: 0, node: null });
    setHoveredId(null);
  }, []);

  const handleClick = useCallback((node: BandNode) => {
    navigate(`/roles/${node.slug}`);
  }, [navigate]);

  const getConnectionPath = (from: BandNode, to: BandNode) => {
    const x1 = from.x + NODE_WIDTH / 2;
    const y1 = from.y + NODE_HEIGHT / 2;
    const x2 = to.x + NODE_WIDTH / 2;
    const y2 = to.y + NODE_HEIGHT / 2;
    const cx1 = x1 + (x2 - x1) * 0.4;
    const cx2 = x1 + (x2 - x1) * 0.6;
    return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
  };

  const allNodes = [...nhsBands, ...sfcLevels];

  const getNodeById = (id: string) => allNodes.find((n) => n.id === id);

  const isConnected = (id: string) =>
    connections.some((c) => c.from === id || c.to === id);

  return (
    <div className="section-padding">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3">
            Two-Framework Workforce Map
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Visualise how NHS Agenda for Change bands and Skills for Care levels align across the UK health and social care workforce.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs font-medium text-slate-600">NHS Agenda for Change</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-xs font-medium text-slate-600">Skills for Care</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="8"><path d="M 0 4 Q 12 0, 24 4" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="3 2" /></svg>
            <span className="text-xs font-medium text-slate-600">Cross-framework link</span>
          </div>
        </div>

        <div ref={containerRef} className="relative mx-auto" style={{ maxWidth: SVG_WIDTH }}>
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full h-auto"
            style={{ minHeight: 400 }}
          >
            <text x="60" y="30" textAnchor="start" className="fill-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              NHS AfC Bands
            </text>
            <text x="440" y="30" textAnchor="start" className="fill-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Skills for Care
            </text>

            {nhsBands.map((node, i) => {
              if (i < nhsBands.length - 1) {
                const next = nhsBands[i + 1];
                return (
                  <line
                    key={`nhs-line-${i}`}
                    x1={node.x + NODE_WIDTH / 2}
                    y1={node.y + NODE_HEIGHT}
                    x2={next.x + NODE_WIDTH / 2}
                    y2={next.y}
                    stroke="#dbeafe"
                    strokeWidth="2"
                  />
                );
              }
              return null;
            })}

            {sfcLevels.map((node, i) => {
              if (i < sfcLevels.length - 1) {
                const next = sfcLevels[i + 1];
                return (
                  <line
                    key={`sfc-line-${i}`}
                    x1={node.x + NODE_WIDTH / 2}
                    y1={node.y + NODE_HEIGHT}
                    x2={next.x + NODE_WIDTH / 2}
                    y2={next.y}
                    stroke="#d1fae5"
                    strokeWidth="2"
                  />
                );
              }
              return null;
            })}

            {connections.map((conn, i) => {
              const fromNode = getNodeById(conn.from);
              const toNode = getNodeById(conn.to);
              if (!fromNode || !toNode) return null;
              const isActive = hoveredId === conn.from || hoveredId === conn.to;
              return (
                <g key={`conn-${i}`}>
                  <path
                    d={getConnectionPath(fromNode, toNode)}
                    fill="none"
                    stroke={isActive ? '#0d9488' : '#94a3b8'}
                    strokeWidth={isActive ? 2 : 1.5}
                    strokeDasharray={isActive ? 'none' : '6 3'}
                    opacity={isActive ? 1 : 0.5}
                    className="transition-all duration-200"
                  />
                  {isActive && (
                    <circle r="3" fill="#0d9488">
                      <animateMotion dur="2s" repeatCount="indefinite" path={getConnectionPath(fromNode, toNode)} />
                    </circle>
                  )}
                </g>
              );
            })}

            {nhsBands.map((node) => {
              const active = hoveredId === node.id;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(node, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(node)}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx={12}
                    fill={active ? '#1e40af' : '#2563eb'}
                    className="transition-all duration-200"
                    filter={active ? 'url(#shadow)' : undefined}
                  />
                  <text
                    x={node.x + NODE_WIDTH / 2}
                    y={node.y + NODE_HEIGHT / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-white text-[13px] font-semibold pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {sfcLevels.map((node) => {
              const active = hoveredId === node.id;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(node, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(node)}
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx={12}
                    fill={active ? '#047857' : '#059669'}
                    className="transition-all duration-200"
                    filter={active ? 'url(#shadow)' : undefined}
                  />
                  <text
                    x={node.x + NODE_WIDTH / 2}
                    y={node.y + NODE_HEIGHT / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-white text-[13px] font-semibold pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            <defs>
              <filter id="shadow" x="-10%" y="-10%" width="130%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>
          </svg>

          {tooltip.visible && tooltip.node && (
            <div
              className="absolute z-50 pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="card-base p-4 shadow-lg min-w-[200px]">
                <p className="text-sm font-semibold text-slate-900 mb-1">{tooltip.node.label}</p>
                <p className="text-xs text-slate-500 mb-2">{tooltip.node.salary}</p>
                <div className="space-y-1">
                  {tooltip.node.roles.map((role) => (
                    <p key={role} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                      {role}
                    </p>
                  ))}
                </div>
                <p className="text-[10px] text-brand-600 font-medium mt-2">Click to view role details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
