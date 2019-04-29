const express = require('express');
const bodyParser = require('body-parser');
const { createUser,
        readAllUsers,
        readByName,
        readByEmail,
        updateUser,
        deleteUser } = require('./database/tools/crudUser.js');

const app = express();
const PORT = 3333;

// without using middleware (placed before them)
app.get('/', (req, res) => {
  console.log('root directory');
  res.status(200).send('this is root directory');
});

// middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use( (req, res, next) => {
  console.log('use general- middleware');
  // res.status(200).send(`2- middleware return`);
  next();
});


// ###########
// USER ROUTES
// ###########

// middleware specific and only for '/users' route and
//  it HAVE to be placed before that route
//  and it HAVE to call next to invoke the route (or another desired mdw)
app.use('/users', (req, res, next) => {
  console.log('This mdw is only for \'/users\' route!');
  next();
});

// it gets all users from the db
app.get('/users', (req, res) => {
  res.send(readAllUsers());
});


// another way to get data, using res.json
app.get('/users.json', (req, res) => {
  res.json(user) //it's not working due there is no access to userDB, only crudUSer
});


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


// it updates the user info, only name or email for now
// in this route the app HAVE to receive name as params
// and the data to change in the body
app.post('/user-update/:name', (req, res) => {
  const userId = req.params.name;
  const { name, email } = req.body;
  const result = updateUser({ userId, user: { name, email } });

  result.status ?
    res.send(result.message) :
    res.status(400).send(result.message);

  // res.json(result); // it can return an whole object
});


// it deletes the user
// in this route the app HAVE to receive name as params
app.post('/user-delete/:name', (req, res) => {
  const userId = req.params.name;

  const result = deleteUser(userId);

  result.status ?
    res.send(result.message) :
    res.status(400).send(result.message);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
