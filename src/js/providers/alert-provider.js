import React, { createContext, useMemo } from 'react';

import Alert from '../components/alerts';
import { useUser } from './user-provider';

export const AlertContext = createContext(null);

const AlertProvider = ({ children }) => {
  const [{ success, error }, { clearFeedback }] = useUser();

  const content = useMemo(() => {
    if (error) {
      return (
        <Alert onDismiss={clearFeedback} error>
          {error}
        </Alert>
      );
    }
    if (success) {
      return (
        <Alert onDismiss={clearFeedback} success>
          {success}
        </Alert>
      );
    }
    return null;
  }, [error, success, clearFeedback]);

  return (
    <AlertContext.Provider>
      {content}
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
