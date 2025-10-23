const express = require('express');
const app = express();
const port = 3000
const path = require('path');
const fs = require('fs')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


// ya home screen ka route ha jisma hame pata chala ga ki hamna kon konse file rakhe ha
app.get('/', (req, res) => {
  fs.readdir('./files', (err, file) => {
    if (err) {
      console.log(err)
      return;
    }
    const allFiles = file.map(file => {
      const content = fs.readFileSync(`./files/${file}`, 'utf-8');
      // Shorten details (first 80 characters)
      const preview = content.length > 50 ? content.slice(0, 50) + '...' : content;
      return { name: file, details: preview };
    });
    res.render('index', { files: allFiles });
  });
})
// ya hame new files bana ma help kara ga ki jo hame files bane ha jo uska data store kar ka usko file banya ga or uska data usma show kara ga
app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')}.txt` , req.body.details , (err)=>{
    res.redirect('/')
  });
})
// ya hame file ko pura pane ma help karta ha ki hamere file ka data kya kya ha
app.get('/file/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`,"utf-8",(err, fileData) => {
    if (err) {
    console.log(err)
      return;
    }
   res.render('show' , {fileName : req.params.filename , fileData: fileData})
  });
})

// ya hame edit page ma la jana ka kam karta ha 
app.get('/edit/:filename', (req, res) => {
  // res.send('your in edit routes')
  fs.readFile(`./files/${req.params.filename}`,"utf-8",(err, fileData) =>{
    if(err){
      console.log(err)
      return;
    }
     res.render('edit' , {filename : req.params.filename , fileData : fileData}) 
  })
 
})

// ya hame edit file ko rename or content ko bhi new name karna ma help karta ha 
app.post('/edits', (req, res) => {

const oldPath = `./files/${req.body.oldTitle}.txt`;
const newpath = `./files/${req.body.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')}.txt`
 fs.rename(oldPath, newpath, (err)=>{
   if (err) {
      console.log('Rename error:', err);
      return res.send('Error renaming file');
    }

  const newContent = req.body.details && req.body.details.trim() !== '' ?req.body.details : req.body.oldDetails;
  
  fs.writeFile(newpath , newContent , ()=>{
    if (err) {
      console.log('Write error:', err);
      return res.send('Error updating file content');
     }
     res.redirect('/')
  })
 })
})

// ya hame file ko delete karna ma help karta ha
app.get('/delete/:filename', (req, res) => {
  // res.send('your in edit routes')
  fs.unlink(`./files/${req.params.filename}`,(err) =>{
    if (err) {
      console.log('Delete error:', err);
      return res.send('Error deleting file');
    }``
     res.redirect('/') 
  })
 
})

// ya hame port baata ha ki ham ko port ma ha
app.listen(port, (req, res) => {
  console.log(`Your server is Running is port ${port}`)
})
