import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import './css/TextInput.css';
const crypto = require('crypto');

const TextInput = () => {

    const [info, setinfo] = useState({
        password: "",
        confirmPassword: "",
        textToEncrypted: ""
    })


    const encryptText = () => {
        if (info.confirmPassword.length === 0 || info.password.length === 0 || info.textToEncrypted.length === 0) {
            alert("Enter required data");
            return;
        }
        else if (info.confirmPassword !== info.password) {
            alert("Recheck your passwords");
            return;
        }


        try {
            let iv = crypto.randomBytes(16);



            //this function take some time as 100000 => to generate hash 
            crypto.pbkdf2(info.password, 'salt', 100000, 16, 'sha512', (e, k) => {
                if (e) throw e;


                const mykey = crypto.createCipheriv('aes-128-cbc', k, iv);
                let encrypted = mykey.update(info.textToEncrypted, 'utf8', 'hex')
                encrypted += mykey.final('hex');
                encrypted = iv.toString("hex") + encrypted;
                document.getElementById("encryptDecryptText").value = encrypted;
                setinfo({ ...info, ["textToEncrypted"]: encrypted });

            })



        } catch (e) {
            alert(e);
        }


    }

    const decryptText = () => {
        if (info.confirmPassword.length === 0 || info.password.length === 0 || info.textToEncrypted.length === 0) {
            alert("Enter required data");
            return;
        }
        else if (info.confirmPassword !== info.password) {
            alert("Recheck your passwords");
            return;
        }


        try {

            let size = info.textToEncrypted.length;
            let iv = info.textToEncrypted.substring(0, 32);
            let encrypted = info.textToEncrypted.substring(32, size);



            crypto.pbkdf2(info.password, 'salt', 100000, 16, 'sha512', (e, k) => {
                if (e) throw e;

                try {
                    const mykey = crypto.createDecipheriv('aes-128-cbc', k, Buffer.from(iv, "hex"));
                    let decrypted = mykey.update(encrypted, 'hex', 'utf8')
                    decrypted += mykey.final('utf8');

                    document.getElementById("encryptDecryptText").value = decrypted;
                    setinfo({ ...info, ["textToEncrypted"]: decrypted });
                } catch (e) {
                    alert(e);
                }
            }
            )


        } catch (e) {
            alert(e);
        }



    }

    const dataChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setinfo((info) => ({ ...info, [name]: value }))


    }


    return <div className="input">

        <textarea rows="10" cols="40"
            placeholder="Enter Text to Encrypt or Decrypt For Encrypting Videos and other Data Sign in first"
            onChange={dataChange}
            value={info.textToEncrypted}
            name="textToEncrypted"
            id="encryptDecryptText"
        />


        <div className="options">

            <input type="password" value={info.password} name="password" placeholder="Enter Password" onChange={dataChange} />

            <input type="password" value={info.confirmPassword} name="confirmPassword" placeholder="Confirm Password" onChange={dataChange} />

            <Button onClick={encryptText}>Encrypt</Button>
            <Button onClick={decryptText}>Decrypt</Button>
        </div>
    </div>;
}



export default TextInput;