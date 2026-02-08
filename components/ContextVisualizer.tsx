import React from 'react';
import { Message } from '../types';
import { GitBranch, ShieldCheck, Ban, FileText, Mail } from 'lucide-react';

interface ContextVisualizerProps {
  messages: Message[];
  // Phase 9: Sync
  highlightedId?: string | null;
  onHighlight?: (id: string) => void;
}

export const ContextVisualizer: React.FC<ContextVisualizerProps> = ({ messages, highlightedId, onHighlight }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <GitBranch size={16} />
          Context Tree (Immutable)
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-slate-600 text-xs mt-10">Waiting for Thread Initialization...</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id}
              onClick={() => onHighlight?.(msg.id)}
              ref={(el) => {
                if (highlightedId === msg.id && el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className={`relative pl-4 border-l-2 cursor-pointer transition-all duration-300 ${msg.status === 'quarantined' ? 'border-red-900' :
                  msg.status === 'committed' ? 'border-indigo-900' : 'border-slate-800'
                }`}>
              {/* Connector Dot */}
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
                  ${msg.status === 'committed' ? 'bg-green-900 border-green-500' :
                  msg.status === 'quarantined' ? 'bg-red-900 border-red-500' : 'bg-slate-800 border-slate-500'}
                `}></div>

              <div className={`rounded border text-xs shadow-sm transition-all overflow-hidden
                  ${msg.status === 'committed' ? 'bg-slate-950 border-slate-800 opacity-100' : 'bg-slate-900/50 border-slate-800 opacity-60'}
                  ${msg.id === highlightedId ? 'ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : ''}
                `}>
                {/* Status Header */}
                <div className="flex justify-between items-center p-2 bg-slate-900/50 border-b border-slate-800">
                  <span className="text-purple-400 font-mono font-bold truncate max-w-[120px]">{msg.subject}</span>
                  <div className="flex items-center gap-1">
                    {msg.status === 'committed' && <ShieldCheck size={12} className="text-green-500" />}
                    {msg.status === 'quarantined' && <Ban size={12} className="text-red-500" />}
                    {msg.status === 'draft' && <FileText size={12} className="text-slate-500" />}

                    <span className={`uppercase font-bold text-[9px] 
                        ${msg.status === 'committed' ? 'text-green-600' :
                        msg.status === 'quarantined' ? 'text-red-600' : 'text-slate-500'}
                      `}>
                      {msg.status}
                    </span>
                  </div>
                </div>

                {/* Email Proof Block */}
                {msg.authProof && (
                  <div className="p-2 bg-black/30 font-mono text-[9px] text-slate-500 space-y-1 border-b border-slate-800/50">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Mail size={10} />
                      <span>EMAIL OBJECT PROOF</span>
                    </div>
                    <div className="grid grid-cols-[30px_1fr] gap-x-2">
                      <span>ID:</span> <span className="text-slate-300 truncate">{msg.authProof.id}</span>
                      <span>Hash:</span> <span className="text-blue-400 truncate">{msg.authProof.headers.contentHash.substring(0, 16)}...</span>
                      <span>Sig:</span> <span className="text-green-600 truncate">{msg.authProof.signature.substring(0, 12)}...</span>
                    </div>
                  </div>
                )}

                {/* Message Preview */}
                <div className="p-2 text-slate-300 font-serif italic opacity-80">
                  "{msg.text.substring(0, 50)}{msg.text.length > 50 ? '...' : ''}"
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};