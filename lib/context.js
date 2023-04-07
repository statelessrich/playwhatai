import React, { useState } from "react";

const Context = React.createContext();

const Provider = (props) => {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  return (
    <Context.Provider
      value={{
        showError,
        setShowError,
        isLoading,
        setIsLoading,
        heroImage,
        setHeroImage,
        isReady,
        setIsReady,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export { Context, Provider };
