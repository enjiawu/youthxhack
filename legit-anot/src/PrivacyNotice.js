import React, { useState } from 'react';

const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="privacy-notice">
        <div className="privacy-notice-content">
          <p className="privacy-text">
            We collect your IP address to improve security and user experience.
          </p>
          <button className="privacy-button" onClick={handleAccept}>I Understand</button>
        </div>
      </div>
    )
  );
};

export default PrivacyNotice;
