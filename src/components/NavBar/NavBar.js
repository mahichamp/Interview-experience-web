import React from 'react'
import {  NavLink } from 'react-router-dom'

import './NavBar.css';

export default function NavBar(props){

    return( 
        <div className="navbar">
            <h1>Interview Experience</h1>
            <NavLink to="/" exact>Home</NavLink>
            <NavLink to="/experiences">My Experiences</NavLink>
            <NavLink to="/messages">Messages</NavLink>
            <button onClick={props.logout}>Logout</button>
        </div>
    )
}