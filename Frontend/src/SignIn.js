import React, { useState } from 'react';
import './css/SignIn.css';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { auth } from './firebase.js'
// import { AuthContext } from './CurrentAuth';

const SignIn = (props) => {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");


    const updateEmail = (event) => {
        setemail(event.target.value);

    }





    const updatePassword = (event) => {
        setpassword(event.target.value);

    }





    const enterSignIn = (event) => {
        event.preventDefault();


        const saved_email = window.localStorage.getItem('savedEmail');

        const errormessage = document.getElementById("error");
        errormessage.innerHTML = "";
        try {
            if (auth.isSignInWithEmailLink(window.location.href) && !!saved_email) {
                auth.signInWithEmailLink(saved_email, window.location.href)
                props.close();
            } else {

                auth.signInWithEmailAndPassword(email, password)
                    .then(() => { props.close(); })
                    .catch((error) => {

                        errormessage.innerHTML = error;


                    });

            }
        } catch (error) {

            console.log(error);
        }

    }


    //    const forgetPassword=()=>{


    //     const errormessage=document.getElementById("error");
    //            auth.sendPasswordResetEmail(email,{
    //                  url:"http://localhost:3000",
    //                  handleCodeInApp: true
    //              }).then(()=>{
    //                  alert("Reset Password Link is sent to your email");
    //                  errormessage.innerHTML="";
    //              }).catch((error)=>{
    //                 errormessage.innerHTML=error;
    //              })
    //    }





    return <div className="signIn-form">

        <form className="form">
            <fieldset className="fieldset">
                <legend>Sign In</legend>

                <label forhtml="emailSignIn">Email address</label>
                <input type="email" id="emailSignIn" required placeholder="Enter email" value={email} onChange={updateEmail} /><br /><br />



                <label forhtml="passwordSignIn">Password</label>
                <input type="password" id="passwordSignIn" minLength="6" placeholder="Enter password" value={password} onChange={updatePassword} />
                <p id="error"></p>
                <br />

                <div>
                    <Button variant="outlined" type="submit" className="enter_signIn" onClick={enterSignIn}>Enter</Button>
                    {/* <Button variant="outlined" className="forget_password" onClick={forgetPassword}>Forget Password</Button> */}
                </div>

                <div>
                    <Button variant="outlined" className="new_user" onClick={props.openSignUp}>create account</Button>
                </div>
            </fieldset>

        </form>

        <Button className="close_sign_form" onClick={props.close}><CloseIcon /></Button>

    </div>;
}

export default SignIn;