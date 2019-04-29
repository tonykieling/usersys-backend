const express = require('express');
const bodyParser = require('body-parser');
const { createUser, readAllUsers, readByName, readByEmail } = require('./database/tools/crudUser.js');

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


// it creates the user account
app.post('/create-user', (req, res) => {
  const { name, email, password} = req.body;

  if (!name || !email || !password) {
    res.status(400).send("There is something wrong with the arguments!");
    return;
  }

  const result = createUser({ name: `${name}`, email: `${email}`, password: `${password}` });

  res.send(result);
});


// it gets the user by their name
app.get('/user-name/:name', (req, res) => {
  const name = req.params.name
  const result = readByName(name);

  if (!result) {
    res.status(400).send(`User ${name} does NOT exist`);
    return;
  }

  res.send(result);

});


// it gets the user by their email
app.get('/user-email/:email', (req, res) => {
  const email = req.params.email
  const result = readByEmail(email);

  if (!result) {
    res.status(400).send(`User ${email} does NOT exist`);
    return;
  }

  res.send(result);

});



app.get('/users.json', (req, res) => {
  res.json(user)
});


// console.log(app.locals);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
