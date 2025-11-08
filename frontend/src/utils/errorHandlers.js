/**
 * Centralized error handling utilities for mutations and API calls
 */

// Store alert callback globally so it can be set by AlertProvider
let globalShowAlert = null;

/**
 * Set the global alert function (called by AlertProvider)
 * @param {Function} showAlertFn - Function to show alerts
 */
export const setGlobalAlertFunction = (showAlertFn) => {
  globalShowAlert = showAlertFn;
};

/**
 * Extract error message from various error formats
 * @param {Error} error - Error object from axios or other sources
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Axios error with response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error with response error
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Network error
  if (error.message === "Network Error") {
    return "Network error. Please check your connection.";
  }

  // Generic error message
  if (error.message) {
    return error.message;
  }

  // Fallback
  return "Something went wrong. Please try again.";
};

/**
 * Handle mutation errors with consistent formatting and logging
 * @param {Error} error - Error object
 * @param {Function} setError - State setter function for error message
 * @param {string} defaultMessage - Default message if error parsing fails
 * @param {boolean} consoleLog - Whether to log to console (default: true)
 */
export const handleMutationError = (
  error,
  setError,
  defaultMessage = "Operation failed. Please try again.",
  consoleLog = true
) => {
  const message = getErrorMessage(error) || defaultMessage;

  if (consoleLog) {
    console.error("Mutation error:", error);
  }

  if (setError) {
    setError(message);
  }

  return message;
};

/**
 * Show alert for critical errors (like delete failures)
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default message to show
 */
export const showErrorAlert = (
  error,
  defaultMessage = "Action failed. Please try again."
) => {
  const message = getErrorMessage(error) || defaultMessage;

  // Use custom alert if available, fallback to window.alert
  if (globalShowAlert) {
    globalShowAlert(message, "error");
  } else {
    console.warn("No global alert function registered, using window.alert");
    alert(message);
  }
};

/**
 * Generic error handler for React Query onError callbacks
 * Creates a handler function that can be used directly in mutations
 * @param {Function} setError - Optional state setter for error display
 * @param {string} defaultMessage - Default error message
 * @param {Object} options - Additional options
 * @param {boolean} options.alert - Show alert dialog
 * @param {boolean} options.console - Log to console
 * @returns {Function} Error handler function
 */
export const createErrorHandler = (
  setError = null,
  defaultMessage = "Operation failed",
  { alert: showAlert = false, console: logToConsole = true } = {}
) => {
  return (error) => {
    const message = handleMutationError(
      error,
      setError,
      defaultMessage,
      logToConsole
    );

    if (showAlert) {
      // Use custom alert if available, fallback to window.alert
      if (globalShowAlert) {
        globalShowAlert(message, "error");
      } else {
        alert(message);
      }
    }
  };
};
