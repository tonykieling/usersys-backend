const userDB = require('../db/userDB.js');

const createUser = (newUser) => {
  const { name, email, password } = newUser;
  console.log("name: ", name, " email: ", email, " password: ", password);
  console.log('inside createUSer');
  return ('OK123');
}

// this is a function wich returns all user
const readAllUsers = () => {
  if (!userDB)
    return ('There is no user registered!');

  return (userDB);
}

// query user by name
// it returns the name + email OR false, if it doesn't match
const readByName = (name) => {
  const db = userDB;
  for (let k in db)
    if (db[k].name === name) return { name: db[k].name, email: db[k].email} ;

  return false;
}

// query user by email
// it returns name + email OR false, if it doesn't match
const readByEmail = (email) => {
  const db = userDB;
  for (let k in db)
    if (db[k].email === email) return { name: db[k].name, email: db[k].email} ;

  return false;
}

module.exports = {
  readAllUsers,
  readByName,
  readByEmail,
  createUser,
}