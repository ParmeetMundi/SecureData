import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase.js'

export const AuthContext = createContext();


export const CurrentAuth = ({ children }) => {

    const [currentUser, setCurrentUser] = useState("null");

    useEffect(() => {



        const saved_email = window.localStorage.getItem('savedEmail');
        if (auth.isSignInWithEmailLink(window.location.href) && !!saved_email) {
            auth.signInWithEmailLink(saved_email, window.location.href)
            setCurrentUser(auth.currentUser);

        }


    }, [])

    useEffect(() => {

        auth.onAuthStateChanged(setCurrentUser);


    }, [])

    return <AuthContext.Provider value={{ "currentUser": currentUser }}>
        {children}
    </AuthContext.Provider>;
}


export default CurrentAuth;