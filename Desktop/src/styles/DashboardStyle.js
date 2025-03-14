import userSettings from "../appContent/userSettings.json"

export const DashboardStyle = {
    container: {
        display: 'flex',
        flexDirection: 'row', // Stack elements vertically
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: userSettings.UI.theme == 'light'? '#FFF' : '#010101',
        color: userSettings.UI.theme == 'light'? 'black' : 'white', // Text color
        margin: 0,
        padding: 0,
        textAlign: 'center', // Center the text horizontally
    },
    drawer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '25vw',
        backgroundColor: userSettings.UI.theme == 'light'? '#E0E0E0' : '#070707',
    },
    drawerTitle: {
        color: userSettings.UI.theme == 'light'? "#0e212f" : '#070707',

    },
    drawerTitleContainer:{
        display:'flex',
        backgroundColor:'#3B76A2',
        height: '7vh',
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    quad1: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100vh',
    },
    quad2:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: '93vh',
        width: '75vw'
    },
    topBar:{
        display: 'flex',
        flexDirection: 'row',
        height: '7vh',
        width: '75vw',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: userSettings.UI.theme == 'light'? '#0055b8':'#0e212f',
    },
    topBarName: {
        color: "#fff"
        
    },
    contactPanelStyle: {
        display: 'flex',
        flexDirection: 'column',
        height: '93vh',
        width: '25vw',
        backgroundColor: userSettings.UI.theme === 'light' ? '#F2FAFF' : '#030303',
    },
    contactPanelTitle:{
        display: 'flex',
        textDecorationLine:'underline',
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    Scroll:{
        overflowY: "auto", // Enables vertical scrolling
        padding: "10px",
    },
    contactCardContainer:{
        display: 'flex',
        height: '10vh',
        width: '15vw',
        paddingLeft: 20,
        paddingRight: 20,
    }
      
}