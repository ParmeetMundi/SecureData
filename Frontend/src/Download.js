import React, { useState, useContext, useEffect } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import './css/Download.css'
import { AuthContext } from './CurrentAuth';
import axios from 'axios'
import { LinearProgress } from '@material-ui/core';
import firebase from "firebase/app";
const crypto = require('crypto');


window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

const Download = (props) => {

  const [download, setdownload] = useState(false)
  const [Delete, setDelete] = useState(false)
  const [progessBarvalue, setprogessBar] = useState(0)
  const [passwordCheck, setpasswordCheck] = useState(false)
  const [password, setpassword] = useState()
  const [error, seterror] = useState()//wrong password
  const [showProgressBar, setshowProgressBar] = useState(false)
  let { currentUser } = useContext(AuthContext)
  let NoOfChunks, iv, encryptedData, key, currentChunk = 1, decipher, fileSize, decryptedData, fileCreated = false//url in localFileSystem


  useEffect(() => {

    return () => {
      window.webkitRequestFileSystem(1, 0, (fs) => {

        fs.root.getFile(props.file, {}, function (fileEntry) {

          fileEntry.remove(function () {
            console.log('File removed.');
          }, onError);

        }, onError);

      }, onError);

    }

  }, [])

  //start will first collect fs details
  const startDownload = async () => {

    await axios.get("http://localhost:8080/GetFile/fileDetails", {
      params: {
        id: currentUser.uid,
        fileName: props.file,
        folderName: props.folderName
      }
    }).then(res => {
      NoOfChunks = res.data.NoOfChunks;
      fileSize = res.data.fileSize;
      console.log(NoOfChunks)
      console.log(fileSize)
      firstChunk()
    }).catch(err => {
      alert(err)
    })


  }

  const onError = (err) => {
    console.log(err)
  }





  //first chunk for taking out iv vector and aes key
  const firstChunk = async () => {

    await axios.get("http://localhost:8080/GetFile/", {
      params: {
        id: currentUser.uid,
        fileName: props.file,
        folderName: props.folderName,
        chunkNumber: 1
      }
    }).then(res => {
      let size = res.data.length;
      iv = res.data.data.substring(0, 32);
      key = res.data.data.substring(32, 96);
      console.log(iv)
      console.log(key)
      encryptedData = res.data.data.substring(96, size);
      decryptKey()
    }).catch(err => { alert(err) })


  }


  const regularChunk = async () => {

    await axios.get("http://localhost:8080/GetFile/", {
      params: {
        id: currentUser.uid,
        fileName: props.file,
        folderName: props.folderName,
        chunkNumber: currentChunk
      }
    }).then(res => {
      encryptedData = res.data.data
      decryptData()
    }).catch(err => { alert(err) })

  }

  const decryptKey = () => {

    crypto.pbkdf2(password, 'salt', 100000, 16, 'sha512', (e, masterkey) => {
      if (e) throw e;

      try {
        const mykey = crypto.createDecipheriv('aes-128-cbc', masterkey, Buffer.from(iv, "hex"));
        key = mykey.update(key, 'hex', 'hex')
        key += mykey.final('hex');
        decryptData()

      } catch (e) {
        alert(e);
      }
    })

  }

  const lastChunk = async () => {
    decryptedData = await decipher.final('hex')



    const onFs = (fs) => {
      fs.root.getFile(props.file, { create: false }, function (fileEntry) {


        fileEntry.createWriter(async (fileWriter) => {

          await fileWriter.seek(fileWriter.length); // Start write position at EOF.

          await fileWriter.write(new Blob([Buffer.from(decryptedData, 'hex')]));


          fileWriter.onwrite = function (e) {

            setprogessBar(100)
            const a = document.createElement("a")
            a.href = fileEntry.toURL()
            a.download = props.file
            a.click()

            console.log('Write completed.');
          };





        }, onError);

      }, onError);
    }


    window.webkitRequestFileSystem(1, 500 * 1024, onFs, onError);

  }


  const appendDataInFile = async (data) => {

    const append = (fs, blob) => {
      fs.root.getFile(props.file, { create: false }, function (fileEntry) {

        fileEntry.getMetadata(function (metadata) {
          console.log(metadata.size);
          console.log(currentChunk)
        }, onError)


        fileEntry.createWriter(async (fileWriter) => {

          await fileWriter.seek(fileWriter.length); // Start write position at EOF.
          await fileWriter.write(blob);


          fileWriter.onwrite = function (e) {
            setprogessBar((currentChunk / NoOfChunks) * 100)

            currentChunk++
            if (currentChunk <= NoOfChunks) {
              regularChunk()
            } else {
              lastChunk()
            }

          };





        }, onError);

      }, onError);
    }

    const onFs = (fs) => {
      append(fs, new Blob([Buffer.from(data, 'hex')]));
    }

    window.webkitRequestFileSystem(1, 500 * 1024, onFs, onError);

  }


  const decryptData = async () => {
    try {

      if (currentChunk === 1) {
        //createDecipher
        decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, "hex"), Buffer.from(iv, "hex"));

        //create file
        const onFs = async (fs) => {

          fs.root.getFile(props.file, { create: true }, async (fileEntry) => {
            //call when file is created
            decryptedData = await decipher.update(encryptedData, 'hex', 'hex')
            await appendDataInFile(decryptedData)
          }, onError);

        }



        navigator.webkitPersistentStorage.queryUsageAndQuota(
          function (usedBytes, grantedBytes) {


            navigator.webkitPersistentStorage.requestQuota(
              fileSize + usedBytes + 500 * 1024, function (grantedBytes) {
                if (fileSize + usedBytes + 500 * 1024 > grantedBytes) {
                  alert("Less Space available")
                } else
                  window.webkitRequestFileSystem(1, 1 * 1024, onFs, onError);
              })



          },
          function (e) { console.log('Error', e); }
        );

      }


      //decrypt and write in file 

      else {
        decryptedData = await decipher.update(encryptedData, 'hex', 'hex')
        await appendDataInFile(decryptedData)
      }


    } catch (err) {
      alert(err)
    }
  }



  const checkPassword = () => {

    let cred = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      password
    )

    currentUser.reauthenticateWithCredential(cred).then(() => {
      setpasswordCheck(true)
      startDownload()
    }).catch(() => {
      seterror("error: Wrong Password")
    })

  }


  const stopDownloading = () => {
    setdownload(false)
    props.close()
  }

  const deleteFile = () => {
    setshowProgressBar(true)

    axios.delete("http://localhost:8080/GetFile/deleteFile", {
      data: {
        id: currentUser.uid,
        fileName: props.file,
        folderName: props.folderName
      }
    }).then(res => {

      setshowProgressBar(false)
      props.close()
      if (res.data !== "file Deleted") {
        throw res.data
      }
      alert("File Deleted")
      props.refreshFilesOnDelete()

    }).catch(err => {
      alert(err)
      props.close()
      setshowProgressBar(false)
    })



  }

  return <div className="DownloadComponent">

    {
      download === false && Delete === false ? <div className="OptionForm">
        <h3>Options</h3>
        <p>File:{props.file}</p>
        <Button className="downloadInnerButtons" onClick={() => { setdownload(true); }}>Download</Button>
        <Button className="downloadInnerButtons" onClick={() => { setDelete(true); deleteFile() }}>Delete</Button>
        <Button className="downloadInnerButtons" onClick={props.close}>Close</Button>
      </div> : null}

    {showProgressBar === true ? <CircularProgress /> : null}

    {/* html same as Upload Component  */}
    {download === true ? <div className="downloadForm">
      <h1>Download File</h1><br />
      <p>File to Download : {props.file}</p><br />

      {passwordCheck === false ?
        <div>
          <label htmlFor="password">Password :&nbsp;</label>
          <input type="password" id="password" value={password} onChange={(e) => { setpassword(e.target.value) }} placeholder="Enter Account Password" />
          <p>{error}</p>
          <Button className="downloadInnerButtons" onClick={checkPassword}>Start Downloading</Button><br />
        </div> : null}

      <br />

      <LinearProgress value={progessBarvalue} variant="determinate" className="progressBar"></LinearProgress>

      <p>{progessBarvalue}%<br />
        {progessBarvalue === 100 ? "File Downloaded" : null}</p>
      <Button className="downloadInnerButtons" onClick={stopDownloading}  > Close </Button>

    </div> : null}



  </div>;
}



export default Download;