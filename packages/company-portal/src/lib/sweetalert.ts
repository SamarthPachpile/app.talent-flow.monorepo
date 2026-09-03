import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export interface ToastCustomOptions {
  id?: string | number;
  title?: string;
  description?: string;
  duration?: number;
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | "top" | "bottom" | "center";
  [key: string]: unknown;
}

export const SweetToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toastEl) => {
    toastEl.addEventListener("mouseenter", Swal.stopTimer);
    toastEl.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const SweetAlertModal = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary",
    cancelButton: "btn btn-outline",
  },
  buttonsStyling: false,
});

export function showToast(
  title: string,
  icon: SweetAlertIcon = "success",
  options?: ToastCustomOptions,
) {
  return SweetToast.fire({
    icon,
    title: title || options?.title || "",
    text: options?.description,
    timer: options?.duration || 3000,
    position: options?.position || "top-end",
  });
}

export function showSweetAlert(options: SweetAlertOptions) {
  return Swal.fire(options);
}

export const toast = Object.assign(
  (title: string, options?: ToastCustomOptions) => showToast(title, "info", options),
  {
    success: (title: string, options?: ToastCustomOptions) => showToast(title, "success", options),
    error: (title: string, options?: ToastCustomOptions) => showToast(title, "error", options),
    warning: (title: string, options?: ToastCustomOptions) => showToast(title, "warning", options),
    info: (title: string, options?: ToastCustomOptions) => showToast(title, "info", options),
    loading: (title: string, options?: ToastCustomOptions) =>
      showToast(title, "info", { ...options, duration: 60000 }),
    dismiss: (_id?: string | number) => Swal.close(),
  },
);

export const notify = {
  success: (title: string, message?: string) =>
    showToast(title, "success", { description: message }),
  error: (title: string, message?: string) => showToast(title, "error", { description: message }),
  warning: (title: string, message?: string) =>
    showToast(title, "warning", { description: message }),
  info: (title: string, message?: string) => showToast(title, "info", { description: message }),
  loading: (title: string, message?: string) =>
    showToast(title, "info", { description: message, duration: 60000 }),
  dismiss: (_id?: string | number) => Swal.close(),
};

export const sweetAlert = {
  fire: (options: SweetAlertOptions) => Swal.fire(options),
  confirm: async (title: string, text: string, confirmButtonText = "Confirm"): Promise<boolean> => {
    const res = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: "Cancel",
    });
    return Boolean(res.isConfirmed);
  },
};

export { Swal };
export type { SweetAlertIcon, SweetAlertOptions, SweetAlertResult };
export default notify;
