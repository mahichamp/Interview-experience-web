import React from 'react'

import './MyExperienceBlock.css'


function MyExperienceBlock(props){

    return(
        <div className="my-experience-block">
            <div>
                <h1>{props.data.title}</h1>
                <h1>{props.data.company}</h1>
            </div>
            <button name="view" 
                    onClick={(e) => props.onClick(e,props.data._id)}
                    >View</button>
            <button name="delete"  onClick={(e) => props.onClick(e,props.data._id)} style={{backgroundColor : "red"}}>Delete</button>
        </div>
    )
}


export default MyExperienceBlock