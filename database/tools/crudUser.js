const userDB = require('../db/userDB.js');
const randomID = require('./randomGen.js');

// user register
// it has to receive name, email and password
const createUser = (newUser) => {
  const db = userDB;
  const { name, email, password } = newUser;
  const id = randomID();

  db[id] = {
    id,
    name,
    email,
    password,
    user_admin: false
  }

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
const readByName = (name) => {
  const db = userDB;
  for (let k in db)
    if (db[k].name.toLowerCase() === name.toLowerCase()) return { name: db[k].name, email: db[k].email} ;

  return false;
}


// query user by email
// It's NOT case sensitive due to the 'toLowerCase' invoked function
// it returns name + email OR false, if it doesn't match
const readByEmail = (email) => {
  const db = userDB;
  for (let k in db)
    if (db[k].email.toLowerCase() === email.toLowerCase()) return { name: db[k].name, email: db[k].email} ;

  return false;
}


// it gets the userId searching by their name
const getUserId = (name) => {
  const db = userDB;
  for (let k in db)
    if(db[k].name.toLocaleLowerCase() === name.toLocaleLowerCase())
      return(db[k].id);

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

    db[userDbID] = {
      name,
      email
    }

    return ({status: true, message: `User ${db[userDbID].name} has been updated successfully.`});
  }

  return {status: false, message: `User ${userId} not found.`};
}


module.exports = {
  createUser,
  readAllUsers,
  readByName,
  readByEmail,
  updateUser
}