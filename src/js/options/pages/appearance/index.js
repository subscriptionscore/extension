import React, { useCallback, useContext } from 'react';

import Colors from './colors';
import { OptionsContext } from '../layout';

const AppearancePage = () => {
  const { state, dispatch } = useContext(OptionsContext);
  const saveSetting = useCallback(
    data => {
      console.log('saving setting', data);
      dispatch({ type: 'save-setting', data });
    },
    [dispatch]
  );
  return (
    <>
      <h1>Appearance</h1>
      <Colors settings={state.settings} onChange={saveSetting} />
    </>
  );
};

export default AppearancePage;
