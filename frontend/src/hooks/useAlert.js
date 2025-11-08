import { useState, useCallback } from "react";

export function useAlert() {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message, type = "error") => {
    setAlert({ message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
}
