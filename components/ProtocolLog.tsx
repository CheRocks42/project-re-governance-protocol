import React, { useRef, useEffect, useState } from 'react';
import { SystemLog, AuditEvent, AuditState } from '../types';
import { Terminal, Eye, FileJson, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';

interface ProtocolLogProps {
  logs: SystemLog[];
  // Phase 9: Sync
  highlightedId?: string | null;
  onHighlight?: (id: string) => void;
}

const AuditCard: React.FC<{
  event: AuditEvent;
  isHighlighted?: boolean;
  onHighlight?: (id: string) => void;
}> = ({ event, isHighlighted, onHighlight }) => {
  const [showRaw, setShowRaw] = useState(false);

  // Visual Mapping
  const getStatusStyle = (state: AuditState) => {
    switch (state) {
      case 'QUARANTINED': return 'border-red-500/50 bg-red-950/20 text-red-400';
      case 'COMMITTED': return 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400';
      case 'DRAFT': return 'border-yellow-500/30 bg-yellow-950/10 text-yellow-400';
      default: return 'border-slate-800 bg-slate-900 text-slate-400';
    }
  };

  const getStatusIcon = (state: AuditState) => {
    switch (state) {
      case 'QUARANTINED': return <ShieldAlert size={14} />;
      case 'COMMITTED': return <ShieldCheck size={14} />;
      case 'DRAFT': return <FileText size={14} />;
    }
  };

  const getStatusLabel = (state: AuditState) => {
    switch (state) {
      case 'QUARANTINED': return 'POLICY HELD';
      case 'COMMITTED': return 'SIGNED & COMMITTED';
      case 'DRAFT': return 'LOGGED (UNSIGNED)';
    }
  };

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={cardRef}
      onClick={() => onHighlight?.(event.relatedId || '')}
      className={`border rounded mb-3 overflow-hidden transition-all cursor-pointer ${getStatusStyle(event.state)}
        ${isHighlighted ? 'ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : ''}
      `}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center p-2 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
          {getStatusIcon(event.state)}
          <span>{getStatusLabel(event.state)}</span>
        </div>
        <div className="text-[10px] font-mono opacity-60">
          {new Date(event.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3">
        {showRaw ? (
          // Raw Log View
          <div>
            <div className="text-[9px] font-bold text-slate-500 mb-1 tracking-wider">SOURCE OF TRUTH (IMMUTABLE LOG)</div>
            <div className="font-mono leading-relaxed break-all whitespace-pre-wrap opacity-80 text-xs">
              {event.raw_log}
            </div>
          </div>
        ) : (
          // Summary View
          <div>
            <div className="text-[9px] font-bold text-slate-500 mb-1 tracking-wider">AI INTERPRETATION (GEMINI)</div>
            <div className="text-sm font-semibold mb-1">{event.action}</div>
            <div className="text-xs opacity-70 mb-2">{event.summary}</div>

            <div className="flex justify-between items-end mt-2 border-t border-white/10 pt-2">
              <div className="text-[10px] font-mono">
                RISK: <span className={event.risk === 'HIGH' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{event.risk}</span>
              </div>
              {event.signature && (
                <div className="text-[10px] font-mono text-emerald-600 truncate max-w-[150px]">
                  SIG: {event.signature.substring(0, 12)}...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setShowRaw(!showRaw)}
        className="w-full text-center py-1 bg-black/30 hover:bg-black/50 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors border-t border-white/5 flex items-center justify-center gap-2"
      >
        {showRaw ? <FileText size={10} /> : <Eye size={10} />}
        {showRaw ? 'VIEW SUMMARY' : 'VIEW RAW LOGS'}
      </button>
    </div>
  );
};

export const ProtocolLog: React.FC<ProtocolLogProps> = ({ logs, highlightedId, onHighlight }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
          <Terminal size={16} />
          Protocol Audit Log (Schema v3.0)
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">PORT: 993/587 (SIM)</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3" ref={scrollRef}>
        {logs.map((log) => {
          // Check if this log has an attached AuditEvent (Phase 3 Strict Schema)
          if (log.auditEvent) {
            const isHighlighted = highlightedId === log.auditEvent.relatedId;
            return <AuditCard
              key={log.id}
              event={log.auditEvent}
              isHighlighted={isHighlighted}
              onHighlight={onHighlight}
            />;
          }

          // Fallback for legacy simple logs (Phase 1/2 logs that might still occur)
          return (
            <div key={log.id} className="mb-2 pl-2 border-l border-slate-800 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">
              <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
            </div>
          );
        })}
      </div>
    </div>
  );
};