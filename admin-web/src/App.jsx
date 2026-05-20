import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
