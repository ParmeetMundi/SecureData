const express = require('express')
const mongoose= require('mongoose');
const path= require('path');
//import { fileURLToPath } from 'url';
const fileURLToPath= require('url')
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const port=process.env.PORT||8080

const app=express();
const url='mongodb+srv://SecureData:SecureData@cluster0.6wruk.mongodb.net/SecureData?retryWrites=true&w=majority';

app.use(express.json({limit: '25mb'}));

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin ,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("db connected");
  
});

const newuserRouter=require('./Routes/addUser')
app.use('/newuser',newuserRouter);

const Storage=require('./Routes/Storage')
app.use('/storage',Storage);

const upload=require('./Routes/uploads')
app.use('/uploadFile',upload);

const download=require('./Routes/downloads')
app.use('/GetFile',download);

if ( process.env.NODE_ENV == "production"){

  app.use(express.static(path.join(__dirname, 'Frontend/build')));
  app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, 'Frontend/build', 'index.html'));
 });

}

app.listen(port,()=>{
    console.log("server started");
})