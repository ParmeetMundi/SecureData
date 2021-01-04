const newUSer = require('../models/newUser');
const route=require('express').Router();

//add folder
route.post('/createFolder',async(req,res)=>{
    try{

    const doc=await newUSer.findById(req.body.id); 
    if(doc===null){
        res.send("No User");
        return;
    }  
    const folderName=req.body.folderName;
    const folder={"folderName":folderName,};
     
     //Entery  in folders
     doc.folders.push(folderName);
     
    //Entery in storageFolders
    doc.storageFolders.push(folder);
    const result=await doc.save();
    res.json(result);
    console.log(result)
    }catch(e){
        res.send(e);
    }  

})


// delete folder given id and folderName
route.delete('/deleteFolder',async(req,res)=>{
     try{
        const doc=await newUSer.findById(req.body.id); 
    if(doc===null){
        res.send("No User");
        return;
    }  
    const folderName=req.body.folderName;

    const index=doc.folders.indexOf(folderName);
    if(index>-1){
        await doc.folders.splice(index,1);
        await doc.storageFolders.splice(index,1);
        await doc.save();
        res.json(await doc.folders)
    }else{
        res.send("No Folder Found");
    }


     }catch(e){
         console.log(e)
     }

})



//get all folders for particular id
route.get('/folders/',async(req,res)=>{
     try{
        const doc=await newUSer.findById(req.query.id);
        res.json(await doc.folders);
        
     }catch(e){
         res.send(e);
     } 

})



//get files in folder given id folderName

route.get('/folder/files',async(req,res)=>{
   try{
     const doc=await newUSer.findById(req.query.id)
     if(doc===null)
     throw "No User"

     const index=await doc.folders.indexOf(req.query.folderName)
     if(index<0)
     throw "No Folder"
     
     const files=await doc.storageFolders[index].file
     res.json(files);
     
   }catch(err){
       res.send(err)
   }

})





module.exports=route;