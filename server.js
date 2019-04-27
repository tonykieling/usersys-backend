const express = require('express');
const bodyParser = require('body-parser');
// const router = express.Router();

const app = express();
const PORT = 3333;

// router.get('/', (req, res) => {
//   console.log('router');
//   res.status(200).send('router');
// });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( (req, res, next) => {
  console.log('use general- middleware');
  // res.status(200).send(`2- middleware return`);
  next();
});

app.use('/asd', (req, res, next) => {
  console.log('/asd- middleware');
  next();
});

app.get('/asd', (req, res) => {
  console.log('/asd', req.route);
  res.send(req.body);
  // res.status(200).send('asd is OK');
});

// app.set('temp', 'temporary variable');

// console.log(app.locals);

app.get('/', (req, res, next) => {
  console.log('GET method', req.method, 'url', req.url);
  res.status(200).send(`method= ${req.method}, url=${req.url}`);
});

// app.get('/', (err, req, res, next) => {
//   console.log('ERROR', err);
//   res.render('error', { error: err });
// });

app.post('/asd', (req, res) => {
  console.log('POST method', req.method, 'url', req.url);
  res.status(200).send(`method= ${req.method}, url=${req.url}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
