import React from 'react'
import FloatingButton from '../components/FloatingButton/FloatingButton'
import CreateExperience from '../components/MyExperiences/CreateExperience/CreateExperience'
import MyExperiences from '../components/MyExperiences/MyExperiences'
import AuthContext from '../context/auth-context'
import ViewExperience from '../components/ViewExperience/ViewExperience'

class MyExperiencesPage extends React.Component{


    constructor(props){
        super(props)

        this.state = {
            createExp:false,
            hidden:false,
            year:0,
            createdExpData:[],
            viewExp:false,
            viewExpId:null
        }

        this.createExpComponent = null
    }

    static contextType = AuthContext

    
    createNewExperience = () => {
        this.setState({
            createExp:true,
            hidden:true
        })
    }

    onCancelHandler = (updatedExperiences) => {

        console.log(updatedExperiences)
        const prevExpData = this.state.createdExpData
        prevExpData.push(updatedExperiences)
        console.log(prevExpData)
        this.setState({
            createExp:false,
            hidden:false,
            createdExpData : prevExpData
        })

    }

    componentDidMount(){

        
        const requestBody = {
            query: `
                query{
                    user(userId:"${this.context.userId}")
                {
                    year
                    createdExperiences{
                        title
                        company
                        date
                        _id
                    }
                }
            }
            `
        }
       
        const authHeader = "bearer "+this.context.token
        fetch(process.env.REACT_APP_API_ENDPOINT,{
            method:'POST',
            body: JSON.stringify(requestBody) ,
            headers:{
                'Content-Type':'application/json',
                'Authorization': authHeader     
            }
        }).then((response)=>{
                return response.json()
        }).then((resData) => {
            console.log(resData)
            this.setState({
                year: resData.data.user.year,
                createdExpData: resData.data.user.createdExperiences
            })
        }).catch((err)=>{
            console.log(err)
        })
        
    }


    handleMyExpClick = async(event, expId)=> {
        
        console.log(event.target)
        const name = event.target.name
        console.log(name)
        if(name === 'view'){
            this.setState({
                viewExp:true,
                viewExpId:expId
            })
        }else if(name === 'delete'){

            console.log(expId)
            const requestBody = {
                query: `
                    mutation{
                       deleteExperience(expId:"${expId}")
                    }
                `
            }
           
            const authHeader = "bearer "+this.context.token
            const response = await fetch(process.env.REACT_APP_API_ENDPOINT,{
                method:'POST',
                body: JSON.stringify(requestBody) ,
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': authHeader     
                }
            })

            const resData = await response.json()
            console.log(resData)

            this.setState((prevState,props) => ({
               createdExpData: prevState.createdExpData.filter((exp) => exp._id!==expId)
            }))
        }        
    }



    handleViewExperienceBack =() => {
        this.setState({
            viewExp:false,
            viewExpId:null
        })
    }



    render(){

       if(this.state.year === 3 || this.state.year === 4){
        this.createExpComponent =  <React.Fragment>
                                    {this.state.createExp ? <CreateExperience onCancel={this.onCancelHandler}/> 
                                                            : <MyExperiences myExpData={this.state.createdExpData}
                                                                             onClick={this.handleMyExpClick}/>}
                                    <FloatingButton hidden={this.state.hidden} onClick={this.createNewExperience} icon="fa-plus"/>
                                    </React.Fragment>
       }else{
           this.createExpComponent = <React.Fragment>
                                        <div style={{paddingTop:"50px"}}>
                                            <h1> Sorry..</h1>
                                        </div>
                                    </React.Fragment>
       }
      
        return(
        
                 this.state.viewExp ? <div style={{paddingTop:"50px"}}> <ViewExperience viewExpId={this.state.viewExpId} 
                                                        onClickBack={this.handleViewExperienceBack}
                                                        messageModal={false}/>
                                      </div> 
                                        : this.createExpComponent
                
            )
           
    }
    
}


export default MyExperiencesPage

