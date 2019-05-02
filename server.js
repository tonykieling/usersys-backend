const express = require('express');
const bodyParser = require('body-parser');
const { createUser,
        readAllUsers,
        searchByName,
        searchByEmail,
        updateUser,
        deleteUser,
        getUserId,
        login,
        logout } = require('./database/tools/crudUser.js');
const { displayAllLogs,
        logPerId } = require('./database/tools/crudLogs.js')

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
app.post('/user-create', (req, res) => {
console.log('inside user-create')  
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
  const result = searchByName(name);
  if (!result) {
    res.status(400).send(`User ${name} does NOT exist`);
    return;
  }
  res.send(result);
});


// it gets the user by their email
app.get('/user-email/:email', (req, res) => {
  const email = req.params.email
  const result = searchByEmail(email);

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


// check all logs
app.get('/logs', (req, res) => {
  console.log('checking all logs');
  // res.json(logs);
  res.json(displayAllLogs());
})


// get all logs
app.get('/showLogs', (req, res) => {
  res.json()
})

app.get('/showLogs-name/:name', (req, res) => {
// console.log("name is " + req.params.name)  
  const userId = (getUserId(req.params.name));
  // console.log(logPerId(userId));
  res.send(logPerId(userId));
})


app.post('/login', (req, res) => {
  console.log("login: ", req.body)
  login(req.body) ? res.send("login is OK") : res.status(400).send("Wrong use/password!");
})


app.post('/logout', (req, res) => {
  console.log('logout: ', req.body);
  res.send(logout(req.body.email))
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
