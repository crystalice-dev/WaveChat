import React, { useEffect, useRef, useState } from 'react';
import { DashboardStyle } from '../../../styles/DashboardStyle';

//Icons
import {IoChatboxEllipses, IoCameraSharp, IoSettings} from 'react-icons/io5'; // Ionicons v5


// Settings
import userProfile from '../../../appContent/userProfile.json';
import userSettings from '../../../appContent/userSettings.json';
import userContacts from '../../../appContent/userContacts.json';
  

const ContactsTab = ({selectTab})=>{
  const [selectedContact, setSelectedContact] = useState(0);
 
  const ContactCard = ({ contactId, name, hasProfilePicture, profilePicture, email, phoneNumber }) => {
    return (
      <div
        onClick={() => setSelectedContact(contactId)}
        style={DashboardStyle.contactCardContainer}
      >
        {contactId === selectedContact ? (
          <div style={DashboardStyle.contactCardNameSelected}>
            {hasProfilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{ width: '8vw', height: '8vh', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <h4>{name[0]}</h4>
            )}
          </div>
        ) : (
          <div style={DashboardStyle.contactCardNameNotSelected}>
            {hasProfilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <h4>{name[0]}</h4>
            )}
          </div>
        )}
        <div style={{ width: '10vw', justifyContent: 'center', alignContent: 'center' }}>
          <div>
            <h5>{name}</h5>
          </div>
        </div>
      </div>
    );
  };

  const ContactList = () => {
    const scrollRef = useRef(null);
    const [prevUserContactsLength, setPrevUserContactsLength] = useState(userContacts.length);

    useEffect(() => {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        if (userContacts.length > prevUserContactsLength) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
          scrollContainer.scrollTop = scrollContainer.scrollTop;
        }
      }
      setPrevUserContactsLength(userContacts.length);
    }, [userContacts]);

    return (
      <div  style={DashboardStyle.Scroll} ref={scrollRef}>
        {userContacts.map((data) => (
          <ContactCard
            key={data.contactId}
            contactId={data.contactId}
            name={data.name}
            hasProfilePicture={data.hasProfilePicture}
            profilePicture={data.profilePicture}
            email={data.email}
            phoneNumber={data.phone}
          />
        ))}
      </div>
    );
  };

  const ContactPanel = () => {
    return (
      <div style={DashboardStyle.contactPanelStyle}>
        <h2 style={DashboardStyle.contactPanelTitle}>CONTACTS</h2>
        <ContactList  />
      </div>
    );
  };

  const ContactCartFullView = ({ contactId }) => {
    const contact = userContacts.find((contact) => contact.contactId === contactId);

    const [editContact, setEditContact] = useState(false)
    const [editContactEmail, setEditContactEmail] = useState('');
    const [editContactPhone, setEditContactPhone] = useState('');

    const [messageBTNScale, setMessageBTNScale] = useState(1);
    const [cameraBTNScale, setCameraBTNScale] = useState(1);
    const [settingsBTNScale, setSettingsBTNScale] = useState(1);
  
    const messageHoverIn=()=>{
        setMessageBTNScale(2)
    }

    const messageHoverOut=()=>{
        setMessageBTNScale(1)
    }

    const cameraHoverIn=()=>{
        setCameraBTNScale(2)
    }

    const cameraHoverOut=()=>{
        setCameraBTNScale(1)
    }

    const settingsHoverIn=()=>{
      setSettingsBTNScale(2)
  }

  const settingsHoverOut=()=>{
      setSettingsBTNScale(1)
  }

  const DeleteContact=()=>{
    const conf = confirm(`Would you like to delete ${contact.name} as contact?`);

    if(conf){
      if(contact.contactId == 0){
        alert(`Can not remove ${contact.name}`)
        setEditContact(false);
        return null;
      }else{
        alert("deleted")
        setEditContact(false);
        return null;
      }
    }

  }

  const SaveContactInfo = () => { 
    let didUpdate = false;
    if (editContactEmail.length > 5 && contact.email !== editContactEmail) {
      userContacts[contact.contactId].email = editContactEmail;
      didUpdate = true;
    }
  
    if (editContactPhone.length === 14 && contact.phone !== editContactPhone) {
      userContacts[contact.contactId].phone = editContactPhone;
      didUpdate = true;
    }
  
    // Exit edit mode if something was updated, otherwise just cancel
    setEditContact(false);
  
    if (!didUpdate) {
      alert("No valid updates made.");
    }
  };
  

    return (
      <div  style={DashboardStyle.contactCardFullView}>
        <div
          hidden={!contact.hasProfilePicture}
          style={{
            width: '70vw',
            height: '250px',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          {contact.hasProfilePicture === true ? (
            <img
              src={contact.profilePicture}
              alt="Profile"
              style={{
                width: '250px',
                height: '250px',
                justifyContent: 'center',
                alignContent: 'center',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : null}
        </div>
        <div style={{ width: '70vw', height: '50px' ,justifyContent:'center', alignContent:'center', marginBottom: 40}} >
            <h1>{contact.name}</h1>
        </div>
        <div
          style={{
            width: '70vw',
            height: '50px',
            justifyContent: 'center',
            alignContent: 'center',
            marginBottom: 40,
          }}
        >
          <IoChatboxEllipses
            style={{
              margin: '10px',
              transform: `scale(${messageBTNScale})`,
              transition: 'transform 0.3s ease', // Adding the transition property
            }}
            onMouseEnter={() => messageHoverIn()}
            onMouseLeave={() => messageHoverOut()}
            color={userSettings.UI.theme == 'light'? '#0055b8':'#3188CA'}
            size={40}
          />

        <IoCameraSharp
            style={{
              margin: '10px',
              transform: `scale(${cameraBTNScale})`,
              transition: 'transform 0.3s ease', // Adding the transition property
            }}
            onMouseEnter={() => cameraHoverIn()}
            onMouseLeave={() => cameraHoverOut()}
            color={userSettings.UI.theme == 'light'? '#0055b8':'#3188CA'}
            size={40}
          />

          <IoSettings
            style={{
              margin: '10px',
              transform: `scale(${settingsBTNScale})`,
              transition: 'transform 0.3s ease', // Adding the transition property
            }}
            onClick={()=>setEditContact(true)}
            onMouseEnter={() => settingsHoverIn()}
            onMouseLeave={() => settingsHoverOut()}
            
            color={userSettings.UI.theme == 'light'? '#0055b8':'#3188CA'}
            size={40}
          />
          
        </div>
        <div style={{ paddingLeft: '50px', marginBottom: '1px', flexDirection: 'column' }}>
          <h3>EMAIL: {contact.email}</h3>
          <textarea
            style={DashboardStyle.ContactEditTextArea}
            inputMode='email'
            placeholder='New Email'
            value={editContactEmail}
            onChange={e=>setEditContactEmail(e.value)}
            hidden = {!editContact}
          />
        </div>
        <div style={{ paddingLeft: '50px', marginBottom: '1px', flexDirection: 'column' }}>
          <h3>PHONE: {contact.phone}</h3>
          <textarea
              style={DashboardStyle.ContactEditTextArea}
              inputMode="numeric"
              placeholder="New Phone"
              maxLength={14} // includes formatting chars like (), space, -
              value={editContactPhone}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, ''); // keep digits only
                let formatted = raw;

                if (raw.length > 3 && raw.length <= 6) {
                  formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
                } else if (raw.length > 6) {
                  formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
                }

                setEditContactPhone(formatted);
              }}
              hidden = {!editContact}
            />

        </div>
        <div style={{padding: 50}} hidden = {!editContact} >
          <button
            onClick={()=>DeleteContact()}
            style={{...DashboardStyle.ContactEditButton, margin: 5, backgroundColor:'#CC0000', color:'#FFF'}}
          >DELETE</button>

          <button
            onClick={()=>setEditContact(false)}
            style={{...DashboardStyle.ContactEditButton, margin: 5,backgroundColor:'#808080', color:'#fff'}}
          >BACK</button>

          <button
            onClick={()=>SaveContactInfo()}
            style={{...DashboardStyle.ContactEditButton, margin: 5, backgroundColor: userSettings.UI.theme == 'light'? '#0055b8' : '#3188CA', color: '#fff'}}
          >SAVE</button>

        </div>
      </div>
    );
};

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <ContactPanel />
      </div>
      <div style={{ width: '50%' }}>
        <ContactCartFullView  contactId={selectedContact} />
      </div>
    </div>
  );
}

export default ContactsTab;
