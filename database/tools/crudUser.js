const userDB = require('../db/userDB.js');
const randomID = require('./randomGen.js');
const { recordLog } = require('./crudLogs.js');
const eventType = require('./eventType.js');
const bcrypt = require('bcrypt');

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
});

// auxiliary function to check whether the user (EMAIL) exists in the database
// it receives user email
// it returns an object either {id, name, email, user_admin, user_active} OR message (if it fails)
checkUserEmail = email => {
  return new Promise((res, rej) => {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      try {
        if (error) {
          recordLog(null, event);
          throw error;
        }
        if (result.rowCount > 0) {
          console.log("checkUserEmail result===> ", result.rows[0].id);
          const { id, name, email, user_admin, user_active } = result.rows[0];
          const user = { id, name, email, user_admin, user_active };
          const event = eventType.check_user_email_success;
          recordLog(user.id, event);
          res(user)
        } else {
          const event = eventType.check_user_email_fail;
          recordLog(email, event);
          res({message: `checkUserEmail - NO user to ${email}!`});
        }
      } catch (err) {
        console.log("checkUserEmail error: ", err.message);
        const event = eventType.check_user_email_fail;
        recordLog(null, event);
        res({message: "Something BAD has happened! Try it again."});
      }
    });
  });
}


// it checks whether the user (email + password) are OK
// it receives user email and password inside user variable
// it returns an object either {id, name, email, user_admin, user_active} OR message (if it fails)
userQuery = user => {
  return new Promise((res, rej) => {
    // the query can be replaced for checkUserEmail
    // tryed but no success because it needs to be async.
    // tryed async before user and inside Promise, but NO success
    pool.query('SELECT * FROM users WHERE email = $1', [user.email], (error, result) => {
      try {
        if (error) {
          console.log(`userQuery error = ${error.message}`);
          throw error;
        }
        if (result.rowCount > 0) {
          const userFromQuery = result.rows[0];
          if(bcrypt.compareSync(user.password, userFromQuery.password)){
            res({
              id: userFromQuery.id,
              email: userFromQuery.email,
              name: userFromQuery.name,
              userActive: userFromQuery.user_active,
              userAdmin: userFromQuery.user_admin
            });
          }
        } else {
          res({message: "user/password wrong!"});
        }
      } catch (err) {
        console.log("userQuery error: ", err.message);
        res({message: "Something BAD has happened! Try it again."});
      }
    });
  });
}


// create user method
// it receives user data to be created through request(with data inside body)
// it returns an object either {id, name, email, user_admin, user_active} OR message (if it fails)
createUser = async (request, response) => {
  console.log("inside createUser");
  const receivedUser = request.body;
  const { name, email, password } = receivedUser;

  const result = await checkUserEmail(email);
  if (result.id) {
    const event = eventType.create_user_fail;
    recordLog(result.id, event);
    response.send({message: `Email ${email} already exists.`});
    return;
  }

  pool.query('INSERT INTO users (email, name, password, user_active, user_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, user_active, user_admin', 
    [email, name, bcrypt.hashSync(password, 10), false, false], (error, result) => {
      try {
        if (error) {
          console.log(`createUser error = ${error.message}`);
          throw error;
        }
        const event = eventType.create_user_success;
        const user = result.rows[0];
        recordLog(user.id, event);
        response.send(user);
        return;
      } catch (err) {
        const event = eventType.create_user_fail;
        recordLog(null, event);
        console.log("createUser error: ", err.message);
        response.send({message: "Something BAD has happened! Try it again."});
      }
    });
}

// login method
// it receives user data to be logged through request(with data inside body)
// it returns an object either {id, name, email, user_admin, user_active} OR message (if it fails)
login = async (request, response) => {
  console.log("inside login method");
  const receivedUser = request.body;
  const result = await userQuery(receivedUser);
  if (result.id) {
    const event = eventType.login_success;
    recordLog(result.id, event);
  }
  else {
    const event = eventType.login_fail;
    recordLog(receivedUser.email, event);
  }

  response.send(result)
}


// this methos updates user info
// it receives user id and the data to be changed through request(with data inside body)
// it returns an object either {id, name, email, user_admin, user_active} OR message (if it fails)
const updateUser = async (request, response) => {
  console.log("inside updateUser");
  const { id, email, name, actualEmail } = request.body;
  const result = await checkUserEmail(actualEmail);
  if (result.id) {
    pool.query(
      'UPDATE users SET email = $1, name = $2, user_active = $3, user_admin = $4 WHERE id = $5 RETURNING email, name, user_active, user_admin',
      [email, name, false, false, id], (error, result) => {
      try {
        if (error) {
          console.log(`updateUser error = ${error.message}`);
          throw error;
        }
        const event = eventType.update_user_success;
        const user = result.rows[0];
        recordLog(user.id, event);
        response.send(user);
        return;
      } catch (err) {
        const event = eventType.create_user_fail;
        recordLog(null, event);
        console.log("updateUser error: ", err.message);
        response.send({message: "Something BAD has happened! Try it again."});
      }
    });
  } else {
    console.log("something wrong with update");
    response.send({message: "Error - UPDATE"});
  }
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