export interface Workspace {
  _id: string;
  userId: string;
  name: string;
  location: string;
  stage: string;
  type: string;
  budget: string;
  status: 'Under Construction' | 'Finished';
  progress: number;
  safetyScore: number;
  lastUpdated: Date;
  resources: ResourceItem[];
  architecturePlan?: ArchitecturePlan;
  safetyReports: SafetyReport[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface ArchitectureSection {
  title: string;
  description: string;
}

export interface ArchitectureMaterial {
  name: string;
  quantity: string;
  specification: string;
}

export interface ArchitectureStage {
  phase: string;
  duration: string;
  tasks: string[];
}

export interface ArchitecturePlan {
  sections: ArchitectureSection[];
  materials: ArchitectureMaterial[];
  stages: ArchitectureStage[];
  summary: string;
  createdAt?: Date;
}

export interface GeneratedArchitecture extends ArchitecturePlan {}

export interface SafetyReport {
  id?: string;
  date?: string;
  riskScore: number;
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
