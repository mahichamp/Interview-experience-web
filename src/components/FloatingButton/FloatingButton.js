import React from 'react'
import './FloatingButton.css'


export default function FloatingButton(props){

    const classes = "float "+(props.hidden? "hidden":"") 

    return  <React.Fragment>
                <button className={classes} 
                        onClick={props.onClick}
                        style={{...props.style}}>
                    <i className={"fa "+props.icon}/>
                </button>
            </React.Fragment>
}