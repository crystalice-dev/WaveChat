import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { splashStyle } from '../../../styles/SplashStyle';

function SplashView({ setIsConnected }) {
  const [startTransition, setStartTransition] = useState(false);
  const bgControls = useAnimation();
  const textControls = useAnimation();

  // Check if the device is connected to the internet
  const checkInternetConnection = () => {
    if (navigator.onLine) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Check internet connection after initial animation
    setTimeout(() => {
      checkInternetConnection();
    }, 2000); // After the animation has time to complete 

    const timeout = setTimeout(() => {
      setStartTransition(true);
    }, 1600); // Trigger transition after scaling animation ends

    return () => clearTimeout(timeout);
  }, [setIsConnected]);

  useEffect(() => {
    if (startTransition) {
      // Animate background color to white
      bgControls.start({ backgroundColor: '#ffffff', transition: { duration: 2 } });

      // Animate text color to the original background color (#0e212f)
      textControls.start({ color: '#0e212f', transition: { duration: 2 } });
    }
  }, [startTransition]);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <motion.div
        style={splashStyle.container}
        animate={bgControls} // Animate background
      >
        <motion.h1
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={splashStyle.headText}
        >
          <motion.span animate={textControls}>WaveChat</motion.span>
        </motion.h1>

        <div style={splashStyle.spinner}></div>

        <h5 style={splashStyle.footerText}>A Crystal Ice Product</h5>
      </motion.div>
    </>
  );
}

export default SplashView;
