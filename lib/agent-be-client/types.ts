export type AgentDraftStatus =
  | 'unconfigured'
  | 'configured'
  | 'pending_validation'
  | 'validated'
  | 'blocked';

export type ToolConnectionStatus =
  | 'not_configured'
  | 'pending_authentication'
  | 'connected'
  | 'blocked';

export interface TargetAgentDraft {
  draft_id: string;
  status: AgentDraftStatus;
  intent?: string;
  skills: string[];
  tools: Array<{
    key: string;
    name: string;
    connection_status: ToolConnectionStatus;
  }>;
  environments: string[];
  knowledge_sources: Array<{
    name: string;
    source_kind: string;
    status: string;
  }>;
}

export interface UpdateDraftInput {
  intent?: string;
  skills?: string[];
  tools?: string[];
  environments?: string[];
  knowledge_sources?: Array<{
    name: string;
    source_kind: string;
    uri?: string;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  final_agent_id?: string;
}
