import toast from "react-hot-toast";

/**
 * Standardized Toast notification helpers using react-hot-toast.
 */
export const showToast = {
  success: (message: string) => {
    return toast.success(message, {
      duration: 3500,
      position: "top-right",
      style: {
        background: "#18181b",
        color: "#fafafa",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #27272a",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#18181b",
      },
    });
  },

  error: (message: string) => {
    return toast.error(message, {
      duration: 4500,
      position: "top-right",
      style: {
        background: "#18181b",
        color: "#fafafa",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #7f1d1d",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#18181b",
      },
    });
  },

  info: (message: string) => {
    return toast(message, {
      duration: 3500,
      position: "top-right",
      icon: "ℹ️",
      style: {
        background: "#18181b",
        color: "#fafafa",
        fontSize: "14px",
        borderRadius: "8px",
        border: "1px solid #27272a",
      },
    });
  },
};
