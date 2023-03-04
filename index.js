let express = require('express');
let path = require('path');

let app = express();

app.use(express.static('public'))

app.set('views', path.join(__dirname, 'demoSites'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/popup/confirmation', (req, res) => {
  setTimeout( _ => {
    if (Math.random() > 0.8) {
      console.log('POST popup/confirmation ERR');
      return res.status(500).json({
        confirmationTracked: false
      })
    }

    console.log('POST popup/confirmation OK');
    res.json({
      confirmationTracked: true
    })
  }, Math.random() * 1000)
});

app.get('/popup', (req, res) => {
  setTimeout( _ => {
    if (Math.random() > 0.8) {
      console.log('GET popup ERR');
      return res.status(500).json({})
    }

    console.log('GET popup OK');
    res.json({
      message: "<p>This is an important message which requires a confirmation.</p>"
    })
  }, Math.random() * 1000)
});


app.listen(4000, () => console.log('Example app listening on port 4000!'));