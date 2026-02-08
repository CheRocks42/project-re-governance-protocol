import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Power, Zap, Lock, Unlock } from 'lucide-react';
import { TotemState } from '../types';

interface TotemDeviceProps {
  state: TotemState;
  onToggleConnection: () => void;
}

export const TotemDevice: React.FC<TotemDeviceProps> = ({ state, onToggleConnection }) => {
  const [ledColor, setLedColor] = useState('bg-red-500');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!state.isConnected) {
      setLedColor('bg-red-900'); // Off/Dim
      setPulse(false);
    } else if (state.isSigning) {
      setLedColor('bg-blue-400'); // Activity
      setPulse(true);
    } else {
      setLedColor('bg-green-500'); // Idle/Ready
      setPulse(false);
    }
  }, [state.isConnected, state.isSigning]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Circuit Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={16} />
            Hardware Governance
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            ID: TOTEM-X1-99
          </div>
        </div>

        {/* The Physical Device Graphic */}
        <div
          onClick={onToggleConnection}
          className={`
            relative w-32 h-48 rounded-lg border-2 transition-all duration-300 cursor-pointer group
            flex flex-col items-center justify-center gap-4
            ${state.isConnected
              ? 'bg-slate-800 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
              : 'bg-slate-950 border-red-900 opacity-80 shadow-none grayscale'}
          `}
        >
          {/* Connector Pins */}
          <div className="absolute -bottom-3 w-16 h-4 bg-yellow-600 rounded-b-md border border-yellow-700"></div>

          {/* LED Indicator */}
          <div className={`
            w-6 h-6 rounded-full transition-all duration-200 shadow-inner border border-black/50
            ${ledColor}
            ${pulse ? 'animate-ping opacity-75' : ''}
          `}></div>
          <div className={`absolute top-[4.5rem] w-4 h-4 rounded-full ${ledColor} blur-md transition-all duration-200`}></div>

          <div className="text-center">
            <div className="font-mono text-xs text-slate-400 mb-1">SECURE ELEMENT</div>
            <div className={`font-bold text-lg ${state.isConnected ? 'text-green-400' : 'text-red-800'}`}>
              {state.isConnected ? 'ACTIVE' : 'OFFLINE'}
            </div>
          </div>

          {/* Icon Overlay */}
          <div className="absolute top-2 right-2 text-slate-600">
            {state.isConnected ? <Lock size={14} /> : <Unlock size={14} />}
          </div>

          <div className="absolute bottom-2 text-[10px] text-slate-600 font-mono">
            RSA-4096
          </div>
        </div>

        {/* Status Text */}
        <div className="w-full bg-black/50 rounded p-2 text-center border border-slate-800">
          <p className={`text-xs font-mono ${state.isConnected ? 'text-green-400' : 'text-red-500'}`}>
            {state.statusMessage}
          </p>
        </div>

        {/* Manual Kill Switch Button (Redundant visual for clarity) */}
        <button
          onClick={onToggleConnection}
          className={`
            w-full py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors
            ${state.isConnected
              ? 'bg-red-900/50 text-red-400 hover:bg-red-900 border border-red-800'
              : 'bg-green-900/50 text-green-400 hover:bg-green-900 border border-green-800'}
          `}
        >
          <Power size={16} />
          {state.isConnected ? 'REVOKE AI AUTHORITY' : 'CONNECT HARDWARE'}
        </button>
      </div>
    </div>
  );
};