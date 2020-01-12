import React from 'react'

import './SideBar.css'


class SideBar extends React.Component{

    constructor(props){
        super(props)
        this.companyList = ""
        this.searchImg = "images/search.png"
    }
    

    render(){

        this.companyList = this.props.companies.map((company)=>{

            if(this.props.selectedButton === company.name)
                return <li key={company._id}><button className="selected" name={company.name} onClick={this.props.onClick}>{company.name}</button></li>
            
            return <li key={company._id}><button name={company.name} onClick={this.props.onClick}>{company.name}</button></li>
        })



        this.searchImg = this.props.isSearched ? "images/cancel.png" : "images/search.png"
    
        return(

            <div className="sidebar">
                 <div className="search">
                    <input type="text" placeholder="Search.." ref={this.props.searchRef} />
                    <button onClick={this.props.searchHandler}><img src={this.searchImg} alt="Search"/></button>
                </div>
                <div className="company-tags">
                    <ul>
                        {this.companyList}
                    </ul>
                </div>  
            </div>
        )
    }
    
}

export default SideBar