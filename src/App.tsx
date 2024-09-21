import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppRoutes from './Routes';

const App: React.FC = () => (
  <Router>
    <AppRoutes /> 
  </Router>
);

export default App;
