import { create } from "zustand";
import type { ResumeContent, DiagnosisResult, DiagnosisItem } from "@/types/resume";

interface EditorState {
  resumeId: string | null;
  content: ResumeContent | null;
  isDirty: boolean;
  isSaving: boolean;
  activeSection: string;

  diagnosis: DiagnosisResult | null;
  diagnosisItems: DiagnosisItem[];
  isDiagnosing: boolean;

  isRewriting: boolean;
  rewriteTarget: { section: string; index: number; field: string } | null;

  setResumeId: (id: string) => void;
  setContent: (content: ResumeContent) => void;
  updateContent: (partial: Partial<ResumeContent>) => void;
  setActiveSection: (section: string) => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;

  setDiagnosis: (result: DiagnosisResult) => void;
  setDiagnosisItems: (items: DiagnosisItem[]) => void;
  setDiagnosing: (diagnosing: boolean) => void;

  setRewriting: (rewriting: boolean) => void;
  setRewriteTarget: (target: EditorState["rewriteTarget"]) => void;

  reset: () => void;
}

const initialState = {
  resumeId: null,
  content: null,
  isDirty: false,
  isSaving: false,
  activeSection: "personalInfo",
  diagnosis: null,
  diagnosisItems: [],
  isDiagnosing: false,
  isRewriting: false,
  rewriteTarget: null,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,

  setResumeId: (id) => set({ resumeId: id }),
  setContent: (content) => set({ content, isDirty: false }),
  updateContent: (partial) =>
    set((state) => ({
      content: state.content ? { ...state.content, ...partial } : null,
      isDirty: true,
    })),
  setActiveSection: (section) => set({ activeSection: section }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setSaving: (saving) => set({ isSaving: saving }),

  setDiagnosis: (result) => set({ diagnosis: result }),
  setDiagnosisItems: (items) => set({ diagnosisItems: items }),
  setDiagnosing: (diagnosing) => set({ isDiagnosing: diagnosing }),

  setRewriting: (rewriting) => set({ isRewriting: rewriting }),
  setRewriteTarget: (target) => set({ rewriteTarget: target }),

  reset: () => set(initialState),
}));
