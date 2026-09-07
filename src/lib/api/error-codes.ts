import { ApiError } from "@/types/api";

export interface ErrorTranslation {
  title: string;
  description: string;
}

/**
 * Human-friendly title and description mappings for all backend API error codes.
 * Sourced from /docs/guideline/error_codes.md.
 */
export const ERROR_CODE_TRANSLATIONS: Record<string, ErrorTranslation> = {
  // === 1. Global & Framework Error Codes ===
  BAD_REQUEST: {
    title: "Invalid Request",
    description: "The request payload was invalid or improperly formatted.",
  },
  NOT_FOUND: {
    title: "Not Found",
    description: "The requested endpoint or resource could not be found.",
  },
  METHOD_NOT_ALLOWED: {
    title: "Action Not Allowed",
    description: "The requested action is not supported for this resource.",
  },
  VALIDATION_ERROR: {
    title: "Validation Error",
    description: "Please check the highlighted fields and ensure all inputs are valid.",
  },
  INTERNAL_SERVER_ERROR: {
    title: "Server Error",
    description: "An unexpected error occurred on the server. Please try again later.",
  },
  TOKEN_MISSING: {
    title: "Authentication Required",
    description: "Please log in to continue.",
  },
  TOKEN_INVALID: {
    title: "Invalid Session",
    description: "Your session is invalid. Please log in again.",
  },
  TOKEN_EXPIRED: {
    title: "Session Expired",
    description: "Your session has expired. Please log in again to continue.",
  },

  // === 2. Auth & RBAC Authorization ===
  UNAUTHORIZED: {
    title: "Unauthorized",
    description: "You must be signed in to perform this action.",
  },
  FORBIDDEN: {
    title: "Access Denied",
    description: "You do not have permission to access or perform this action.",
  },

  // === 3. Users & Authentication ===
  USER_UNAUTHORIZED: {
    title: "Login Failed",
    description: "Invalid email/username or password.",
  },
  USER_EMAIL_CONFLICT: {
    title: "Email Already Registered",
    description: "An account with this email address already exists. Please log in instead.",
  },
  USER_NAME_CONFLICT: {
    title: "Username Taken",
    description: "This username is already taken. Please choose a different one.",
  },
  USER_CONFLICT: {
    title: "Account Already Exists",
    description: "A user with this username or email already exists.",
  },
  USER_NOT_FOUND: {
    title: "User Not Found",
    description: "The requested user account was not found.",
  },
  USER_FORBIDDEN: {
    title: "Access Restricted",
    description: "You do not have permission to view or modify this user profile.",
  },
  USER_DEACTIVATED: {
    title: "Account Deactivated",
    description: "This account has been deactivated. Please contact support.",
  },
  USER_DATABASE_ERROR: {
    title: "Account Error",
    description: "Failed to save user account information due to a database error.",
  },

  // === 4. Categories ===
  CATEGORY_CONFLICT: {
    title: "Category Conflict",
    description: "Category name already exists, or it cannot be deleted because it still contains active products.",
  },
  CATEGORY_NOT_FOUND: {
    title: "Category Not Found",
    description: "The requested category could not be found.",
  },
  CATEGORY_DATABASE_ERROR: {
    title: "Category Error",
    description: "Failed to update category due to a database error.",
  },

  // === 5. Products ===
  PRODUCT_NOT_FOUND: {
    title: "Product Not Found",
    description: "This product is no longer available or does not exist.",
  },
  CATEGORY_INACTIVE: {
    title: "Inactive Category",
    description: "Products cannot be assigned to an inactive category.",
  },
  PRODUCT_CONFLICT: {
    title: "Cannot Delete Product",
    description: "This product cannot be removed because it is linked to active customer orders.",
  },
  PRODUCT_DATABASE_ERROR: {
    title: "Product Error",
    description: "Failed to update product due to a database error.",
  },

  // === 6. Orders ===
  PRODUCT_PRICE_VALIDATION_ERROR: {
    title: "Price Validation Error",
    description: "The product price is invalid or has changed. Please refresh the page.",
  },
  PRODUCT_STOCK_VALIDATION_ERROR: {
    title: "Insufficient Stock",
    description: "One or more items in your cart do not have enough stock available.",
  },
  ORDER_NOT_FOUND: {
    title: "Order Not Found",
    description: "The specified order could not be located.",
  },
  ORDER_STATUS_NO_CHANGE: {
    title: "No Status Change",
    description: "The order is already in the requested status.",
  },
  ORDER_INVALID_TRANSITION: {
    title: "Invalid Status Update",
    description: "This order cannot transition to the selected status.",
  },
  ORDER_FORBIDDEN_TRANSITION: {
    title: "Permission Denied",
    description: "Only administrators are authorized to make this order status change.",
  },
  ORDER_CANNOT_BE_CANCELLED: {
    title: "Cannot Cancel Order",
    description: "This order cannot be cancelled because it is already being processed or delivered.",
  },
  ORDER_DATABASE_ERROR: {
    title: "Order Processing Error",
    description: "A database error occurred while processing your order.",
  },

  // === 7. Client & Network ===
  NETWORK_ERROR: {
    title: "Connection Failed",
    description: "Unable to reach the server. Please check your internet connection.",
  },
};

/**
 * Translates any error (ApiError, Error, or string) into user-friendly title and description.
 */
export function translateApiError(error: unknown): ErrorTranslation {
  if (error instanceof ApiError) {
    // 1. HTTP 422 Validation Error: extract first field description if available
    if (error.errorCode === "VALIDATION_ERROR" && error.details?.json) {
      const jsonErrors = error.details.json as Record<string, string[]>;
      const firstField = Object.keys(jsonErrors)[0];
      if (firstField && jsonErrors[firstField]?.length > 0) {
        const fieldName = firstField.replace(/_/g, " ");
        const formattedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return {
          title: "Validation Error",
          description: `${formattedField}: ${jsonErrors[firstField][0]}`,
        };
      }
    }

    // 2. Direct dictionary match by error_code
    if (ERROR_CODE_TRANSLATIONS[error.errorCode]) {
      return ERROR_CODE_TRANSLATIONS[error.errorCode];
    }

    // 3. Fallback for any database errors (*_DATABASE_ERROR)
    if (error.errorCode.endsWith("_DATABASE_ERROR")) {
      return {
        title: "Database Error",
        description: "A database error occurred while processing your request. Please try again.",
      };
    }

    // 4. HTTP status fallback
    if (error.status === 401) {
      return {
        title: "Session Expired",
        description: "Please log in again to continue.",
      };
    }
    if (error.status === 403) {
      return {
        title: "Access Denied",
        description: "You do not have permission to perform this action.",
      };
    }
    if (error.status === 404) {
      return {
        title: "Not Found",
        description: "The requested item or page could not be found.",
      };
    }
    if (error.status >= 500) {
      return {
        title: "Server Unavailable",
        description: "Our servers are experiencing issues. Please try again shortly.",
      };
    }

    // 5. Fallback to API message if provided
    return {
      title: "Request Failed",
      description: error.message || "An unexpected error occurred.",
    };
  }

  // Standard JavaScript Error
  if (error instanceof Error) {
    return {
      title: "Error",
      description: error.message,
    };
  }

  // Raw string error
  if (typeof error === "string") {
    return {
      title: "Error",
      description: error,
    };
  }

  return {
    title: "Unexpected Error",
    description: "An unexpected error occurred. Please try again.",
  };
}
