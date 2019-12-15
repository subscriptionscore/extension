import React, { createContext, useMemo } from 'react';

import Alert from '../components/alerts';
import { useUser } from './user-provider';

export const AlertContext = createContext(null);

const AlertProvider = ({ children }) => {
  const [{ error }] = useUser();

  const content = useMemo(() => {
    if (!error) return null;
    return <Alert error>{error}</Alert>;
  }, [error]);

  return (
    <AlertContext.Provider>
      {content}
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
