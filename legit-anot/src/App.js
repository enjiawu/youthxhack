import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import LinkAuthentication from './LinkAuthentication';
import LinkSafe from './LinkSafe';
import Info from './Info';
import PrivacyNotice from './PrivacyNotice';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Menu />
        <PrivacyNotice />
        <div>
          <Routes>
            <Route path="/" element={<LinkAuthentication />} />
            {/* Add more routes as needed */}
            <Route path="/link-safe" element={<LinkSafe />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
