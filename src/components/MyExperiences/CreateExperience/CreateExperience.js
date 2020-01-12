import React from 'react'
import AuthContext from '../../../context/auth-context'
import './CreateExperience.css'


class CreateExperience extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            title:"",
            content:"",
            college:"",
            company:"",
            role:"Role"
        }
    }


    static contextType = AuthContext


    // handles the inputs of the fields
    handleInput = (event) => {
        if(event.target.name){
            this.setState({
                [event.target.name]: event.target.value
            })
        }else{
            this.setState({
                role: event.target.value
            })
        }
       
    }

    handleClickSave = async() => {
    

        console.log(this.state.content)


       
        //Saves to database
        let requestBody = {
            query: `
                mutation CreateMutation($title: String!){
                    createExperience(experienceInput:{
                        title:$title,
                        company:"${this.state.company}",
                        content:"""${this.state.content}""",
                        date:"${new Date().toString()}",
                        profile:"${this.state.role}"
                    }){
                        _id
                        title
                        date
                        company
                    }
                }
             `,
             variables:{
                 title: this.state.title,
                 content:this.state.content.toString()
             }
        }

        try{

            const authHeader = "bearer "+this.context.token
            const response = await fetch(process.env.REACT_APP_API_ENDPOINT,{
                method:'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': authHeader
                }
            })

            const resData = await response.json()
            console.log(resData)
            this.props.onCancel(resData.data.createExperience)

        }catch(err){
            console.log(err)
        }
    }



    render(){  
        return (
            <React.Fragment>
                <div className="centerbar">
                    <div className="content2">
                        <input type="text"
                               name="college"
                               placeholder="College name" 
                               value={this.state.collegename}
                               onChange={this.handleInput}/>
                        <input  type="text" 
                                name="company"
                                placeholder="Enter your company name"
                                value={this.state.company}
                                onChange={this.handleInput}/>
                        <div className="custom-select">
                            <select className="role" value={this.state.role} onChange={this.handleInput}>
                                <option value="Role">Role</option>
                                <option value="Internship">Internship</option>
                                <option value="Full-time">Full-time</option>
                            </select>
                        </div>
                        
                    </div>
                    <div className="right">
                        <input type="text" placeholder="Title"
                               name="title"
                               className="title"
                               value={this.state.title}
                               onChange={this.handleInput}/>
                        <textarea placeholder="Enter your experience" 
                                  name="content"
                                  className="exp" 
                                  value={this.state.content}
                                  onChange={this.handleInput}/>
                        <div>
                            <button style={{backgroundColor: "green"}} onClick={this.handleClickSave}>Save</button>
                            <button style={{backgroundColor: "red"}} onClick={this.props.onCancel}>Cancel</button>
                        </div>
    
                    </div>
                </div>
            </React.Fragment>  
        )
    }
}



export default CreateExperience