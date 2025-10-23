const express = require('express');
const app = express();
const port = 3000
const path = require('path');
const fs = require('fs')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



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

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')}.txt` , req.body.details , (err)=>{
    res.redirect('/')
  });
})

app.get('/file/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`,"utf-8",(err, fileData) => {
    if (err) {
    console.log(err)
      return;
    }
   res.render('show' , {fileName : req.params.filename , fileData: fileData})
  });
})


app.listen(port, (req, res) => {
  console.log(`Your server is Running is port ${port}`)
})
