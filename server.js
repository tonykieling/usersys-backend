const express = require('express');
const router = express.Router();

const app = express();
const PORT = 3333;

// router.get('/', (req, res) => {
//   console.log('router');
//   res.status(200).send('router');
// });

app.use((req, res, next) => {
  console.log('1- middleware');
  next();
});

app.use( (req, res, next) => {
  console.log('2- aux');
  // res.status(200).send(`2- middleware return`);
  next();
});

app.get('/', (req, res) => {
  console.log('3- method', req.method, 'url', req.url);
  res.status(200).send(`method= ${req.method}, url=${req.url}`);
});


// router.use((req, res) => console.trace('useX'));
// router.param((req, res) => console.trace(id));
// app.param((req, res) => console.trace(id));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
