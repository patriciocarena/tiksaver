import React from "react";
import { ToastContext } from "@/components/toast-provider";

export function useToast() {
  return React.use(ToastContext);
}
