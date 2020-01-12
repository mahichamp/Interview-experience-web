import React from 'react'
import {BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './App.css'


import MainPage from './pages/MainPage'
import MyExperiencesPage from './pages/MyExperiencesPage'
import AuthPage from './pages/AuthPage';
import AuthContext from './context/auth-context'
import NavBar from './components/NavBar/NavBar'
import MessagePage from './pages/MessagePage'


class App extends React.Component {


    // State for managing authentication
  	state = {
	  	  token:null,
		  userId:null
	  }




  componentDidMount(){

		const token = localStorage.getItem('token')
		const expiryDate = localStorage.getItem('expiryDate')
		const userId = localStorage.getItem('userId')

		// If token doesn't exists
		if(!token || !expiryDate || !userId){
			return 
		}

		// Check for expiration time
		if(new Date(expiryDate) <= new Date()){
			this.logout()
			return 
		}

		const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
		this.setState({
			userId : userId,
			token : token
		})
		this.setAutoLogout(remainingMilliseconds)
 	}
	

	setAutoLogout = milliseconds => {
		setTimeout(() => {
		  this.logout()
		}, milliseconds)
	}
	
	 

			// On successful Login get the token value recieved from server and store it in state
	login = (token, userId, tokenExpiration) => {

				this.setState({
					token:token,
					userId:userId
				})

				localStorage.setItem('token', token);
				localStorage.setItem('userId',userId);
				const remainingMilliseconds = tokenExpiration*60*60*1000;
				console.log(remainingMilliseconds)
				const expiryDate = new Date(
				  new Date().getTime() + remainingMilliseconds
				);
				console.log(expiryDate)
				localStorage.setItem('expiryDate', expiryDate.toLocaleString());
				this.setAutoLogout(remainingMilliseconds);
	}


		// On logging out reset the auth state
	logout = () => {

				this.setState({
				token:null,
				userId:null
				})

				localStorage.removeItem('token')
				localStorage.removeItem('userId')
				localStorage.removeItem('expiryDate')
	}

	render(){

		console.log(this.state.token)

		return (
			<BrowserRouter>
			<React.Fragment>
			<AuthContext.Provider value={
				{ token:this.state.token, 
				userId:this.state.userId,
				login:this.login, 
				logout:this.logout}}>
					{!this.state.token && <Redirect from="/" to="/auth"/>}
					{this.state.token && <Redirect from="/auth" to="/"/>}
					{this.state.token && <NavBar logout={this.logout}/>}
				<Switch>
					{!this.state.token && <Route path="/auth" component={AuthPage}/>}
					{this.state.token && <Route path="/experiences" exact component={MyExperiencesPage}/>}
					{this.state.token && <Route path="/messages" exact component={MessagePage}/>} 
					{this.state.token && <Route path="/" component={MainPage}/>}     
				</Switch>  
			</AuthContext.Provider>

			</React.Fragment>
		</BrowserRouter>
			)
	}
}



/**
 * 
 * {!this.state.token && <Redirect from="/" to="/auth"/>}
					{!this.state.token && <Redirect from="/auth" to="/"/>}
					{this.state.token && <NavBar logout={this.logout}/>}
				<Switch>
					{!this.state.token && <Route path="/auth" component={AuthPage}/>}
					{this.state.token && <Route path="/experiences" exact component={MyExperiencesPage}/>}
					{this.state.token && <Route path="/messages" exact component={MessagePage}/>} 
					{this.state.token && <Route path="/" exact component={MainPage}/>}     
				</Switch>  
 */

export default App
