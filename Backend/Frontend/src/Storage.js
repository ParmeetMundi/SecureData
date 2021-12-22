import React, { useState, useEffect, useContext } from 'react';
import './css/Storage.css';
import storageimage from './images/storage.png'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import { Button, CircularProgress } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import { Link } from 'react-router-dom';
import axios from 'axios'
import DeleteIcon from '@material-ui/icons/Delete';
import { AuthContext } from './CurrentAuth'

const Storage = () => {



  const [Folders, setFolders] = useState([])
  const [newFolder, setnewFolder] = useState("")
  const [folderToDelete, setfolderToDelete] = useState("")
  const { currentUser } = useContext(AuthContext)
  const [progressBar, setprogressBar] = useState(true)

  //create New Folder
  const createFolder = () => {
    if (currentUser === null) { return }

    if (newFolder.length === 0) {
      alert("Enter Folder Name");
    }
    else if (Folders.indexOf(newFolder) !== -1) {
      alert("Change Name of Folder");
    } else {
      axios.post("/storage/createFolder", {
        folderName: newFolder,
        id: currentUser.uid
      })
        .then(res => {

          if (res.data === "No User")
            throw res.data;

          setFolders([...Folders, newFolder]);
          setnewFolder("")

        })
        .catch(err => {
          console.log(err)
        })


    }
  }

  //load Folders
  useEffect(() => {

    if (currentUser !== null)
      axios.get("/storage/folders/", {
        params: {
          id: currentUser.uid
        }
      })
        .then(res => {
          setprogressBar(false)
          setFolders(res.data);
        })
        .catch(err => {
          alert(err)
          setprogressBar(false)
          console.log(err)
        })

  }, [currentUser])


  //delete Folder
  const deleteFolder = () => {

    if (currentUser === null) { return }

    if (Folders.indexOf(folderToDelete) < 0) {
      alert("No such Folder")
      return
    }


    axios.delete("/storage/deleteFolder", {
      data: {
        folderName: folderToDelete,
        id: currentUser.uid
      }
    }).then(res => {
      if (res.data === "No User" || res.data === "No Folder Found")
        throw res.data;

      setFolders(res.data);
    }).catch(err => console.log(err));


  }



  // render folders 
  const renderFolder = () => {
    return (<div id="foldersRow">
      {
        Folders.map(value => {
          return <Link to={"/storage/" + value} className="folderLink">
            <FolderIcon id="folders" fontSize="large" />
            <p>{value}</p>
          </Link>
        })
      }
    </div>);
  }

  return <div>

    <div className="storageOptions">


      <div>
        <input placeholder="Create New Folder" value={newFolder} onChange={(e) => { setnewFolder(e.target.value) }} />
        <Button title="Create Folder" id="folderButton" onClick={createFolder}> <CreateNewFolderIcon fontSize="large" /> </Button>
      </div>

      <div >
        <input placeholder="Enter Folder Name" value={folderToDelete} onChange={(e) => { setfolderToDelete(e.target.value) }} />
        <Button title="Delete Folder" id="folderButton" onClick={deleteFolder}> <DeleteIcon fontSize="large" /> </Button>
      </div>


    </div>

    <div className="storageBody" >

      {progressBar === true ? <CircularProgress className="progressBar" /> : null}

      {renderFolder()}

      <img src={storageimage} className="img-fluid" alt="storage" />

    </div>


  </div>;
}


export default Storage;