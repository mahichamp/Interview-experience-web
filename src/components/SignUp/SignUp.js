import React from 'react'
import AuthContext from '../../context/auth-context'
import './SignUp.css'
const InputValidation = require('../../validator/input-validator')

class SignUp extends React.Component{

   
        state = {
            
                firstname:"",
                lastname : "",
                email: "",
                password:"",
                collegename:"",
                year:0,
                errors:{
                    firstname:"",
                    email:"",
                    password:"",
                    year:"",
                },
                switcher_text:"Already a member ?",
                button_text:"Sign Up",
                hideIt:""
            }

    // Create a global auth-context for managing authentication
    static contextType = AuthContext



    // Handling Switching between SignUp and SignIn
    handleSwitch = (event) => {

        let btnText = null
        let switchText = null
        let hideIt = ""
        
        if(this.state.button_text === "Sign Up"){
                btnText = "Sign In"
                switchText = "Not a member? Sign up"
                hideIt = "hideIt"
        }else{
                btnText = "Sign Up"
                switchText = "Already a member?"
        }

        this.setState({
            button_text: btnText,
            switcher_text: switchText,
            hideIt:hideIt,
            firstname:"",
            lastname : "",
            email: "",
            password:"",
            collegename:"",
            year:0,
            errors:{
                firstname:"",
                email:"",
                password:"",
                year:"",
            }
        })
    }




    // handles the inputs of the fields
    handleInput = (event) => {

        let name = event.target.name
        if(!name){
            name = "year"
        }
        this.setState({
                [name] :  event.target.value,
                errors :{
                    [name]:""
                }
        })
    }

 
    performValidation = (flag)=>{

        const validator = new InputValidation()

        let f_val = [] , e_val =[] , p_val = [] , y_val = []

        if(!flag)
        f_val = validator.validateRequired(this.state.firstname)
        e_val = validator.validateEmail(this.state.email)
        p_val = validator.valdatePassword(this.state.password)
        if(!flag)
        y_val = this.state.year

        if(flag && p_val.length> 0){
            p_val[0] = "Invalid Password"
        }

        this.setState({
            errors: {
                firstname : f_val.length > 0  ? f_val[0] : "",
                email: e_val.length > 0 ? e_val[0] : "",
                password: p_val.length > 0 ? p_val[0]: "",
                year: y_val === 0 ? "Required" : ""
            }
        })

        // Login flag = true
        if(flag){
            return (e_val.length === 0 && p_val.length === 0)  
        }
        return (e_val.length === 0 && p_val.length === 0 && f_val.length === 0 && y_val !== 0 )
    }
    

     // handles signup / sign in 
    handleClick = (event) => {

        let isValid = false

        if(this.state.button_text === "Sign In"){
            isValid = this.performValidation(true)
        }else{
            isValid = this.performValidation(false)
        }

        if(isValid){
            // request body for  Sign Up
                let requestBody = {
                    query: `
                        mutation {
                            createUser(userInput:{
                                firstname:"${this.state.firstname}",
                                lastname:"${this.state.lastname}",
                                collegename:"${this.state.collegename}",
                                email:"${this.state.email}",
                                password:"${this.state.password}",
                                year:${this.state.year}
                            }){
                                _id
                                email
                            }
                        }
                    `
                }

                if(this.state.button_text === "Sign In"){

                    // request body for sign in
                    requestBody = {
                        query: `
                            query {
                                login(email:"${this.state.email}", password:"${this.state.password}"){
                                    userId
                                    token
                                    tokenExpiration
                                }
                            }
                        `
                    }
                }

            
                // Sign up/ Sign in the user by sending request to server
                fetch(process.env.REACT_APP_API_ENDPOINT,{
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers:{
                        'Content-Type':'application/json'
                    }

                }).then((response) => {

                    if(response.status!== 200 && response.status!== 201)
                        throw new Error('Failed')
                    return response.json()
                })
                .then(resData => {

                    console.log(resData)
                        // in case of login
                        if(resData.data.login && resData.data.login.token){    //  Extract the auth token and user id
                            this.context.login(
                                resData.data.login.token,
                                resData.data.login.userId,
                                resData.data.login.tokenExpiration
                        )
                    }else{
                        console.log("Sign Up Successful")
                        this.handleSwitch()
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        }
        
    }


    render(){

    
        return(
            <div className="content">


                <input type="text"
                            name="firstname" 
                            className={this.state.hideIt}
                            placeholder="First Name"
                            value={this.state.firstname}
                            onChange={this.handleInput}
                            />
                <label htmlFor="firstname">{this.state.errors.firstname}</label>

                <input type="text" 
                       name="lastname"
                       className={this.state.hideIt}
                       placeholder="Last Name"
                       value={this.state.lastname}
                       onChange={this.handleInput}/>
                <label htmlFor="lastname"></label>

                <input type="text" 
                       name="email"
                       placeholder="Email"
                       value={this.state.email}
                       onChange={this.handleInput}/>
                <label htmlFor="email">{this.state.errors.email}</label>

                <input type="password"
                       name="password"
                       placeholder="Password"
                       value={this.state.password}
                       onChange={this.handleInput}/>
                <label htmlFor="password">{this.state.errors.password}</label>

                <input type="text" 
                       className={this.state.hideIt}
                       name="collegename" 
                       placeholder="College Name"
                       value={this.state.collegename}
                       onChange={this.handleInput}/>
                <label htmlFor="collegename"></label>

                <select className={this.state.hideIt+" year"} value={this.state.year} onChange={this.handleInput}>
                    <option value="0" >Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Final Year</option>
                </select>
                <label htmlFor="year">{this.state.errors.year}</label>

                <br/>
                <button onClick={this.handleClick}>{this.state.button_text}</button><br/>
                <button id="btn-switcher" onClick={this.handleSwitch}>{this.state.switcher_text}</button>
            </div>  
        )  
    }

}


export default SignUp