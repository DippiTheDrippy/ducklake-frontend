// src/contexts/NotificationProvider.tsx

import {
  SnackbarProvider,
  useSnackbar,
  closeSnackbar as closeNotistackSnackbar,
  type OptionsObject,
  type SnackbarKey,
  type VariantType,
} from "notistack";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import Button from "@mui/material/Button";

type NotifyOptions = Omit<OptionsObject, "variant"> & {
  variant?: VariantType;
};

type NotificationContextValue = {
  notify: (message: string, options?: NotifyOptions) => SnackbarKey;
  success: (message: string, options?: NotifyOptions) => SnackbarKey;
  error: (message: string, options?: NotifyOptions) => SnackbarKey;
  warning: (message: string, options?: NotifyOptions) => SnackbarKey;
  info: (message: string, options?: NotifyOptions) => SnackbarKey;
  close: (key?: SnackbarKey) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

let externalNotificationApi: NotificationContextValue | null = null;

function NotificationBridge({ children }: { children: ReactNode }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notify = useCallback(
    (message: string, options?: NotifyOptions) => {
      return enqueueSnackbar(message, options);
    },
    [enqueueSnackbar],
  );

  const api = useMemo<NotificationContextValue>(
    () => ({
      notify,

      success: (message, options) =>
        notify(message, {
          ...options,
          variant: "success",
        }),

      error: (message, options) =>
        notify(message, {
          autoHideDuration: 6000,
          ...options,
          variant: "error",
        }),

      warning: (message, options) =>
        notify(message, {
          ...options,
          variant: "warning",
        }),

      info: (message, options) =>
        notify(message, {
          ...options,
          variant: "info",
        }),

      close: closeSnackbar,
    }),
    [notify, closeSnackbar],
  );

  useEffect(() => {
    externalNotificationApi = api;

    return () => {
      externalNotificationApi = null;
    };
  }, [api]);

  return (
    <NotificationContext.Provider value={api}>
      {children}
    </NotificationContext.Provider>
  );
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={4}
      preventDuplicate
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      action={(snackbarId) => (
        <Button
          color="inherit"
          size="small"
          onClick={() => closeNotistackSnackbar(snackbarId)}
        >
          Dismiss
        </Button>
      )}
    >
      <NotificationBridge>{children}</NotificationBridge>
    </SnackbarProvider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
}

/**
 * Use this outside React components, for example in API clients,
 * services, interceptors, or utility files.
 */
export const notification = {
  notify(message: string, options?: NotifyOptions) {
    return externalNotificationApi?.notify(message, options);
  },

  success(message: string, options?: NotifyOptions) {
    return externalNotificationApi?.success(message, options);
  },

  error(message: string, options?: NotifyOptions) {
    return externalNotificationApi?.error(message, options);
  },

  warning(message: string, options?: NotifyOptions) {
    return externalNotificationApi?.warning(message, options);
  },

  info(message: string, options?: NotifyOptions) {
    return externalNotificationApi?.info(message, options);
  },

  close(key?: SnackbarKey) {
    externalNotificationApi?.close(key);
  },
};
