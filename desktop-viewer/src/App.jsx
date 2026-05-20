import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Viewer from './components/Viewer';
import './index.css';

// Using HashRouter for Electron compatibility
function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view/:id" element={<Viewer />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
