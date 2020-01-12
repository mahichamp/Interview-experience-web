import React from 'react'

import './ChatItem.css'

export default function ChatItem(props){

    console.log(props)

    const classes = props.right ? "message-right" :"message-left"


    return (
        <p className={classes}><b>{props.message}</b><br/>
        {new Date(+props.time).toLocaleTimeString()}
        </p>
    ) 
}