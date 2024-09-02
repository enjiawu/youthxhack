import React, { useState } from 'react';
import { useIp } from './IpContext'; // Import the context hook

const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { setIpAddress } = useIp(); // Get the setter function from context

  const getIPAddress = async () => {
    try {
        const response = await fetch('http://localhost:5050/api/ip-address');

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();
        setIpAddress(data.ip); // Use the context setter to store the IP address
        console.log('Fetched IP address successfully:', data.ip);
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
  };

  const handleAccept = () => {
    setIsVisible(false);
    getIPAddress();
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
