
import * as React from "react";
import type { Toast, ToasterToast } from "@/types/toast";
import { dispatch, subscribe, genId, getState } from "@/store/toast-store";
import { notifyExternalSystem } from "@/services/notification-service";

function toast({ ...props }: Toast) {
  const id = genId();

  // Integrate with external notification system
  notifyExternalSystem({ ...props, id });

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState(getState());

  React.useEffect(() => {
    return subscribe(setState);
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
