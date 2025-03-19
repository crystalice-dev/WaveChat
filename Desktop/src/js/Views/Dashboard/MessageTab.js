import React from 'react'

const NoThread=()=>{
  return(
    <div>
      <h1>No Message to show</h1>
    </div>
  )
}

const MessageBoard=()=>{
  return(
    <div>
      <h1>MESSAGES</h1>
    </div>
  )
}

function MessageTab({threadId}) {
  return (
    <div>
      {
        threadId == 0? <NoThread/> : <MessageBoard/>
      }
    </div>
  )
}

export default MessageTab
