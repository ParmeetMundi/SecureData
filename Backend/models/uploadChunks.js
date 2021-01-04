const mongoose=require('mongoose');


const chunk =new mongoose.Schema({
    
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },     
    chunkNumber:{
        type:Number,
        required:true
    },
    folderName:{
        type:String,
        required:true
    }
    ,
    data:{
        type:String,
        required:true
    }
 

}) 

chunk.indexes({id:1,folderName:1,name:1,chunkNumber:1},{unique:true})


module.exports=mongoose.model("Chunk",chunk)