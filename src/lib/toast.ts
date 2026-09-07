import { toast } from "sonner";
import { translateApiError, ErrorTranslation } from "@/lib/api/error-codes";

/**
 * Standardized Toast notification helpers using ShadCN Sonner.
 * Automatically translates backend error codes into human-readable messages.
 */
export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 3500,
    });
  },

  /**
   * Displays an error toast.
   * If passed an error object (ApiError, Error), it automatically translates the
   * backend error_code into a human-friendly title and description.
   *
   * Example:
   *   showToast.error(err); // Auto translates USER_UNAUTHORIZED -> Title: "Login Failed", Description: "Invalid email/username or password."
   *   showToast.error("Custom title", "Custom description");
   */
  error: (error: unknown, fallbackDescription?: string) => {
    if (typeof error === "string") {
      return toast.error(error, {
        description: fallbackDescription,
        duration: 4500,
      });
    }

    const { title, description }: ErrorTranslation = translateApiError(error);
    return toast.error(title, {
      description: fallbackDescription || description,
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

export { toast, translateApiError };
export default toast;
