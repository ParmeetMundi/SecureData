import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Button } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import axios from 'axios'
import './css/Files.css'
import { AuthContext } from './CurrentAuth';
import Upload from './Upload'
import Download from './Download'

const Files = () => {

    const params = useParams();
    const [Files, setFiles] = useState([])
    const [file, setfile] = useState(null)
    const [fileRefresh, setfileRefresh] = useState(0) //only change when file is uploaded to refresh files
    const [uploading, setuploading] = useState(false)
    const [showoptions, setshowoptions] = useState(false)
    const [fileToDownload, setfileToDownload] = useState("")
    let { currentUser } = useContext(AuthContext)

    useEffect(() => {

        if (currentUser === "null")
            return

        axios.get("http://localhost:8080/storage/folder/files", {
            params: {
                id: currentUser.uid,
                folderName: params.folderName
            }
        }).then(res => {
            if (res.data === "No user" || res.data === "No Folder")
                throw res.data

            setFiles(res.data)
        }).catch(err => { console.error(err) })

    }, [currentUser, fileRefresh])


    const options = (file) => {
        setfileToDownload(file)
        setshowoptions(true)
    }


    const closeoptions = () => {
        setshowoptions(false)
    }


    const renderFiles = () => {

        return (<div className="fileBody">
            {
                Files.map(value => {
                    return <Button onClick={() => { options(value) }} className="optionsButton" >
                        <div className="file">
                            <InsertDriveFileIcon fontSize="large" className="fileIcon" />
                            <p>{value}</p>
                        </div>
                    </Button>
                })
            }
        </div>)

    }


    //upload file
    const upload = async () => {
        if (file === null) {
            alert("Select File")
            return
        }
        setuploading(true)
    }


    const uploadingDone = () => {

        setfileRefresh(fileRefresh + 1)
        setuploading(!uploading)
    }

    const doFileRefresh = () => {
        setfileRefresh(fileRefresh + 1)
    }

    return <div>
        {/*========= upload file option ========== */}
        <div className="fileOptions">
            Upload File &nbsp;
            <input type="file" onChange={(e) => { setfile(e.target.files[0]) }} />
            <Button className="uploadButton" onClick={upload}> <CloudUploadIcon className="uploadIcon" fontSize="large" /> </Button>

        </div>


        {renderFiles()}

        {/* options to delete or download File */}

        {showoptions === true ? <Download file={fileToDownload} refreshFilesOnDelete={doFileRefresh} folderName={params.folderName} close={closeoptions} /> : null}


        {uploading === true ? <Upload uploadDone={uploadingDone} file={file} folderName={params.folderName} /> : null}


    </div>;
}

export default Files;