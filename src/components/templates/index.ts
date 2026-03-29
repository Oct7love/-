export { MinimalTemplate } from "./minimal-template";
export { TechTemplate } from "./tech-template";
export { BusinessTemplate } from "./business-template";
export { CreativeTemplate } from "./creative-template";

export const TEMPLATE_MAP = {
  "minimal-clean": "MinimalTemplate",
  "tech-minimal": "TechTemplate",
  "business-classic": "BusinessTemplate",
  "creative-design": "CreativeTemplate",
} as const;

export type TemplateId = keyof typeof TEMPLATE_MAP;
