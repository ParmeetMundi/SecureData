import React from 'react';
import './css/Info.css';
import TextInput from './TextInput'


const Info = () => {
   return <div className="info">
      <div className="info-inner">
         <p><h1><span>AES 128</span></h1> <br />
       The National Security Agency (NSA), as well as other governmental bodies,<br />
       utilize AES encryption and keys to protect classified or other sensitive information</p>

         <ul>
            <h1>What SecureData Provide?</h1>
            <li>Store Private and Secret Information like Passwords, Documents, Images etc.</li>
            <li>Send Data safely</li>
            <li>Encrypt And Decrypt Data</li>
         </ul>
      </div>

      <div>
         <TextInput />
      </div>



   </div>;
}

export default Info;