import userSettings from "../appContent/userSettings.json"

export const StartSessionStyle = {
    Container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '93vw', // fixed width, won’t change
        backgroundColor: userSettings.UI.theme == 'light' ? '#FFF' : '#000',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    SessionBTN:{
        display:'flex',
        height: '10vh',
        width: '35vw',
        backgroundColor: '#1e90ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '5%', 
        overflow: 'hidden',
        boxShadow: userSettings.UI.theme == 'light'? '0 4px 10px rgba(0, 0, 0, 0.2)': '0 4px 10px rgba(255, 255, 255, 0.2)', // subtle elevatio
        margin: 5
    }
}