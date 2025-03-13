export const noInternetStyle = {
    container: {
      display: 'flex',
      flexDirection: 'column', // Stack elements vertically
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0e212f', // Match the background color of previous screens
      color: 'white', // Text color
      margin: 0,
      padding: 0,
      textAlign: 'center', // Center the text horizontally
    },
    text: {
      fontSize: '36px', // Slightly smaller text
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: '1.5px', // Slightly adjusted letter spacing for readability
      margin: '10px 0', // Add space between the text lines
    },
    subText: {
      fontSize: '24px', // Smaller text for the subtext
      fontWeight: 'normal',
      textAlign: 'center',
      letterSpacing: '1.2px',
      margin: '10px 0', // Space between subtext lines
      opacity: 0.8, // Slight opacity for a softer look
    },
    retryButton: {
      marginTop: '20px',
      padding: '12px 24px',
      fontSize: '18px',
      backgroundColor: '#FF4F58', // A contrasting button color
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    retryButtonHover: {
      backgroundColor: '#FF2C3D', // Darker color when hovered
    },
  };
  