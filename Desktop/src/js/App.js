import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import SplashView from "./Views/onStart/SplashView";
import NoInternetView from "./Views/onStart/NoInternetView";
import DashboardView from "./Views/Dashboard/DashboardView";
//Paths -- Navigation
import HomePaths from "./Paths/HomePaths";

const App = () => {
  const [isConnected, setIsConnected] = useState(true); // Track internet connection
  const [isSplashFinished, setIsSplashFinished] = useState(false); // Track if splash screen is done

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSplashFinished(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <BrowserRouter>
      {!isSplashFinished ? (
        <SplashView setIsConnected={setIsConnected} />
      ) : (
        <>
          {isConnected ? (
            <DashboardView />
          ) : (
            <NoInternetView />
          )}
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
