const route=require('express').Router()
const Chunk=require('../models/uploadChunks');
const newUser=require('../models/newUser');
const File=require('../models/fileDetails');


route.get('/fileDetails',async(req,res)=>{

    try{
       const user=await File.findById(req.query.id)
        
       if(user===null){
          throw "No User"
       }
       
       user.files.find((o,i)=>{
         if(o.name===req.query.fileName&&o.folderName===req.query.folderName){
        
            res.json({
              "NoOfChunks":o.NoOfChunks,
              "fileSize":o.size
           }) 
            return true
         }

       })
       

   }catch(err){
       res.send(err)
   }
})


route.get('/',async(req,res)=>{

    try{
       const chunk=await Chunk.find({id:req.query.id,folderName:req.query.folderName,name:req.query.fileName,
        chunkNumber:req.query.chunkNumber})

       if(chunk===null){
          throw "No User"
       }
        
       res.send(chunk[0])


   }catch(err){
       res.send(err)
   }
})

route.delete('/deleteFile',async(req,res)=>{
    
     try{

       const user = await newUser.findById(req.body.id)
      
       if(user===null){
          throw "No User"
       }

      //delete from newUser
      let fileIndex=-1
      const folderIndex=user.folders.indexOf(req.body.folderName);
      if(folderIndex>-1)
      {fileIndex=user.storageFolders[folderIndex].file.indexOf(req.body.fileName)}
      if(fileIndex>-1)
      {user.storageFolders[folderIndex].file.splice(fileIndex,1)}
       await user.save()
       

       //delete chunks
       await Chunk.deleteMany({id:req.body.id,folderName:req.body.folderName,name:req.body.fileName})
       
      
      
      //delete from fsDetails
       let ind=-1
      const fsDetails=await File.findById(req.body.id)
          await  fsDetails.files.find((o,i)=>{
                if(o.name===req.body.fileName){
                   ind=i
                   return
                }
            })
            
          if(ind>-1){
             fsDetails.files.splice(ind,1);
             await fsDetails.save()
           }  
           
         res.send("file Deleted")
      }catch(err){
         console.log(err)
         res.send(err)
      }

})

module.exports=route