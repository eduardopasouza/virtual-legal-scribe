
import type { ToasterToast } from "@/types/toast";

export function notifyExternalSystem(props: ToasterToast) {
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
