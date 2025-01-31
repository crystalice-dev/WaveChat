import React from 'react';

export const splashStyle = {
  container: {
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#0e212f', // Full red background
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    width: '100vw', // Full viewport width
    margin: 0,
    padding: 0,
    overflow: 'hidden', // Prevent scrolling
  },
  headText: {
    fontSize: 100, // Large font size
    color: 'white', // Optional: Add a contrasting text color
  },
};

function SplashView() {
  return (
    <div style={splashStyle.container}>
      <h1 style={splashStyle.headText}>Hello World</h1>
    </div>
  );
}

export default SplashView;
