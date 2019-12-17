import React, { createContext, useCallback, useMemo } from 'react';

import Alert from '../components/alerts';
import { useUser } from './user-provider';

export const AlertContext = createContext(null);

const AlertProvider = ({ children }) => {
  const [{ success, error }, dispatch] = useUser();

  const onDismiss = useCallback(() => {
    if (success) {
      dispatch({ type: 'set-success', data: null });
    }
    if (error) {
      dispatch({ type: 'set-error', data: null });
    }
  }, [dispatch, error, success]);

  const content = useMemo(() => {
    if (error) {
      return (
        <Alert onDismiss={onDismiss} error>
          {error}
        </Alert>
      );
    }
    if (success) {
      return (
        <Alert onDismiss={onDismiss} success>
          {success}
        </Alert>
      );
    }
    return null;
  }, [error, success, onDismiss]);

  return (
    <AlertContext.Provider>
      {content}
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
