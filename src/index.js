import React from 'react';
import ReactDOM from 'react-dom';
import './global.scss';
import MainPage from './components/main'
const Index = () => {
  return <div><MainPage /></div>;
};
ReactDOM.render(<Index />, document.getElementById('root'));