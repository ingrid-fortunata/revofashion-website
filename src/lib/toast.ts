import { toast } from "sonner";

/**
 * Standardized Toast notification helpers using ShadCN Sonner.
 */
export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 3500,
    });
  },

  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 4500,
    });
  },

  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3500,
    });
  },

  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 4000,
    });
  },
};

export { toast };
export default toast;
