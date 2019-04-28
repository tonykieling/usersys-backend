const express = require('express');
const bodyParser = require('body-parser');
// const user = require('./database/userDB.js');
// const logs = require('./database/logsDB.js');
// const randomID = require('./database/randomGen.js');
const {createUser, readAllUsers, readByName} = require('./database/tools/crudUser.js');

const app = express();
const PORT = 3333;

app.get('/', (req, res) => {
  console.log('root directory');
  res.status(200).send('this is root directory');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( (req, res, next) => {
  console.log('use general- middleware');
  // res.status(200).send(`2- middleware return`);
  next();
});

// it gets all users from the db
app.get('/users', (req, res) => {
  res.send(readAllUsers());
})


// it gets the user by their name
app.get('/userByName/:name', (req, res) => {
  const tempName = req.params.name;
console.log("tempName: ", tempName);
  res.send(readByName(tempName));

})




app.get('/users.json', (req, res) => {
  res.json(user)
});

// app.get('/user/:name', (req, res) => {
//   const tempUser = user[req.params.name];
//   console.log('user', tempUser);
//   res.send(tempUser);
//   // res.status(200).send('asd is OK');
// });

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
