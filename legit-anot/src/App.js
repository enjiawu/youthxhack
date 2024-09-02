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
import { IpProvider } from './IpContext';
import { LinkProvider } from './LinkContext'; // Import the LinkProvider

function App() {
  return (
    <IpProvider>
      <LinkProvider> {/* Wrap with LinkProvider */}
        <Router>
          <div>
            <Header />
            <Menu />
            <PrivacyNotice />
            <div>
              <Routes>
                <Route path="/" element={<LinkAuthentication />} />
                <Route path="/link-safe" element={<LinkSafe />} />
                <Route path="/info" element={<Info />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </LinkProvider>
    </IpProvider>
  );
}

export default App;
