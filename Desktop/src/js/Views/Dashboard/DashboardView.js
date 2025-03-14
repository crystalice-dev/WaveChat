import React, {useState, useRef, useEffect, } from 'react'
import { DashboardStyle } from '../../../styles/DashboardStyle'

//Settings
import userProfile from '../../../appContent/userProfile.json'
import userSettings from '../../../appContent/userSettings.json'
import userContacts from '../../../appContent/userContacts.json'

const Drawer=()=>{
    return(
    <div style={DashboardStyle.drawer} >
            <div style={DashboardStyle.drawerTitleContainer} >
              <h1 style={DashboardStyle.drawerTitle} > WaveChat</h1>
            </div>

      </div>
    )
}
const TopBar=()=>{
    return(
        <div style={DashboardStyle.topBar} >
            <h2 style={DashboardStyle.topBarName} >{userProfile.name}</h2>
        </div>
    )
}

const ContactCard=({name, email})=>{
  return(
    <div style={DashboardStyle.contactCardContainer}>
      <h3>{name}</h3>
      <h5>{email}</h5>
    </div>
  )
}

const ContactList=()=>{
  return (
    <div style={DashboardStyle.Scroll}>
      {
        userContacts.map(data=>{
         return  <ContactCard name={data.name} email={data.email} />
        })
      }
    </div>
  );
}


const ContactPanel=()=>{
  return(
    <div style={DashboardStyle.contactPanelStyle} >
      <h2 style={DashboardStyle.contactPanelTitle} >CONTACTS</h2>
      <ContactList/>
    </div>
  )
}

function DashboardView() {
  return (
    <div style={DashboardStyle.container}>
      <Drawer/>
      <div style={DashboardStyle.quad1} >
        <TopBar/>
        <div style={DashboardStyle.quad2}>
            <ContactPanel/>
            <h1>Hello</h1>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
