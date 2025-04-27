
import type { ToasterToast } from "@/types/toast";

export function notifyExternalSystem(props: ToasterToast) {
  if (props.variant === "destructive" || props.variant === "alert") {
    const notificationSystem = (window as any).addNotification;
    if (typeof notificationSystem === "function") {
      const notificationType = props.variant === "destructive" ? "alert" : "info";
      notificationSystem(
        notificationType,
        props.title as string || "Alerta",
        props.description as string || ""
      );
    }
  }
}
