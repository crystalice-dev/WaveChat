export const splashStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0e212f', // Initial background color
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  headText: {
    fontSize: 100,
    color: 'white', // Initial text color
  },
  spinner: {
    marginTop: 30,
    width: 50,
    height: 50,
    border: '6px solid #ffffff22',
    borderTop: '6px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footerText: {
    position: 'absolute',
    bottom: 35,
    fontSize: 14,
    color: '#000',
    fontWeight: 100,
    fontFamily: 'sans-serif',
    letterSpacing: 1,
  },
}; 
 