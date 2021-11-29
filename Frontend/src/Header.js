import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './css/Header.css'
import DehazeIcon from '@material-ui/icons/Dehaze';
import { Avatar, Button } from '@material-ui/core';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import StorageIcon from '@material-ui/icons/Storage';
import SideBar from './SideBar'
import safeSender from './images/safeSender.png'
import SignIn from './SignIn'
import NewUserForm from './NewUserForm'
import { AuthContext } from './CurrentAuth'
import { auth } from './firebase'

const Header = () => {
  const [open, setState] = useState(false);
  const [signin, stateSignIn] = useState(false);
  const [newUserForm, setNewUserForm] = useState(false);
  const history = useHistory()
  const { currentUser } = useContext(AuthContext);

  const closeSignIn_form = () => {
    stateSignIn(false);
  }

  const signInOpen = () => {
    if (newUserForm === true && signin === false) {
      setNewUserForm(false);
    }
    stateSignIn(!signin);
  }

  const newUser = () => {
    stateSignIn(false);
    setNewUserForm(!newUserForm);
  }

  const signOut = () => {
    auth.signOut();
    history.replace('/')

  }

  const disable = (event) => {

    if (currentUser === null) {
      event.preventDefault();
      alert("Sign In to use this service")
    }
  }


  const closeSideBar = () => {
    setState(!open);
  }

  return <div className="header">

    <div className="header_left">
      <Button className="header_sidebar" onClick={() => { setState(!open); }}><DehazeIcon fontSize="large" /></Button>
    </div>





    <SideBar class={open === true ? "sideBar active" : "sideBar"}
      remaining={open === true ? "remainScreen" : ""}
      signIn={signInOpen}
      closeSideBar={closeSideBar}
    />







    <div className="header_center">
      <Link to="/" className="logoLink">
        <img src={safeSender} alt="logo" className="logo img-fluid" />
      </Link>
    </div>









    <div className="header_right">

      <Link to="/encryptData" className="link" onClick={disable}>
        <div className="encrypt"><EnhancedEncryptionIcon fontSize="large" />Encrypt</div>
      </Link>


      <Link to="/storage" className="link" onClick={disable}>
        <div className="storage"><StorageIcon fontSize="large" /> Storage</div>
      </Link>

      {currentUser === null ? <Button className="signup_button" onClick={() => { stateSignIn(!signin); setNewUserForm(false); }}>
        <div className="signup"> <Avatar /> Sign In</div>
      </Button>
        :
        <Button className="signOut_button" onClick={signOut}>
          <div className="signOut"> <Avatar /> Sign Out</div>
        </Button>

      }



      {/* ====================Forms================= */}

      {signin === true ? <SignIn close={closeSignIn_form} openSignUp={newUser} /> : null}

      {newUserForm === true ? <NewUserForm close={newUser} /> : null}

    </div>


  </div>;
}


export default Header;