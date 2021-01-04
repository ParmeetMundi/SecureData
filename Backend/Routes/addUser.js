const newUSer = require('../models/newUser');
const route=require('express').Router();
const Chunk=require('../models/uploadChunks')
const File=require('../models/fileDetails')

route.post('/',  async(req,res)=>{

    const user=new newUSer({
        "_id":req.body.id,
        "name":req.body.name
    });

          
    const fileDetail=new File({
        "_id":req.body.id
    })
    console.log("in")
     try{
       await user.save();
       await fileDetail.save();
      res.send("ok");
     }catch(e){
      console.log(e)
      res.send(e);
     }  
  
});

module.exports=route;