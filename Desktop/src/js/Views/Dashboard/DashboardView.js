import React, {useState, useRef, useEffect, } from 'react'
import { DashboardStyle } from '../../../styles/DashboardStyle'

//Icons
import { IoAddCircleSharp, IoAddCircleOutline, IoChatbubbleEllipsesSharp, IoChatbubbleEllipsesOutline, IoSettingsSharp, IoSettingsOutline, IoPersonCircle, IoPersonCircleOutline, IoPeopleCircle, IoPeopleCircleOutline} from 'react-icons/io5'; // Ionicons v5

//Settings
import userProfile from '../../../appContent/userProfile.json'
import userSettings from '../../../appContent/userSettings.json'
import userContacts from '../../../appContent/userContacts.json'

//Drawer Tabs
import MessageTab from './MessageTab';
import ContactsTab from './ContactsTab';
import SettingsTab from './SettingsTab';
import ProfileTab from './ProfileTab';
import StartSessionTab from './StartSessionTab';


const TopBar=()=>{
    return(
        <div style={DashboardStyle.topBar} >
            <h1 style={DashboardStyle.topBarName} >WaveChat</h1>
        </div>
    )
}

function DashboardView() {

  const [SelectedTab, setSelected] = useState(0);
  const [threadId, setThreadId ] = useState(0)

  //Drawer
  const Drawer=()=>{

    const StartSessionTab=()=>{
      return(
        <div onClick={()=>setSelected(4)} style={DashboardStyle.drawerIconContainer} >
          {
            SelectedTab == 4? <IoAddCircleSharp style={{...DashboardStyle.drawerIconSelected,backgroundColor: userSettings.UI.theme == 'light'? '#fff':'#2c3e50'}} size={40} color="#1e90ff" /> : <IoAddCircleOutline size={40} color="#1e90ff" />
          }
        </div>
      )
    }

    const ChatIcon=()=>{
      return(
        <div onClick={()=>setSelected(0)} style={DashboardStyle.drawerIconContainer} >
          {
            SelectedTab == 0? <IoChatbubbleEllipsesSharp style={{...DashboardStyle.drawerIconSelected,backgroundColor: userSettings.UI.theme == 'light'? '#fff':'#2c3e50'}} size={40} color="#1e90ff" /> : <IoChatbubbleEllipsesOutline size={40} color="#1e90ff" />
          }
        </div>
      )
    }

    const ContactsIcon=()=>{
      return(
        <div onClick={()=>setSelected(1)} style={DashboardStyle.drawerIconContainer} >
          {
            SelectedTab == 1? <IoPeopleCircle style={{...DashboardStyle.drawerIconSelected,backgroundColor: userSettings.UI.theme == 'light'? '#fff':'#2c3e50'}} size={40} enableBackground={true} color="#1e90ff" /> : <IoPeopleCircleOutline size={40} color="#1e90ff" />
          }
        </div>
      )
    }

    const SettingsIcon=()=>{
      return(
        <div onClick={()=>setSelected(2)} style={DashboardStyle.drawerIconContainer} >
          {
            SelectedTab == 2? <IoSettingsSharp style={{...DashboardStyle.drawerIconSelected,backgroundColor: userSettings.UI.theme == 'light'? '#fff':'#2c3e50'}} size={40} color="#1e90ff" /> : <IoSettingsOutline size={40} color="#1e90ff" />
          }
        </div>
      )
    }

    const ProfileIcon = () => {
      return (
        <div
          onClick={() => setSelected(3)}
          style={{
            ...DashboardStyle.drawerIconContainer,
            marginTop: 'auto', // this pushes it to the bottom
            paddingBottom: 15
          }}
        >
          {
            SelectedTab == 3
              ? <IoPersonCircle style={{...DashboardStyle.drawerIconSelected,backgroundColor: userSettings.UI.theme == 'light'? '#fff':'#2c3e50'}} size={40} color="#1e90ff" />
              : <IoPersonCircleOutline size={40} color="#1e90ff" />
          }
        </div>
      );
    };

  return(
    <div style={DashboardStyle.drawer} >
            <div style={DashboardStyle.drawerTop} >
              <div onClick={()=>alert("Hello World")} style={DashboardStyle.drawerTitleContainer} >
                <h2 style={DashboardStyle.drawerTitle} > {userProfile.name[0]}</h2>
              </div>
            </div>
            <StartSessionTab/>
            <ChatIcon/>
            <ContactsIcon/>
            <SettingsIcon/>
            <ProfileIcon/>
      </div>
    )
}

  const renderPoint=()=>{
    switch (SelectedTab) {
      case 0:
        return <MessageTab threadId = {threadId} />
      case 1:
        return <ContactsTab selectTab = {setSelected}/>
      case 2:
        return <SettingsTab/>
      case 3:
        return <ProfileTab/>
      case 4: 
        return <StartSessionTab/>
      default:
        break;
    }
  }

  return (
    <div style={DashboardStyle.container}>
      <Drawer/>
      <div style={DashboardStyle.quad1} >
        <TopBar/> 
       {
        renderPoint()
       }
      </div>
    </div>
  )
}

export default DashboardView
