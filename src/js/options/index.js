import '../../styles/global/layout.scss';
import './app.scss';

import { UserProvider, useUser } from '../providers/user-provider';

import Layout from './pages/layout';
import React from 'react';
import ReactDOM from 'react-dom';

const AppContainer = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};

const App = () => {
  const [{ user }] = useUser();
  const theme = user.preferences.darkMode ? 'dark' : 'light';

  return (
    <div className="app-theme-wrapper" data-color-theme={theme}>
      <div className="app-container">
        <Layout />
      </div>
    </div>
  );
};

ReactDOM.render(<AppContainer />, document.querySelector('#root'));
