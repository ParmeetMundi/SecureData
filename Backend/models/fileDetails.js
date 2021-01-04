const mongoose=require('mongoose');

const fileDetail= new mongoose.Schema({
     _id:{
       type:String,
       required:true
     },

     files:[
       {
          name:{type:String},
          size:Number,
          folderName:String,
          chunkSize:Number,
          NoOfChunks:Number,
          uploadedChunks:Number
       }
     ]

})

module.exports=mongoose.model("File",fileDetail)
