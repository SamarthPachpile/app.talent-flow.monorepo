import Swal from "sweetalert2";
import type {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
  SweetAlertPosition,
} from "sweetalert2";
import "./sweetalert.css";

export type { SweetAlertIcon, SweetAlertOptions, SweetAlertResult, SweetAlertPosition };
export { Swal };

export interface ToastCustomOptions {
  id?: string | number;
  description?: string;
  duration?: number;
  position?: SweetAlertPosition;
  showCloseButton?: boolean;
  icon?: SweetAlertIcon;
  timerProgressBar?: boolean;
  [key: string]: unknown;
}

/**
 * Base SweetAlert2 Toast configuration mixin
 */
export const SweetToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  showCloseButton: true,
  didOpen: (toastEl) => {
    toastEl.onmouseenter = Swal.stopTimer;
    toastEl.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: "talentflow-sweet-toast-popup",
    title: "talentflow-sweet-toast-title",
    htmlContainer: "talentflow-sweet-toast-html",
    timerProgressBar: "talentflow-sweet-progress",
    closeButton: "talentflow-sweet-toast-close",
  },
});

/**
 * Base SweetAlert2 Modal / Dialog configuration mixin
 */
export const SweetAlertModal = Swal.mixin({
  customClass: {
    popup: "talentflow-sweet-modal-popup",
    title: "talentflow-sweet-modal-title",
    htmlContainer: "talentflow-sweet-modal-html",
    confirmButton: "talentflow-sweet-confirm-btn",
    cancelButton: "talentflow-sweet-cancel-btn",
    denyButton: "talentflow-sweet-deny-btn",
  },
  buttonsStyling: false,
});

/**
 * Build toast options helper
 */
function getToastConfig(
  message: string,
  icon?: SweetAlertIcon,
  options?: ToastCustomOptions,
): SweetAlertOptions {
  const config: SweetAlertOptions = {
    title: message,
    icon,
    timer: options?.duration ?? 3500,
    timerProgressBar: options?.timerProgressBar ?? true,
    position: options?.position ?? "top-end",
    showCloseButton: options?.showCloseButton ?? true,
  };
  if (options?.description) {
    config.html = `<div class="talentflow-sweet-toast-desc">${options.description}</div>`;
  }
  return config;
}

/**
 * Toast Notification callable interface
 */
export interface ToastCallable {
  (message: string, options?: ToastCustomOptions): Promise<SweetAlertResult>;
  success: (message: string, options?: ToastCustomOptions) => Promise<SweetAlertResult>;
  error: (message: string, options?: ToastCustomOptions) => Promise<SweetAlertResult>;
  info: (message: string, options?: ToastCustomOptions) => Promise<SweetAlertResult>;
  warning: (message: string, options?: ToastCustomOptions) => Promise<SweetAlertResult>;
  loading: (message: string, options?: ToastCustomOptions) => Promise<SweetAlertResult>;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
  ) => Promise<T>;
  dismiss: () => void;
  close: () => void;
  custom: (options: SweetAlertOptions) => Promise<SweetAlertResult>;
}

const toastImplementation = function (message: string, options?: ToastCustomOptions) {
  return SweetToast.fire(getToastConfig(message, undefined, options));
};

export const toast: ToastCallable = Object.assign(toastImplementation, {
  success(message: string, options?: ToastCustomOptions) {
    return SweetToast.fire(getToastConfig(message, "success", options));
  },
  error(message: string, options?: ToastCustomOptions) {
    return SweetToast.fire(getToastConfig(message, "error", options));
  },
  info(message: string, options?: ToastCustomOptions) {
    return SweetToast.fire(getToastConfig(message, "info", options));
  },
  warning(message: string, options?: ToastCustomOptions) {
    return SweetToast.fire(getToastConfig(message, "warning", options));
  },
  loading(message: string, options?: ToastCustomOptions) {
    return SweetToast.fire({
      ...getToastConfig(message, undefined, options),
      showConfirmButton: false,
      timerProgressBar: false,
      timer: undefined,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },
  async promise<T>(
    promiseOrFn: Promise<T> | (() => Promise<T>),
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
  ): Promise<T> {
    toast.loading(data.loading);
    try {
      const promise = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;
      const result = await promise;
      const successMsg = typeof data.success === "function" ? data.success(result) : data.success;
      toast.success(successMsg);
      return result;
    } catch (err) {
      const errorMsg = typeof data.error === "function" ? data.error(err) : data.error;
      toast.error(errorMsg);
      throw err;
    }
  },
  dismiss() {
    Swal.close();
  },
  close() {
    Swal.close();
  },
  custom(options: SweetAlertOptions) {
    return SweetToast.fire(options);
  },
});

export const showToast = toast;
export const sweetToast = toast;

/**
 * Modal Alert Notification utilities
 */
export const notify = {
  toast,
  alert: (options: SweetAlertOptions) => SweetAlertModal.fire(options),
  success: (title: string, text?: string, confirmButtonText = "OK") =>
    SweetAlertModal.fire({
      icon: "success",
      title,
      text,
      confirmButtonText,
    }),
  error: (title: string, text?: string, confirmButtonText = "Close") =>
    SweetAlertModal.fire({
      icon: "error",
      title,
      text,
      confirmButtonText,
    }),
  warning: (title: string, text?: string, confirmButtonText = "Understood") =>
    SweetAlertModal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonText,
    }),
  info: (title: string, text?: string, confirmButtonText = "OK") =>
    SweetAlertModal.fire({
      icon: "info",
      title,
      text,
      confirmButtonText,
    }),
  confirm: async (options: {
    title: string;
    text?: string;
    icon?: SweetAlertIcon;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDestructive?: boolean;
    html?: string;
  }): Promise<boolean> => {
    const result = await SweetAlertModal.fire({
      icon: options.icon || (options.isDestructive ? "warning" : "question"),
      title: options.title,
      text: options.text,
      html: options.html,
      showCancelButton: true,
      confirmButtonText:
        options.confirmButtonText || (options.isDestructive ? "Delete" : "Confirm"),
      cancelButtonText: options.cancelButtonText || "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: options.isDestructive
          ? "talentflow-sweet-deny-btn"
          : "talentflow-sweet-confirm-btn",
        cancelButton: "talentflow-sweet-cancel-btn",
      },
    });
    return result.isConfirmed;
  },
  prompt: async (options: {
    title: string;
    text?: string;
    inputPlaceholder?: string;
    defaultValue?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<string | null> => {
    const result = await SweetAlertModal.fire({
      title: options.title,
      text: options.text,
      input: "text",
      inputValue: options.defaultValue || "",
      inputPlaceholder: options.inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || "Submit",
      cancelButtonText: options.cancelButtonText || "Cancel",
    });
    if (result.isConfirmed && typeof result.value === "string") {
      return result.value;
    }
    return null;
  },
  loading: (title = "Please wait...", text?: string) => {
    SweetAlertModal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },
  close: () => {
    Swal.close();
  },
};

export const sweetAlert = notify;
export const showSweetAlert = notify;

export default notify;
