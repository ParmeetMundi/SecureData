import React, { useState, useContext, useEffect } from 'react';
import crypto, { randomBytes } from 'crypto';
import { AuthContext } from './CurrentAuth';
import axios from 'axios'
import { Button, LinearProgress } from '@material-ui/core';
import './css/Upload.css'
import firebase from "firebase/app";


const Upload = (props) => {

  const [progessBarvalue, setprogessBar] = useState(0)
  const [passwordCheck, setpasswordCheck] = useState(false)
  const [password, setpassword] = useState()
  const [error, seterror] = useState()//wrong password
  let { currentUser } = useContext(AuthContext)

  // variables used to upload file 
  let chunkSize = 500 * 1024;
  let NumberOfChunks, fileSize, currentChunk = 1, start = 0, end = chunkSize, encrypted = "", data;
  let key, iv, cipher, dipher, upload = false


  useEffect(() => {
    //cleanup function
    return () => {
      upload = false
    }


  }, [])

  const startUpload = () => {
    setpasswordCheck(true)
    upload = true
    fileSize = props.file.size;
    if (fileSize % chunkSize == 0)
      NumberOfChunks = fileSize / chunkSize;
    else
      NumberOfChunks = (Number)(fileSize / chunkSize) + 1;


    axios.post("/uploadFile/fileDetails", {
      id: currentUser.uid,
      fileName: props.file.name,
      chunkSize: chunkSize,
      fileSize: fileSize,
      folderName: props.folderName,
      NoOfChunks: (NumberOfChunks + 1)//numberOfChunks + 1=> because one chunk finalone cipher.final 
      // not increase NumberOfChunk variable because we do not readnextBytes last time 
    }).then(res => {
      if (res.data === "OK") {
        currentChunk = 1;
        start = 0
        end = chunkSize
        key = crypto.randomBytes(16);
        iv = crypto.randomBytes(16);
        cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

        readnextBytes();
      } else
        throw res.data

    }).catch(err => {
      console.log(err);
      alert(err)
    })

  }

  const uploadFile = async (data) => {
    //in first chunk we send iv and aes key
    if (currentChunk < 2) {

      //adding iv vector 
      encrypted = await iv.toString('hex')

      //generation 128bit=>16bytes key from master key=> password
      crypto.pbkdf2(password, 'salt', 100000, 16, 'sha512', (e, masterkey) => {
        if (e) {
          alert(e)
          return
        }
        const inside = async () => {


          //encrypting aes key with master key and adding at end
          const keyCipher = crypto.createCipheriv('aes-128-cbc', masterkey, iv);
          encrypted += keyCipher.update(key, ArrayBuffer, "hex");

          encrypted += keyCipher.final("hex");


          encrypted += await cipher.update(Buffer.from(data), ArrayBuffer, "hex");


          await axios.post("/uploadFile", {
            id: currentUser.uid,
            fileName: props.file.name,
            chunkNumber: currentChunk,
            data: encrypted,
            folderName: props.folderName

          }).then(res => {
            if (res.data === "OK") {
              currentChunk++;
              readnextBytes();
            } else
              throw res.data

          }).catch(err => {
            console.log(err);
            //uploadFile(data)
          })
        }


        inside()
      })
    }
    else {
      encrypted = await cipher.update(Buffer.from(data), ArrayBuffer, "hex");


      await axios.post("/uploadFile", {
        id: currentUser.uid,
        fileName: props.file.name,
        chunkNumber: currentChunk,
        data: encrypted,
        folderName: props.folderName
      }).then(res => {
        if (res.data === "OK") {
          currentChunk++;
          readnextBytes();
        } else
          throw res.data

      }).catch(err => {
        console.log(err);
        //uploadFile(data)
      })

    }

  }

  // last chunk
  const finalUpload = async () => {




    axios.post("/uploadFile/lastChunk", {
      id: currentUser.uid,
      fileName: props.file.name,
      chunkNumber: currentChunk,
      data: encrypted,
      folderName: props.folderName
    }).then(res => {
      if (res.data === "File Uploaded") {
        setprogessBar(100)
      } else
        throw res.data

    }).catch(err => {
      console.log(err);
      //finalUpload()
    })



  }



  const readnextBytes = async () => {

    if (upload)
      setprogessBar(((currentChunk - 1) / NumberOfChunks) * 100)

    if (currentChunk <= NumberOfChunks && upload) {
      let chunk = props.file.slice(start, end);
      data = await chunk.arrayBuffer();
      start = end;
      end = end + chunkSize;
      if (upload)
        uploadFile(data);
    } else if (upload) {


      encrypted = cipher.final("hex");
      if (upload)
        finalUpload();

    }
  }


  const stopuploading = () => {
    if (progessBarvalue !== 100) {
      //delete file that is not completely uploaded => in this we donot wait for resopnse
      console.log("delete")
      axios.delete('/uploadFile/deleteFile', {
        data: {
          id: currentUser.uid,
          fileName: props.file.name
        }
      })
    }
    props.uploadDone()
  }

  const checkPassword = () => {
    let cred = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      password
    )

    currentUser.reauthenticateWithCredential(cred).then(() => {
      startUpload()
    }).catch(() => {
      seterror("error: Wrong Password")
    })

  }



  return <div className="uploadFile">
    <h1>Upload File</h1><br />
    <p>File to Upload : {props.file.name}</p><br />

    {passwordCheck === false ?
      <div>
        <label htmlFor="password">Password :&nbsp;</label>
        <input type="password" id="password" value={password} onChange={(e) => { setpassword(e.target.value) }} placeholder="Enter Account Password" />
        <p>{error}</p>
        <Button className="uploadInnerButtons" onClick={checkPassword}>Start Uploading</Button><br />
      </div> : null}

    <br />

    <LinearProgress value={progessBarvalue} variant="determinate" className="progressBar"></LinearProgress>

    <p>{progessBarvalue}%<br />
      {progessBarvalue === 100 ? "File Uploaded" : null}</p>
    <Button className="uploadInnerButtons" onClick={stopuploading}  > Close </Button>
  </div>;
}



export default Upload;