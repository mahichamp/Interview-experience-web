
import React from 'react';
import SideBar from '../components/SideBar/SideBar';
import Experiences from '../components/Experiences/Experiences';
import AuthContext from '../context/auth-context';



class MainPage extends React.Component{


    constructor(props){
        super(props)    
        this.searchRef = React.createRef();  // reference for search input
    }


    static contextType = AuthContext

    state = {
        companies:[],                 // Stores the list of companies and their data
        experiences: [],               // Stores the list of experiences 
        selectedExperiences:[],        // Stores the selected expeiences 
        selectedButton:"",             
        isSearched:false
    }

    // Fetch the experience data on mounting the components
    componentDidMount(){
        this.fetchExperiencesData()
    }


    // Handles the search button when clicked
    // Searches the name of company in the list and if available then displays it.
    searchHandler = () => {


        if(!this.state.isSearched){

            let searchQuery = this.searchRef.current.value
            searchQuery = searchQuery.trim()
            searchQuery = searchQuery.toLowerCase()
            // Search for company
            let searchResult = this.state.companies.filter((c) => {
            return ( c.name.toLowerCase() === searchQuery ) 
            })

            this.setState({
                companies:searchResult,
                isSearched:true
            })

        }else{

            this.searchRef.current.value =""
            this.fetchExperiencesData()
        }
    }


    // Handles clicks on company blocks
    // Filters the experiences and shows only the experience who has the same company tag
    // as clicked.
    handleSidebarClick = (event) => {


        if(event.target.name === this.state.selectedButton){

            const exp = this.state.experiences

            this.setState({
                selectedExperiences: exp,
                selectedButton: ""
            })
        }else{

            const selectedExperiences = this.state.experiences.filter((exp) => {
                return (exp.company === event.target.name)
            })
    
            this.setState({
                selectedExperiences:selectedExperiences,
                selectedButton: event.target.name
            })
        }
    }


    // Fetch all the experiences data if expId is not provided
    // If expId is provided fetch data corresponding to that.
    fetchExperiencesData = async (expId) => {


        let requestBody = {
            query: `
                query {
                    experiences{
                        _id
                        title
                        company
                        date
                        profile
                        creator{
                            collegename
                            _id
                        }
                    }
                }
            `
        }

        try{

            const response = await fetch(process.env.REACT_APP_API_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers:{
                    'Content-Type':'application/json'
                }

            })

            if(response.status !== 200 && response.status !== 201){
                    throw new Error('Failed')
                }
            
            const resData  = await response.json()
            console.log(resData)
            this.fetchSidebarData(resData)  
        }
        catch(err){
            console.log(err)
        }
    }


    // Fetches the list of companies to populate the sidebar
    fetchSidebarData = async(expData) => {

        let requestBody = {
            query: `
                query {
                    companies{
                        _id
                        name
                    }
                }
            `
        }
        try{
            const response = await fetch(process.env.REACT_APP_API_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers:{
                    'Content-Type':'application/json'
                }

            })

            if(response.status!== 200 && response.status!== 201){
                    throw new Error('Failed')
                }

            const resData  = await response.json()
            console.log(resData)
            this.setState({
                companies: resData.data.companies,
                isSearched:false,
                selectedButton:"",
                experiences: expData.data.experiences,
                selectedExperiences: expData.data.experiences
             })
        }
        catch(err){
            console.log(err)
        }
    }


    render(){

        return (
                <div className="mainpage">
                <SideBar companies={this.state.companies} 
                         onClick={this.handleSidebarClick} 
                         selectedButton={this.state.selectedButton}
                         searchRef={this.searchRef}
                         searchHandler={this.searchHandler}
                         isSearched={this.state.isSearched}/>
                <Experiences experiences={this.state.selectedExperiences}/>
                </div>          
        )
    }
}


export default MainPage