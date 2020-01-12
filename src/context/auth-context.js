import React from 'react'

// Create a global context for managing authentication
export default React.createContext({
    token:null,
    userId:null,
    login: (token, userId, tokenExpiration) => {},
    logout: ()=> {}
})