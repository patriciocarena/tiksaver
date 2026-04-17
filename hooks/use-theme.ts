import React from "react";
import { ThemeContext } from "@/components/theme-provider";

export function useTheme() {
  return React.use(ThemeContext);
}
