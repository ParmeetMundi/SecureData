const express = require('express')
const mongoose= require('mongoose');


const app=express();
const url='mongodb://127.0.0.1:27017/hell';

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


app.listen(8080,()=>{
    console.log("server started");
})