
import type { ToasterToast } from "@/types/toast";
import { toast } from "sonner";

export function notifyExternalSystem(props: ToasterToast) {
  // Mapeamento de variantes para tipos de notificação
  const variantToType = {
    default: "info",
    destructive: "error"
  } as const;

  // Usar sonner para todas as notificações
  const type = props.variant ? variantToType[props.variant] : "info";
  
  toast[type](props.title as string, {
    description: props.description as string,
  });

  // Se for um alerta destrutivo, notificar sistema externo também
  if (props.variant === "destructive") {
    const notificationSystem = (window as any).addNotification;
    if (typeof notificationSystem === "function") {
      notificationSystem(
        "alert",
        props.title as string || "Alerta",
        props.description as string || ""
      );
    }
  }
}

