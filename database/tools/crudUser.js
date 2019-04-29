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


// query user by name
// it returns the name + email OR false, if it doesn't match
const readByName = (name) => {
  const db = userDB;
  // for (let k in db)
  //   if (db[k].name === name) return { name: db[k].name, email: db[k].email} ;
// console.log("db: ", db)
//   db.forEach(user => console.log(`user= ${user.name} - ${user.email}`));

  (db.filter(user => user.name === name)) ?
    // return { name: user.name, email: user.name} :
  console.log("result- ", name) :
console.log('no user')
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