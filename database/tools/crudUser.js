const userDB = require('../db/userDB.js');
const randomID = require('./randomGen.js');
const { recordLog } = require('./crudLogs.js');
const eventType = require('./eventType.js');
const bcrypt = require('bcrypt');

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
  
  
// this is a function which returns all user
const readAllUsers = () => {
  if (!userDB)
    return ('There is no user registered!');

  return (userDB);
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


login = (user) => {
  const userId = (checkPassword(user));
  if (userId === "NoUser") {
    recordLog(null, eventType.login_fail);
    return false;
  }

  if (userId.status) {
    recordLog(userId.id, eventType.login);
    return true;
  }

  recordLog(userId.id, eventType.login_fail);
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
  createUser,
  readAllUsers,
  searchByName,
  searchByEmail,
  updateUser,
  deleteUser,
  getUserId,
  login,
  logout
}