const express = require('express');
const bodyParser = require('body-parser');
const { createUser,
        readAllUsers,
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


// ##############################################################################################
// ###################################  users method  ###########################################
// ##############################################################################################
// it logs the user into the system
// it suppose to receive email + paswword inside request.body
// it return either user (id, name, email, user_active and user_admin) OR a fail message 
app.post("/login", login);

// it creates the user account
app.post('/user/new', createUser);

// it updates the user info, only name or email for now
// it receives email as the user identification
// it return user (id, name, email, user_active, user_admin) OR a fail message
app.put("/user", updateUser);

// it deletes (actually deactivate) the user
// it receives email as the user identification
// it return user (id, name, email, user_active, user_admin) OR a fail message
app.delete('/user', deleteUser);



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
// check how to implement this
// ? is the control in the frontend side ?
// ? what about energy or networking shortage ?
app.post('/logout', (req, res) => {
  console.log('logout: ', req.body);
  req.session[req.body.email] = null;
  res.send(logout(req.body.email))
});


app.listen(PORT, () => console.log(`Service "USER CONTROL SYSTEM" running on port ${PORT}`));
