const userDB = require('../db/userDB.js');
const randomID = require('./randomGen.js');
const { recordLog } = require('./crudLogs.js');
const eventType = require('./eventType.js');
// const bcrypt = require('bcrypt');

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
});


// user register
// it has to receive name, email and password
// createUser = (newUser) => {
  //   return new Promise((resolve, reject) => {
    //     const event = eventType.create_user;
    //     console.log("eventType= ", event)
    //     console.log("userDBbefore: ", Object.keys(userDB).length);
    //     const db = userDB;
    //     const { name, email, password } = newUser;
    //     const id = randomID();
    //     db[id] = {
      //       id,
      //       name,
      //       email,
      //       password,
      //       user_admin: false
      //     };
      //     logs(id, event);
      //     console.log("\n\nuserDBafter: ", Object.keys(userDB).length)
      //     return (`User ${name} has been created!`);   
      //   })
// }
createUser = (newUser) => {
  const event = eventType.create_user;
  console.log("eventType= ", event)
  console.log("userDBbefore: ", Object.keys(userDB).length);
  const db = userDB;
  const { name, email, password } = newUser;
  const id = randomID();
  db[id] = {
    id,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    deleted: false,
    user_admin: false
  };
  recordLog(id, event);
  console.log("\n\nuserDBafter: ", Object.keys(userDB).length)
  return (`User ${name} has been created!`);   
}

const readAllUsers = (request, response) => {
console.log("inside getUsers");
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      response.send("Something bad happened, try it again..")
      throw error
    }
    response.status(200).json(results.rows);
  });
}

// // login method
login = (request, response) => {
  console.log("inside login method");
  const receivedUser = request.body;
  console.log("receivedUser: ", receivedUser);
  pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', 
  [receivedUser.email, receivedUser.password], (error, result) => {
    // return new Promise((res, rej) => {
      try {
        if (error) {
          // /////////////////////////////
          // need to check the error/catch moment
          // console.log(`error = ${error.message}`);
          // response.send("11login was bad, try again, please");
          // return;
          throw error;
        }

        // console.log(`result = ${JSON.stringify(result)}`);
        if (result.rowCount > 0) {
          console.log("result===> ", result.rows[0].id);
          const {id, name, email, user_admin, user_active} = result.rows[0];
          const user = {id, name, email, user_admin, user_active};
          // response.status(200).send(`Hi ${JSON.stringify(user)}`);
          // response.status(200).send(user);
          response.send(user);
          return;
          // response.status(200).send(res(user));
          // return(res(user));
          // res(user);
        } else {
          response.status(400).send({message: "user/password wrong!"});
          // res("user/password wrong!")
          // return;
        }
      } catch (err) {
        console.log("errorr: ", err.message);
        response.send("22login was bad, try again, please");
        // res("22login was bad, try again, please");
      }
    })

// })
}


// query user by name.
// It's NOT case sensitive due to the 'toLowerCase' invoked function
// it returns the name + email OR false, if it doesn't match
const searchByName = (name) => {
  const db = userDB;
  for (let k in db)
    if (db[k].name.toLowerCase() === name.toLowerCase())
      return { name: db[k].name, email: db[k].email, id: db[k].id };

  return false;
}


// query user by email
// It's NOT case sensitive due to the 'toLowerCase' invoked function
// it returns name + email OR false, if it doesn't match
const searchByEmail = (email) => {
  const db = userDB;
  for (let k in db)
    if (db[k].email.toLowerCase() === email.toLowerCase())
      return { name: db[k].name, email: db[k].email, id: db[k].id } ;

  return false;
}


// it gets the userId searching by their name
// p.s.: it's a very poor criteria because it catchs the first register
// with the specified name
// this function is not supposed to be used, it's better handle the id instead name, but just in case.
const getUserId = (name) => {
  console.log("getuserID, name: ", name)

  const db = userDB;
  for (let k in db) {
    if(db[k].name.toLowerCase() === name.toLowerCase())
      return(db[k].id);
  }
  return false;
}


// this func updates either name or email's user, only for now
// the argument choosed was name
const updateUser = (data) => {
  const userId = data.userId;
  const userDbID = getUserId(userId); // it grabs user's db id

  if (userDbID) {
    const db = userDB;
    const { name, email } = data.user;

    // this option uses spread operator and changes only the data passed after that
    db[userDbID] = { ...db[userDbID], name, email } 
    
    // the option bellow needs to pass each data, more lines to write down..
    // db[userDbID].name = name;
    // db[userDbID].email = email;

    recordLog(userDbID, eventType.update_user);
    return ({status: true,
            message: `User ${db[userDbID].name} has been updated successfully.`,
            user: db[userDbID]});
            // the message also returns the new user data, just in case.
  }

  return {status: false, message: `User ${userId} not found.`};
}




checkPassword = (user) => {
  const { email, password } = user;
  const db = userDB;
  const userId = searchByEmail(email);
  if (!userId) return "NoUser";

  if(bcrypt.compareSync(password, db[userId.id].password)) {
    // req.session.user_id = userId;
  // if (db[userId.id].password === password)
    return {status: true, id: userId.id};
  }
  return {status: false, id: userId.id};
}


logout = (email) => {
  const user = searchByEmail(email);
console.log("user= ", user);
  recordLog(user.id, eventType.logout);
  return (`${user.name} was logouted`);
}


// actually this method deactivate the user
// by setting as true the field deleted
const deleteUser = (nameUser) => {
  const userDbID = getUserId(nameUser); // it grabs user's db id

  if (userDbID) {
    const db = userDB;
    const tempUser = db[userDbID].id;
    // delete db[userDbID];   //old way, without consider login for deleted users
    // new way is
    db[userDbID].deleted = true;
    recordLog(tempUser, eventType.delete_user);
    return ({status: true,
            message: `User ${nameUser} has been deleted successfully.`});
  }

  recordLog(null, eventType.delete_fail)
  return {status: false, message: `User ${nameUser} not found.`};
}

module.exports = {
  readAllUsers,
  login,

  createUser,
  searchByName,
  searchByEmail,
  updateUser,
  deleteUser,
  getUserId,
  logout
}