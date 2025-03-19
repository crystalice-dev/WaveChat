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
        width: '7vw', // fixed width, won’t change
        minWidth: '7vw',
        maxWidth: '7vw',
        backgroundColor: userSettings.UI.theme == 'light' ? '#FFF' : '#070707',
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.15)', // shadow mostly on the right
        zIndex: 2, // optional: keeps it above other stuff if overlapping
    }, 
    
    drawerTitle: {
        color: userSettings.UI.theme == 'light'? "#FFF" : '#070707',
    },
    drawerTop:{
        display:'flex',
        backgroundColor:'#3188CA',
        height: '7vh',
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerTitleContainer: {
        display: 'flex',
        backgroundColor: '#5AB1F5',
        height: '6vh',
        width: '6vh', // match height for a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%', // makes it a circle
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // subtle elevation
    },
    drawerIconContainer:{
        display: 'flex',
        height: '7vh',
        width: '7vw',
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 20
    },
    drawerIconSelected:{
        display: 'flex',
        height: '7vh',
        width: '7vw',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'white', // optional for contrast
        borderRadius: 10, // optional: softens edges
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' // black-ish shadow for elevation
    },
      
    quad1: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100vh',
    },
    
    topBar:{
        display: 'flex',
        flexDirection: 'row',
        height: '7vh',
        width: '91vw',
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
    Scroll: {
        overflowY: "auto", 
        padding: "10px",
      
    }, 
    contactCardContainer:{
        display: 'flex',
        height: '10vh',
        width: '15vw',
        paddingLeft: 20,
        paddingRight: 20,
    },
    contactCardNameSelected:{
        display: 'flex',
        backgroundColor: '#5AB1F5',
        height: '8vh',
        width: '8vh', // match height for a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%', // makes it a circle
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // subtle elevation
    },
    contactCardNameNotSelected:{
        display: 'flex',
        backgroundColor: userSettings.UI.theme == 'light'? '#fff' : '#2c3e50',
        height: '8vh',
        width: '8vh', // match height for a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%', // makes it a circle
    },
    contactCardFullView:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '93vh',
        width: '75vw',
        backgroundColor: userSettings.UI.theme == 'light'? '#F7F6F6' : '#000'
    },
    ContactEditTextArea:{
        width: '20vw',
        height: '3vh',
        fontSize: 18,
        maxWidth: '27vw',
        minWidth: '27vw',
        maxHeight: '3vh',
        minHeight: '3vh',
        textAlign: 'center',
        backgroundColor: userSettings.UI.theme == 'light'? '#fff' : '#E0E0E0'
    },
    ContactEditButton:{
        width: '7vw',
        height: '5vh',
        fontSize: 18,
    }
      
}