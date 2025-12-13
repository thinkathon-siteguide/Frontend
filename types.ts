
export interface Workspace {
  id: string;
  name: string;
  location: string;
  stage: string;
  status: 'Under Construction' | 'Finished';
  progress: number;
  safetyScore: number;
  lastUpdated: string;
  budget?: string;
  type?: string;
  resources: ResourceItem[];
  architecturePlan?: GeneratedArchitecture;
  safetyReports?: SafetyReport[];
}

export interface ResourceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface GeneratedArchitecture {
  costEstimate: string;
  timeline: string;
  materials: string[];
  stages: {
    name: string;
    description: string;
    duration: string;
  }[];
  summary: string;
}

export interface SafetyReport {
  id?: string;
  date?: string;
  riskScore: number; // 0-100
  hazards: {
    description: string;
    severity: 'Low' | 'Medium' | 'High';
    recommendation: string;
  }[];
  summary: string;
}

export interface GeneratedReport {
  date: string;
  executiveSummary: string;
  progressUpdate: string;
  keyIssues: string[];
  recommendations: string[];
}

export enum UserRole {
  ENGINEER = 'Site Engineer',
  MANAGER = 'Project Manager',
}
