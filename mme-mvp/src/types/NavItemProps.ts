import type { ReactNode } from "react";

export interface NavItemProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  to?: string;
  onClick?: () => void;
}
