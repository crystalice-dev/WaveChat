import React from 'react';
import { noInternetStyle } from '../../../styles/NoInternetStyle';

function NoInternetView() {
  const handleRetry = () => {
    // Send IPC message to main process to restart the app
    window.electron.restartApp();
  };

  return (
    <div style={noInternetStyle.container}>
      <h1 style={noInternetStyle.text}>No Internet Connection</h1>
      <h1 style={noInternetStyle.subText}>Please check your network connection and try again.</h1>
      <button 
        style={noInternetStyle.retryButton} 
        onClick={()=>handleRetry()}
        onMouseEnter={(e) => e.target.style.backgroundColor = noInternetStyle.retryButtonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = noInternetStyle.retryButton.backgroundColor}
      >
        Retry
      </button>
    </div>
  );
}

export default NoInternetView;
