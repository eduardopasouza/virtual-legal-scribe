import * as React from "react";
import type { Toast, ToasterToast } from "@/types/toast";
import { toast } from "sonner";
import { notifyExternalSystem } from "@/services/notification-service";

function useToast() {
  const showToast = (props: Toast) => {
    const toastData: ToasterToast = {
      ...props,
      id: String(Date.now())
    };

    notifyExternalSystem(toastData);
  };

  return {
    toast: showToast,
    toasts: [] // Mantido para compatibilidade com a API existente
  };
}

export { useToast, toast };
