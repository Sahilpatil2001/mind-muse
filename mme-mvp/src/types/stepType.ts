// types.ts
export interface Option {
  label: string;
  value: string;
}

export interface Step {
  stepNumber: number;
  stepTitle: string;
  question: string;
  type: "radio" | "textarea" | "multi-select" | "select";
  isRequired: boolean;
  info?: string;
  options?: Option[];
}
