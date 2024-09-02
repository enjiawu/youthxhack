import React, { createContext, useState } from 'react';

// Create the Link Context
export const LinkContext = createContext();

// LinkProvider component to provide context values
export const LinkProvider = ({ children }) => {
  const [link, setLink] = useState('');

  return (
    <LinkContext.Provider value={{ link, setLink }}>
      {children}
    </LinkContext.Provider>
  );
};

// Higher-order component to use Link context
export const withLink = (WrappedComponent) => {
  return (props) => (
    <LinkContext.Consumer>
      {({ setLink }) => <WrappedComponent {...props} setLink={setLink} />}
    </LinkContext.Consumer>
  );
};
