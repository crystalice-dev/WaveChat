import React from 'react'

function TopBar() {
    const handleClose = () => {
        window.electron.closeWindow();  // IPC call to close the window
    };

    const handleMinimize = () => {
        window.electron.minimizeWindow();  // IPC call to minimize the window
    };

    const handleMaximize = () => {
        window.electron.maximizeWindow();  // IPC call to toggle maximize
    };


    return (
        <div style={styles.controls}>
            <button style={styles.button} onClick={handleMinimize}>Min</button>
            <button style={styles.button} onClick={handleMaximize}>Max</button>
            <button style={styles.button} onClick={handleClose}>Close</button>
        </div>
    );
}

const styles = {
    controls: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px',
        background: 'rgba(0,0,0,0.1)', // Transparent background
    },
    button: {
        marginLeft: '10px',
        padding: '5px 10px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    }
};


export default TopBar
