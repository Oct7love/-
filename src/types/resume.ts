export interface PersonalInfo {
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  links?: { type: string; url: string }[];
  avatar?: string | null;
  summary?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights: string[];
  techStack: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: { name: string; level: string }[];
  certifications: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: { title: string; description: string }[];
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skills;
  customSections: CustomSection[];
  sectionOrder: string[];
}

export type ResumeStatus = "draft" | "completed" | "archived";
export type DiagnosisSeverity = "critical" | "warning" | "info";
export type RewriteStyle = "professional" | "concise" | "creative";

export interface DiagnosisDimension {
  score: number;
  maxScore: number;
  level: "good" | "warning" | "critical";
  feedback: string;
}

export interface DiagnosisResult {
  totalScore: number;
  dimensions: {
    completeness: DiagnosisDimension;
    contentQuality: DiagnosisDimension;
    keywords: DiagnosisDimension;
    formatting: DiagnosisDimension;
    impression: DiagnosisDimension;
  };
  overallSummary: string;
}

export interface DiagnosisItem {
  id: string;
  section: string;
  fieldPath: string;
  severity: DiagnosisSeverity;
  category: string;
  originalText: string;
  suggestion: string;
  rewrittenText?: string;
  isAdopted: boolean;
}
