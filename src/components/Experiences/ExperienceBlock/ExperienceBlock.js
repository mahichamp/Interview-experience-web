import React from 'react'


import './ExperienceBlock.css'


function ExperienceBlock(props){

    return(
        <div className="experience-block">
            <h2 id="exp_block_title">{props.experience.title}</h2>
            <h3 id="exp_block_company">{props.experience.company}</h3>
            <h3 id="role">{props.experience.profile}</h3>
            <h4 id="exp_block_college">{props.experience.creator.collegename}</h4>
            <button onClick={ (e) => props.onClick(e,props.experience._id) }>View</button>
        </div>
    )
}


export default ExperienceBlock