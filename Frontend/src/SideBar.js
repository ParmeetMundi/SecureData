import React, { useContext } from 'react';
import './css/SideBar.css'
import { Button, Avatar } from '@material-ui/core';
import { AuthContext } from './CurrentAuth'
import { Link } from 'react-router-dom';
import StorageIcon from '@material-ui/icons/Storage';
import DeleteIcon from '@material-ui/icons/Delete';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';

const SideBar = (props) => {
    const { currentUser } = useContext(AuthContext)

    const deleteAccount = () => {
        currentUser
            .delete()
            .catch((error) => {
                alert(error);
            });
    }

    const disable = () => {

        if (currentUser === null) {

            alert("Sign In to use this service")
        }
    }


    return <div>
        <div className={props.class}>

            {currentUser === null ?
                <div onClick={props.signIn} className="button" >
                    <Avatar className="avatar" />Sign In
         </div>
                :
                <div className="userInfo">
                    <Avatar className="avatar" /> <p className="name">{currentUser.displayName}</p>

                </div>
            }



            <Link to={currentUser !== null ? "/storage" : "#"} className="sideBar_storage" onClick={disable}>
                <StorageIcon fontSize="large" className="storageIcon" />
                <span>Storage</span>
            </Link>


            <Link to="/encryptData" className="encryptFiles" onClick={disable}>
                <EnhancedEncryptionIcon id="EnhancedEncryptionIcon" fontSize="large" /><span> Encrypt </span>
            </Link>

            {currentUser !== null ?
                <div onClick={deleteAccount} className="button">
                    <DeleteIcon className="deleteIcon" /> Delete Account
          </div>
                :
                null
            }


        </div>


        <div className={props.remaining} onClick={props.closeSideBar}>


        </div>


    </div>;
}


export default SideBar;