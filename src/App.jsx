/**
 * App Component
 * Main application with routing
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import CallPage from './components/pages/CallPage';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/call/:roomId" element={<CallPage />} />
      </Routes>
    </Router>
  );
}
