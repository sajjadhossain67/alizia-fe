export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export type ClaimStatus = 'verified' | 'partially_supported' | 'unsupported' | 'refuted';

export interface SourceSpan {
  source_id: string;
  title: string;
  url?: string;
  span_text: string;
  relevance_score: number;
}

export interface ClaimItem {
  id: string;
  claim_text: string;
  status: ClaimStatus;
  confidence: number;
  source_spans: SourceSpan[];
  tool_runs: string[];
  tests: string[];
  reasoning?: string;
}

export interface ProofSource {
  id: string;
  title: string;
  url?: string;
  snippet: string;
  domain?: string;
  relevance_score: number;
}

export interface ToolRunEvidence {
  id: string;
  tool_name: string;
  arguments: Record<string, any>;
  output?: any;
  verified: boolean;
  execution_time_ms: number;
}

export interface TestExecutionEvidence {
  id: string;
  test_type: string;
  code_or_assertion: string;
  passed: boolean;
  output: string;
  execution_time_ms: number;
}

export interface ProofObject {
  id: string;
  claims: ClaimItem[];
  sources: ProofSource[];
  tool_runs: ToolRunEvidence[];
  tests: TestExecutionEvidence[];
  confidence: number;
  verifier_verdict: 'PASS' | 'PARTIAL' | 'FAIL';
  unsupported_claims_count: number;
  verification_latency_ms: number;
}

export interface MessageProof {
  verified: boolean;
  hash: string;
  riskLevel?: string;
  executionTimeMs?: number;
  testsPassed?: string;
  certificateId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string | null;
  proof?: ProofObject | null;
  legacyProof?: MessageProof | null;
  model?: string;
  attachments?: Attachment[];
  isLive?: boolean;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  pinned?: boolean;
  model: string;
  messages: Message[];
}

export type ThemeMode = 'dark' | 'light' | 'cyber';
export type ReasoningEffort = 'high' | 'medium' | 'low';
export type ViewMode = 'chat' | 'agents' | 'rag';

export interface Settings {
  backendUrl: string;
  activeModel: string;
  reasoningEffort: ReasoningEffort;
  theme: ThemeMode;
  stream: boolean;
  webSearchEnabled: boolean;
  autoTTS: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  context: string;
  badge: string;
}

export type AgentState = 'QUEUED' | 'PLANNING' | 'RUNNING' | 'VERIFYING' | 'COMPLETED';

export interface AgentLog {
  id: string;
  time: string;
  tag: string;
  msg: string;
}

export interface ToastItem {
  id: string;
  message: string;
}

export interface RagResultItem {
  chunk_id: string;
  score: number;
  text: string;
}
