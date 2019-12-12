import '../../styles/global/layout.scss';
import './app.scss';

import { UserProvider, useUser } from '../providers/user-provider';

import Layout from './pages/layout';
import React from 'react';
import ReactDOM from 'react-dom';

// import { ThemeProvider, useTheme } from '../providers/theme-provider';

const AppContainer = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};

const App = () => {
  const [{ preferences }] = useUser();
  const theme = preferences.darkMode ? 'dark' : 'light';

  return (
    <div className="app-theme-wrapper" data-color-theme={theme}>
      <div className="app-container">
        <Layout />
      </div>
    </div>
  );
};

ReactDOM.render(<AppContainer />, document.querySelector('#root'));
