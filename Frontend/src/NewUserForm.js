import React, { useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import './css/NewUserForm.css';
import { auth } from './firebase'
import axios from 'axios'
import CloseIcon from '@material-ui/icons/Close';

const NewUserForm = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const createAccount = (event) => {
        const errorMessage = document.getElementById("newerror");
        event.preventDefault();

        if (confirmPassword !== password) {
            errorMessage.innerHTML = "Error:Password do not match";
        }
        else if (password.length < 6) {
            errorMessage.innerHTML = "Error:Minimum Password length should be 6";
        } else if (name.length === 0) {
            errorMessage.innerHTML = "Error:Enter Name";
        }
        else {

            try {
                // auth.sendSignInLinkToEmail(email,{
                //     url:"http://localhost:3000",
                //     handleCodeInApp: true
                //  }).then(()=>{
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        const user = auth.currentUser;
                        window.localStorage.setItem("savedEmail", email);
                        user.sendEmailVerification()



                        axios.post("http://localhost:8080/newUser", {
                            name: name,
                            id: user.uid
                        }).then(res => {
                            if (res.data === "ok") {
                                props.close();
                                user.updateProfile({
                                    displayName: name
                                })
                            } else {
                                user.delete();
                                alert("Some Thing Went Wrong")
                            }

                        }).catch((error) => {
                            errorMessage.innerHTML = error;
                            user.delete();
                        })

                        //    alert("Verification Email is sent to registerd email,Please verify within 5 minutes other wise your account will be Deleted")
                    })
                    .catch((error) => {
                        errorMessage.innerHTML = error;
                    });


            } catch (error) {
                console.log(error);
            }

        }

    }


    return <div className="newAccount">
        <form className="form">
            <fieldset>
                <legend>Create Account</legend>
                <div className="avatar_name">
                    <Avatar className="avatar" />
                    <input type="name" id="name" placeholder="Name" value={name} onChange={(event) => { setName(event.target.value) }} />
                </div>

                <input type="file" accept="image/jpeg, image/png" name="image" id="file" />



                <label forhtml="email">Enter Email</label>
                <input id="email" placeholder="Enter Email" required type="email" required value={email} onChange={(event) => { setEmail(event.target.value) }} />
                <br />

                <label forhtml="password">New Password</label>
                <input id="password" placeholder="Password" type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} />
                <br />

                <label forhtml="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value) }} />
                <p id="newerror"></p>
                <br />

                <Button type="submit" className="enter_newUser" onClick={createAccount} >Create</Button>

            </fieldset>
        </form>
        <Button className="close_newUser_form" onClick={props.close}><CloseIcon /></Button>

    </div>;
}



export default NewUserForm;