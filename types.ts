
export interface LTReplacement {
  value: string;
}

export interface LTContext {
  text: string;
  offset: number;
  length: number;
}

export interface LTURL {
    value: string;
}

export interface LTRule {
  id: string;
  description: string;
  issueType: string;
  category: {
    id: string;
    name: string;
  };
  urls?: LTURL[];
}

export interface LTError {
  message: string;
  shortMessage: string;
  replacements: LTReplacement[];
  offset: number;
  length: number;
  context: LTContext;
  sentence: string;
  type: {
    typeName: string;
  };
  rule: LTRule;
}

export interface LTResponse {
  matches: LTError[];
}

export interface AnalysisResult {
  score: number;
  summary: string;
}
