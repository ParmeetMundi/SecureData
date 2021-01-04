import React, { useState } from 'react';
import './css/Encrypt.css'
import { Button } from '@material-ui/core';
//import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';




const Encrypt = () => {

  const [filetype, setfiletype] = useState("")

  const chooseFile = (type) => {
    setfiletype(type);
    document.getElementById("upload").disabled = false;

  }

  return <div className="centerEncryptComponent">

    <div className="encryptComponent">

      {/* ========choose file type============== */}

      <div className="fileType">
        <p >Select File Type</p>
        <Button onClick={() => { chooseFile("video/*") }}>Video</Button>
        <Button onClick={() => { chooseFile(".jpg") }}>Image</Button>
        <Button onClick={() => { chooseFile(".pdf") }}>Pdf File</Button>
      </div>


      <br />

      {/* ==========upload file================ */}

      <div className="uploadButton">
        <input id="upload" type="file" accept={filetype} disabled={true} />
        <p id="displayType">{filetype}</p>
      </div>


      <br />

      {/* ==============password for encryption================ */}

      <div className="encryptionPassword">

        <p>Enter Encryption Password or<br />
             You can choose your default password</p>
        <input type="password" placeholder="Enter password" />
        <br />
        <p>OR</p>

        <div >
          <label htmlFor="defaultPassword">Choose default password </label>
          <input type="checkbox" id="defaultPassword" />
        </div>
        {/* <Button>choose default Password</Button> */}
      </div>



    </div>


    <Button id="startEncrypt" size="large">Encrypt</Button>

  </div>;
}


export default Encrypt;