import { useState, useCallback, useEffect } from "react";
import { AlertContext } from "./AlertContext";
import Alert from "../components/Alert";
import { setGlobalAlertFunction } from "../utils/errorHandlers";

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message, type = "error") => {
    setAlert({ message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  // Register the showAlert function globally for errorHandlers
  useEffect(() => {
    setGlobalAlertFunction(showAlert);
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
          duration={5000}
        />
      )}
    </AlertContext.Provider>
  );
}
