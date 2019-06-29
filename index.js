const express = require('express');
const bodyParser = require('body-parser');
const { createUser,
        updateUser,
        deleteUser,
        login } = require('./database/tools/crudUser.js');

const { allLogs,
        logPerUser,
        logPerType } = require('./database/tools/crudLogs.js')

const { changePermission,
        evenTypesGet,
        searchEmail,
        listUsers } = require('./database/tools/admin.js')

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


// ##############################################################################################
// ###################################  logs method  ############################################
// ##############################################################################################
// it gets all logs
//
//
app.get('/allLogs/:userAdmin', allLogs);
app.get('/logPerUser/:userAdmin', logPerUser);
app.get('/logPerType/:userAdmin', logPerType);




// logs the user logout
// check how to implement this
// ? is the control in the frontend side ?
// ? what about energy or networking shortage ?
// app.post('/logout', (req, res) => {
//   console.log('logout: ', req.body);
//   req.session[req.body.email] = null;
//   res.send(logout(req.body.email))
// });

// ##############################################################################################
// ###################################  ADMIN method  ############################################
// ##############################################################################################
// this method will allow ADMIN USER to grant a normal user ADMIN privileges
app.post('/admin/changePermission', changePermission);

// this method will allow SEARCH function to fetch the EVENTYPES from DB
app.get('/admin/eventypes', evenTypesGet);

// this method will allow SEARCH function to fetch the EVENTYPES from DB
app.post('/admin/searchemail', searchEmail);
app.post('/admin/searchevent', searchEvent);
app.post('/admin/searchdate', searchDate);

// method to list users and admins
app.post('/admin/listUsers', listUsers);


app.listen(PORT, () => console.log(`Service "USER CONTROL SYSTEM" running on port ${PORT}`));
