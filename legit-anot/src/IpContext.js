import React, { createContext, useState, useContext } from 'react';

// Create a context with default values
const IpContext = createContext();

export const IpProvider = ({ children }) => {
    const [ipAddress, setIpAddress] = useState('');

    return (
        <IpContext.Provider value={{ ipAddress, setIpAddress }}>
            {children}
        </IpContext.Provider>
    );
};

export const useIp = () => useContext(IpContext);
