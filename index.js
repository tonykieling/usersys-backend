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
const cors = require('cors');
const app = express();
const PORT = 3333;
app.use(cors());

// const cookieSession = require('cookie-session');
// app.use(cookieSession({
//   name: 'session',
//   keys: ['*K3y+'],
//   maxAge: 24 * 60 * 60 * 1000
// }));

// without using middleware (placed before them)
app.get('/', (req, res) => {
  console.log("root directory");
  res.status(200).send({message: "this is root directory"});
});

// middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
 
// parse application/json
app.use(bodyParser.json());

app.use( (req, res, next) => {
  // console.log('use general- middleware');
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
  // console.log('This mdw is only for \'/users\' route! It does NOTHING, only to register');
  next();
});

// it gets all users from the db
app.get("/users", readAllUsers);

app.post("/login", login)


// // another way to get data, using res.json
// //it's not working due there is no access to userDB, only crudUSer
// app.get('/users.json', (req, res) => {")
//   res.json(user)
// });


// it creates the user account
app.post('/user/new', createUser);


// it updates the user info, only name or email for now
// in this route the app HAVE to receive name as params
// and the data to change in the body
app.put("/user", updateUser);


// it gets the user by their name
app.get('/users/name/:name', (req, res) => {
  const name = req.params.name
  const result = searchByName(name);
  if (!result) {
    res.status(400).send(`User ${name} does NOT exist`);
    return;
  }
  res.send(result);
});

// it gets the user by their email
app.get('/users/email/:email', (req, res) => {
  const email = req.params.email
  const result = searchByEmail(email);

  if (!result) {
    res.status(400).send(`User ${email} does NOT exist`);
    return;
  }

  res.send(result);
});


// it deletes the user
// in this route the app HAVE to receive name as params
app.delete('/user', deleteUser);
// (req, res) => {
//   const userId = req.params.name;

//   const result = deleteUser(userId);

//   result.status ?
//     res.send(result.message) :
//     res.status(400).send(result.message);
// });


// get all logs
app.get('/showLogs', (req, res) => {
  res.json()
});


// check all logs
app.get('/logs', (req, res) => {
  // console.log('checking all logs');
  // res.json(logs);
  res.json(displayAllLogs());
});


// gets all logs based on the user's name
app.get('/logs/:name', (req, res) => {
console.log("name is " + req.params.name)  
  const userId = (getUserId(req.params.name));
  console.log("userId: ", userId);
  console.log(logPerId(userId));
  res.send(logPerId(userId));
});


// logs in the user
// app.post('/login', (req, res) => {
//   console.log("login: ", req.body)
//   if (login(req.body)) {
//     req.session.userId = req.body.email;
//     res.send("login is OK");
//     return;
//   }
  
//   res.status(400).send("Wrong use/password!");
// });


// logs the user out
app.post('/logout', (req, res) => {
  console.log('logout: ', req.body);
  req.session[req.body.email] = null;
  res.send(logout(req.body.email))
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
