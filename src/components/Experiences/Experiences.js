import React from 'react'
import ExperienceBlock from './ExperienceBlock/ExperienceBlock'
import ViewExperience from '../ViewExperience/ViewExperience'


class Experiences extends React.Component{

    constructor(props){
        super(props)


        console.log(props)
        this.state = {
            isViewed :false,
            viewExpId:null
        }
    }

    // fetches the experience content complete
    handleViewExperienceClick = async(event, expId) => {

            this.setState({
                viewExpId: expId
            })
    }

    // back button handler
    handleViewExperienceBack = () => {
        
        this.setState({
            viewExpId:null
            })
    }


    render(){

        const experiencesBlocks = this.props.experiences.map((experience,i) => {
            return <ExperienceBlock key={i} experience={experience} onClick={this.handleViewExperienceClick}/>
        })

        return(
            <div style={{ gridColumn: 2 / -1 , gridRow: 2/ -1 }}>
            {this.state.viewExpId ? <ViewExperience viewExpId={this.state.viewExpId} 
                                    onClickBack={this.handleViewExperienceBack}
                                    messageModal={false}
                                    /> : experiencesBlocks}
            </div>
        )

    }


}


export default Experiences


