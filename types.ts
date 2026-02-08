export interface EmailProof {
  id: string; // The SMTP Message-ID
  timestamp: number;
  headers: {
    from: string;
    to: string;
    subject: string;
    contentHash: string; // Simulated SHA hash of the content
  };
  signature: string; // The RSA signature acting as proof
}

// Strict State Enum (Logic Layer)
export type AuditState =
  | 'DRAFT'        // Initial state, unsigned (User input when Totem disconnected)
  | 'QUARANTINED'  // High risk, blocked by policy (The "Red" State)
  | 'COMMITTED';   // Signed & Verified (The "Green" State)

export interface AuditEvent {
  id: string;
  timestamp: number;
  action: string;       // e.g., "Transfer $500"
  risk: 'LOW' | 'HIGH'; // Used for the Risk Filter logic
  state: AuditState;
  summary: string;      // The human-readable card content
  raw_log: string;      // The raw evidence code block
  signature?: string;   // Required ONLY if state === 'COMMITTED'

  // Phase 7 Enhancements
  ts_sig?: string;      // Timestamp signature (Mock)
  prev_hash?: string;   // Blockchain-style linking (Mock)
  thought_signature?: string; // Real from API (or fallback)

  // Phase 9: Sync
  relatedId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  subject: string;

  // State Enforcement: Strict 3-state machine
  status: 'draft' | 'committed' | 'quarantined';

  // Authorization: The existence of this object allows transition to 'committed'
  authProof?: EmailProof;
}

export interface TotemState {
  isConnected: boolean;
  isSigning: boolean;
  lastSignatureTime: number | null;
  statusMessage: string;
}

export enum LogType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SIGN = 'SIGN',
  SMTP = 'SMTP',
  AUTH = 'AUTH',
  THOUGHT = 'THOUGHT' // New LogType for Gemini 3 Internal State
}

// Keep SystemLog for backward compat if needed, or deprecate. 
// We will likely map SystemLog to AuditEvent visuals or use AuditEvent directly in the new Log component.
export interface SystemLog {
  id: string;
  timestamp: number;
  type: LogType;
  message: string;
  details?: string;

  // Optional: Link to strict AuditEvent if available
  auditEvent?: AuditEvent;
}