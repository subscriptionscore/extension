import '../../styles/global/layout.scss';

import Layout from './pages/layout';
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return <Layout />;
};

ReactDOM.render(<App />, document.querySelector('#root'));
