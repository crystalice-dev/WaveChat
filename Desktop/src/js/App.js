import React, { useState, useEffect } from "react";
import SplashView from "./Views/onStart/SplashView";
import NoInternetView from "./Views/onStart/NoInternetView";
import TopBar from "./TopBar";

import { splashStyle } from "../styles/SplashStyle";

const App = () => {
  const [isConnected, setIsConnected] = useState(true); // Track internet connection
  const [isSplashFinished, setIsSplashFinished] = useState(false); // Track if splash screen is done

  useEffect(() => {
    // Set timeout for splash screen display (for example, 3 seconds)
    const timeout = setTimeout(() => {
      setIsSplashFinished(true); // After 3.5 seconds, finish splash screen
    }, 3500); // Adjust this value based on your animation duration

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <TopBar /> 
      
      {!isSplashFinished ? (
        <SplashView setIsConnected={setIsConnected} />
      ) : (
        <>
          {isConnected ? (
            // Main app content goes here (if connected)
            <div>App content goes here!</div>
          ) : (
            <NoInternetView />
          )}
        </>
      )}
    </div>
  );
};

export default App;
