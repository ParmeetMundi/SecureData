const route=require('express').Router()
const Chunk=require('../models/uploadChunks');
const newUser=require('../models/newUser');
const File=require('../models/fileDetails');



//this will called first time when uploading starts
route.post('/fileDetails',async(req,res) =>{
  try{
    const fs=await File.findById(req.body.id);
  
  if(fs===null)
  {res.send("No User")
   return }         
   
  const newfile={
    "name":req.body.fileName,
    "size":req.body.fileSize,
    "chunkSize":req.body.chunkSize,
    "NoOfChunks":req.body.NoOfChunks,
    "folderName":req.body.folderName,
    "uploadedChunks":0 
  }

   await fs.files.push(newfile)
   await fs.save()
   
   res.send("OK")
  }catch(err){
    res.send(err)
  }

})



route.post('/',async(req,res)=>{
   
 try{
   
     const fs=await File.findById(req.body.id);

     if(fs===null)
    {res.send("No User")
     return }

    const chunk= new Chunk({
            "id":req.body.id,
            "chunkNumber":req.body.chunkNumber,
            "data":req.body.data,
            "folderName":req.body.folderName,
            "name":req.body.fileName
          })

    await chunk.save();

    await fs.files.find((o,i)=>{
        if(o.name===req.body.fileName){
        fs.files[i].uploadedChunks++;
        return 
      }
    }) 

    await fs.save() 
   
    res.json("OK");
  
  }catch(err){
    console.log(err)
    res.send(err)
  }

});




//last chunk we will also have folder name
// this time we will save in newUser = profile 
route.post('/lastChunk',async(req,res)=>{
    try{
      const profile=await newUser.findById(req.body.id);
      const fs=await File.findById(req.body.id);
     

      if(fs===null)
       {res.send("No User")
      return }

      const chunk= new Chunk({
        "id":req.body.id,
        "chunkNumber":req.body.chunkNumber,
        "data":req.body.data,
        "folderName":req.body.folderName,
        "name":req.body.fileName
      })

      await chunk.save();
      
    //  const uploadedFile={
    //    "fileName":req.body.fileName
    //  }


       await profile.storageFolders.find((o,i)=>{
              if(o.folderName===req.body.folderName){
               profile.storageFolders[i].file.push(req.body.fileName);
               return true;
              }
       })

       await profile.save()
      
       await fs.files.find((o,i)=>{
         if(o.name===req.body.fileName){
           fs.files[i].uploadedChunks++;
           return 
         }
       }) 
       
       await fs.save()
    
      res.send("File Uploaded")
   }catch(err){
  res.send(err)
}    

})


route.delete('/deleteFile',async(req,res)=>{
     
 try{ const fs=await File.findById(req.body.id);
  
  if(fs===null)
  { 
   res.send("No User")
   return }
   await Chunk.deleteMany({id:req.body.id,name:req.body.fileName},()=>{console.log("delete")})
   await File.updateMany({_id:req.body.id},{"$pull":{"files":{name:req.body.fileName}}})
   res.send("deleted")
}catch(err){
  res.send(err)
}              

})


module.exports=route