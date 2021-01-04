const mongoose= require('mongoose');

const newUser=new mongoose.Schema({
     _id:{
         type: String,
         required : true
     },
   
    name:{
        type:String,
        required:true
    },


    //folders is array of name of folders 
    folders:[String],
   
    //storageFolders is array
    //each array element has foldername and file array
    storageFolders:[
       {
            
                       folderName:{type:String},
                       file:[]
       }    
    ],

    created:{
        type:Date,
        default:Date.now
    }
    
     
});




module.exports=mongoose.model('newUser',newUser);