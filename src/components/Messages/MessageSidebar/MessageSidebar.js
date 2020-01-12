import React from 'react'
import './MessageSidebar.css';


export default function MessageSidebar(props){


    console.log(props)
    let sidebarChatList = null

    if(props.sidebarChats){
        sidebarChatList = props.sidebarChats.map( (chat,i) => {
            return (
                <div key={chat.partner._id} onClick={ (e) => props.onChatClick(e,chat.partner._id,chat.partner.firstname)} className="message-sidebar-blocks" >
                    <h3>{chat.partner.firstname}</h3>
                    <h4>{chat.lastMessage}</h4>
                </div>
            )
        })
    
    }
    

    return (
        <div className="message-sidebar">
            {sidebarChatList}
        </div>
    ) 
}