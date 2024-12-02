import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskDashboard from './components/TaskDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/tasks" element={<TaskDashboard />} />
        <Route path="/" element={<Navigate to="/tasks" replace />} /> 
      </Routes>
    </Router>
  );
};

export default App;
