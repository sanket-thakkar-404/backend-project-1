const express = require('express');
const app = express();
const port = 3000 
const path = require('path');
const fs  = require('fs')


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set('view engine' , 'ejs');
app.use(express.static(path.join(__dirname , 'public')));



app.get('/' , (req,res)=>{
 fs.readdir('./files', (err, file) => {
  if(err) {
    console.Console.log(err)
    return;
  }
  res.render('index' , {files : file});
});

  
})


app.listen(port, (req,res)=>{
  console.log(`Your server is Running is port ${port}`)
})
