import React from 'react'

import MyExperienceBlock from '../MyExperiences/MyExperienceBlock/MyExperienceBlock'
import './MyExperiences.css'




function MyExperiences(props){

    const expList = props.myExpData.map((myExp) => {
        return <MyExperienceBlock key={myExp._id} data={myExp} onClick={props.onClick}/>
    })

    return(
            <div className="blocks">
                {expList}
            </div>
    )
}


export default MyExperiences