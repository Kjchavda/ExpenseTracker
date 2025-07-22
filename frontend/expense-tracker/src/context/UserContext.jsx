import React, { createContext, useState } from 'react'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    //function to update user data
    const updateUser= (userData) => {
        setUser(userData);
    }

    const clearUser = () => {
        setUser(null);
    }

    return (
    <UserContext.Provider 
    value={{
        user,
        updateUser,
        clearUser,
    }}
    >
        {console.log("UserContext: user =", user)}
        {children}

    </UserContext.Provider>
  )
}

export default UserProvider;

